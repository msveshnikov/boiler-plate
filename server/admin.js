import { authenticateToken, isAdmin } from './middleware/auth.js';
import User from './models/User.js';
import Presentation from './models/Presentation.js';
import Feedback from './models/Feedback.js';

const adminRoutes = (app) => {
    app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
        try {
            const users = await User.find().select('-password').sort({ createdAt: -1 });
            res.json(users);
        } catch (error) {
            console.error('Admin users fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/dashboard', authenticateToken, isAdmin, async (req, res) => {
        try {
            const [
                totalUsers,
                premiumUsers,
                trialingUsers,
                totalPresentations,
                userGrowth,
                presentationGrowth
            ] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ subscriptionStatus: 'active' }),
                User.countDocuments({ subscriptionStatus: 'trialing' }),
                Presentation.countDocuments(),
                User.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } },
                    { $limit: 30 }
                ]),
                Presentation.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } },
                    { $limit: 30 }
                ])
            ]);
            const conversionRate =
                totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : '0.00';
            res.json({
                stats: {
                    totalUsers,
                    premiumUsers,
                    trialingUsers,
                    conversionRate
                },
                userGrowth,
                presentationsStats: {
                    totalPresentations,
                    presentationGrowth
                }
            });
        } catch (error) {
            console.error('Admin dashboard error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/feedbacks', authenticateToken, isAdmin, async (req, res) => {
        try {
            const feedbacks = await Feedback.find()
                .populate('userId', 'email')
                .sort({ createdAt: -1 });
            res.json(feedbacks);
        } catch (error) {
            console.error('Admin feedbacks fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/api/admin/presentations', authenticateToken, isAdmin, async (req, res) => {
        try {
            const presentations = await Presentation.find()
                .populate('userId', 'email')
                .sort({ createdAt: -1 });
            res.json(presentations);
        } catch (error) {
            console.error('Admin presentations fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get(
        '/api/admin/presentations-model-stats',
        authenticateToken,
        isAdmin,
        async (req, res) => {
            try {
                const modelStats = await Presentation.aggregate([
                    {
                        $group: {
                            _id: '$model',
                            count: { $sum: 1 }
                        }
                    }
                ]);
                res.json(modelStats);
            } catch (error) {
                console.error('Admin presentation model stats error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await Promise.all([Presentation.deleteMany({ userId: req.params.id })]);
            res.json({ message: 'User and associated data deleted successfully' });
        } catch (error) {
            console.error('Admin user delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/api/admin/feedbacks/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const feedback = await Feedback.findByIdAndDelete(req.params.id);
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback not found' });
            }
            res.json({ message: 'Feedback deleted successfully' });
        } catch (error) {
            console.error('Admin feedback delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/api/admin/presentations/:id', authenticateToken, isAdmin, async (req, res) => {
        try {
            const presentation = await Presentation.findByIdAndDelete(req.params.id);
            if (!presentation) {
                return res.status(404).json({ error: 'Presentation not found' });
            }
            res.json({ message: 'Presentation deleted successfully' });
        } catch (error) {
            console.error('Admin presentation delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put('/api/admin/users/:id/subscription', authenticateToken, isAdmin, async (req, res) => {
        try {
            const { subscriptionStatus } = req.body;
            if (
                ![
                    'active',
                    'free',
                    'trialing',
                    'past_due',
                    'canceled',
                    'incomplete_expired'
                ].includes(subscriptionStatus)
            ) {
                return res.status(400).json({ error: 'Invalid subscription status' });
            }
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.subscriptionStatus = subscriptionStatus;
            await user.save();
            res.json({ message: 'User subscription updated successfully' });
        } catch (error) {
            console.error('Admin subscription update error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.put(
        '/api/admin/presentations/:id/privacy',
        authenticateToken,
        isAdmin,
        async (req, res) => {
            try {
                const { isPrivate } = req.body;
                if (typeof isPrivate !== 'boolean') {
                    return res.status(400).json({ error: 'Invalid private status' });
                }
                const presentation = await Presentation.findById(req.params.id);
                if (!presentation) {
                    return res.status(404).json({ error: 'Presentation not found' });
                }
                presentation['isPrivate'] = isPrivate;
                await presentation.save();
                res.json({ message: 'Presentation privacy status updated successfully' });
            } catch (error) {
                console.error('Admin presentation privacy update error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );
};

export default adminRoutes;
