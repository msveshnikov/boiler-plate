import express from 'express';
import cors from 'cors';
import fs from 'fs';
import promBundle from 'express-prom-bundle';
import { promises as fsPromises } from 'fs';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getTextGemini } from './gemini.js';
import { getTextGrok } from './grok.js';
import { getTextGpt } from './openai.js';
import { getTextDeepseek } from './deepseek.js';
import User from './models/User.js';
import Presentation from './models/Presentation.js';
import Feedback from './models/Feedback.js';
import { replaceGraphics } from './imageService.js';
import userRoutes from './user.js';
import adminRoutes from './admin.js';
import { authenticateToken, authenticateTokenOptional } from './middleware/auth.js';
import { fetchSearchResults, searchWebContent } from './search.js';
import { enrichMetadata } from './utils.js';
import { getTextClaude } from './claude.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    if (req.originalUrl === '/api/stripe-webhook') {
        next();
    } else {
        express.json({ limit: '15mb' })(req, res, next);
    }
});

const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    customLabels: { model: 'No' },
    transformLabels: (labels, req) => {
        labels.model = req?.body?.model ?? 'No';
        return labels;
    }
});
app.use(metricsMiddleware);
app.use(cors());
app.use(express.static(join(__dirname, '../dist')));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 130
});

if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
}

mongoose.connect(process.env.MONGODB_URI, {});

userRoutes(app);
adminRoutes(app);

const generateAIResponse = async (prompt, model, temperature = 0.7) => {
    switch (model) {
        case 'o3-mini':
        case 'gpt-4o-mini': {
            return await getTextGpt(prompt, model, temperature);
        }
        case 'gemini-2.0-pro-exp-02-05':
        case 'gemini-2.0-flash-001':
        case 'gemini-2.0-flash-thinking-exp-01-21':
            return await getTextGemini(prompt, model, temperature);
        case 'deepseek-reasoner':
            return await getTextDeepseek(prompt, model, temperature);
        case 'claude-3-7-sonnet-20250219':
            return await getTextClaude(prompt, model, temperature);
        case 'grok-2-latest':
        case 'grok-3-mini':
            return await getTextGrok(prompt, model, temperature);
        default:
            throw new Error('Invalid model specified');
    }
};

export const getIpFromRequest = (req) => {
    let ips = (
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        ''
    ).split(',');
    return ips[0].trim();
};

export const checkAiLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (
            user &&
            user.subscriptionStatus !== 'active' &&
            user.subscriptionStatus !== 'trialing'
        ) {
            const now = new Date();
            if (user.lastAiRequestTime) {
                const lastRequest = new Date(user.lastAiRequestTime);
                if (now.toDateString() === lastRequest.toDateString()) {
                    if (user.aiRequestCount >= 3) {
                        return res
                            .status(429)
                            .json({ error: 'Daily presentation limit reached, please upgrade' });
                    }
                    user.aiRequestCount++;
                } else {
                    user.aiRequestCount = 1;
                    user.lastAiRequestTime = now;
                }
            } else {
                user.lastAiRequestTime = now;
                user.aiRequestCount = 1;
            }
            await user.save();
        }
        next();
    } catch (err) {
        next(err);
    }
};

const extractCodeSnippet = (text) => {
    const codeBlockRegex = /```(?:json|js|html)?\n([\s\S]*?)\n```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1] : text;
};

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

app.get('/api/presentations', async (req, res) => {
    try {
        const search = req.query.search;
        let filter = { $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }] };
        if (search) {
            filter = {
                $and: [
                    filter,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }
        const presentations = await Presentation.find(filter).sort({ createdAt: -1 }).limit(300);
        const limitedPresentations = presentations.map((presentation) => ({
            _id: presentation._id,
            title: presentation.title,
            description: presentation.description,
            model: presentation.model,
            firstSlideTitle:
                presentation.slides && presentation.slides.length > 0
                    ? presentation.slides[0].title
                    : null,
            slug: presentation.slug
        }));
        res.status(200).json(limitedPresentations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/mypresentations', authenticateToken, async (req, res) => {
    try {
        const search = req.query.search;
        let query = { userId: req.user.id };
        if (search) {
            query = {
                $and: [
                    query,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }
        const presentations = await Presentation.find(query);
        const limitedPresentations = presentations.map((presentation) => ({
            _id: presentation._id,
            title: presentation.title,
            description: presentation.description,
            model: presentation.model,
            firstSlideTitle:
                presentation.slides && presentation.slides.length > 0
                    ? presentation.slides[0].title
                    : null,
            slug: presentation.slug
        }));
        res.status(200).json(limitedPresentations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/presentations/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        let presentation = null;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            presentation = await Presentation.findById(identifier);
        }
        if (!presentation) {
            presentation = await Presentation.findOne({ slug: identifier });
        }
        if (!presentation) return res.status(404).json({ error: 'Presentation not found' });
        res.status(200).json(presentation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/presentations/:id', authenticateToken, async (req, res) => {
    try {
        const presentationId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(presentationId)) {
            return res.status(400).json({ error: 'Invalid presentation ID' });
        }

        const presentation = await Presentation.findById(presentationId);
        if (!presentation) {
            return res.status(404).json({ error: 'Presentation not found' });
        }

        if (presentation.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res
                .status(403)
                .json({ error: 'Unauthorized: You do not own this presentation' });
        }

        await Presentation.findByIdAndDelete(presentationId);
        res.status(200).json({ message: 'Presentation deleted successfully' });
    } catch (error) {
        console.error('Error deleting presentation:', error);
        res.status(500).json({ error: 'Failed to delete presentation' });
    }
});

app.post('/api/feedback', authenticateTokenOptional, async (req, res) => {
    try {
        const { message, type } = req.body;
        const feedback = new Feedback({
            userId: req?.user?.id,
            message,
            type,
            createdAt: new Date()
        });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const event = await stripe.webhooks.constructEventAsync(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WH_SECRET
        );

        console.log('✅ Success:', event.id);

        switch (event.type) {
            case 'customer.subscription.updated':
            case 'customer.subscription.created':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                console.log(subscription);
                const customer = await stripe.customers.retrieve(subscription.customer);
                const user = await User.findOneAndUpdate(
                    { email: customer.email },
                    {
                        subscriptionStatus: subscription.status,
                        subscriptionId: subscription.id
                    }
                );
                if (!user) {
                    console.error(`User not found for email ${customer.email}`);
                    break;
                }

                const api_secret = process.env.GA_API_SECRET;

                fetch(
                    `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            client_id: '123456.7654321',
                            user_id: user._id,
                            events: [
                                {
                                    name: 'purchase',
                                    params: {
                                        subscriptionStatus: subscription.status,
                                        subscriptionId: subscription.id
                                    }
                                }
                            ]
                        })
                    }
                );
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

app.get('/api/docs', async (req, res) => {
    try {
        const search = req.query.search ? req.query.search.toLowerCase() : '';
        const categoryQuery =
            req.query.category && req.query.category !== 'all'
                ? req.query.category.toLowerCase()
                : null;
        const docsPath = join(__dirname, '../docs');
        const filenames = await fsPromises.readdir(docsPath);
        const docsData = await Promise.all(
            filenames.map(async (filename) => {
                const filePath = join(docsPath, filename);
                const content = await fsPromises.readFile(filePath, 'utf8');
                const title = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
                const category = 'general';
                return { title, category, content, filename };
            })
        );

        let filteredDocs = docsData;

        if (categoryQuery) {
            filteredDocs = filteredDocs.filter(
                (doc) =>
                    doc.category.toLowerCase().includes(categoryQuery) ||
                    doc.filename.toLowerCase().includes(categoryQuery)
            );
        }
        if (search) {
            filteredDocs = filteredDocs.filter(
                (doc) =>
                    doc.title.toLowerCase().includes(search) ||
                    doc.content.toLowerCase().includes(search)
            );
        }

        res.json(filteredDocs);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/sitemap.xml', async (req, res) => {
    try {
        const presentations = await Presentation.find();
        const staticRoutes = [
            '/',
            '/research',
            '/presentation',
            '/insights',
            '/privacy',
            '/terms',
            '/login',
            '/signup',
            '/forgot',
            '/profile',
            '/feedback',
            '/admin',
            '/docs'
        ];

        let urls = staticRoutes
            .map((route) => `<url><loc>https://AutoResearch.pro${route}</loc></url>`)
            .join('');

        presentations.forEach((p) => {
            if (p.slug) {
                urls += `<url><loc>https://AutoResearch.pro/presentation/${p.slug}</loc></url>`;
            }
        });

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/landing.html'), 'utf8');
    res.send(html);
});

app.get('*', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8');
    if (!req.path.startsWith('/presentation/')) {
        return res.send(html);
    }
    const slug = req.path.substring(14);
    const enrichedHtml = await enrichMetadata(html, slug);
    res.send(enrichedHtml);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';
