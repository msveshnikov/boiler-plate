import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from './middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(true);

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const transporter = nodemailer.createTransport({
    service: 'icloud',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const userRoutes = (app) => {
    app.post('/api/auth/signup', async (req, res) => {
        try {
            const { credential, firstName, lastName, email, password } = req.body;
            let user;
            if (credential) {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const { email: googleEmail, given_name, family_name } = ticket.getPayload();
                user = await User.findOne({ email: googleEmail });
                if (!user) {
                    user = new User({
                        email: googleEmail,
                        firstName: given_name,
                        lastName: family_name,
                        password: bcrypt.hashSync(Math.random().toString(36), 10),
                        emailVerified: true,
                        subscriptionStatus: 'free'
                    });
                    await user.save();
                }
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                user = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    subscriptionStatus: 'free',
                    verificationToken: crypto.randomBytes(32).toString('hex')
                });
                await user.save();
                await transporter.sendMail({
                    to: email,
                    from: process.env.FROM_EMAIL,
                    subject: 'Welcome to AutoResearch.pro!',
                    html: `
                        <html>
                        <body style="font-family: 'Open Sans', sans-serif; color: #333;">
                            <div style="max-width:600px; margin: auto; padding:20px; border:1px solid #eee; border-radius:8px; background-color:#fff;">
                            <h1 style="color: #3498DB;">Welcome to AutoResearch.pro!</h1>
                            <p>Hi ${firstName},</p>
                            <p>Thank you for joining AutoResearch.pro – your AI-powered partner for automating your research workflow and instantly generating professional presentations.</p>
                            <p>Please verify your email address to activate your account and start exploring our features:</p>
                            <a href="${process.env.FRONTEND_URL}/api/auth/verify-email?token=${user.verificationToken}&email=${encodeURIComponent(email)}" style="display:inline-block; padding:10px 20px; margin:10px 0; background-color:#3498DB; color:#fff; text-decoration:none; border-radius:4px;">Verify Your Email</a>
                            <p>Once verified, you can dive into dynamic presentation customization and AI-driven insights to elevate your research.</p>
                            <p>If you have any questions, our support team is here to help.</p>
                            <p>Warm regards,<br>The AutoResearch.pro Team</p>
                            </div>
                        </body>
                        </html>
          `
                });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.status(201).json({ token, user: { ...user.toJSON(), password: undefined } });
        } catch {
            res.status(500).json({ error: 'Registration failed' });
        }
    });

    app.post('/api/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'User not found' });
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ token, user: { ...user.toJSON(), password: undefined } });
        } catch {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    app.get('/api/profile', authenticateToken, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    });

    app.put('/api/profile', authenticateToken, async (req, res) => {
        try {
            const { firstName, lastName, preferences, presentationSettings, researchPreferences } =
                req.body;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { firstName, lastName, preferences, presentationSettings, researchPreferences },
                { new: true }
            ).select('-password');
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    });

    app.post('/api/auth/reset-password', async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'User not found' });
            const resetToken = user.generatePasswordResetToken();
            await user.save();
            await transporter.sendMail({
                to: email,
                from: process.env.FROM_EMAIL,
                subject: 'Password Reset - AutoResearch.pro',
                html: `
          <html>
            <body style="font-family: 'Open Sans', sans-serif; color: #333;">
              <div style="max-width:600px; margin: auto; padding:20px; border:1px solid #eee; border-radius:8px; background-color:#fff;">
                <h1 style="color: #3498DB;">Password Reset Request</h1>
                <p>Hello,</p>
                <p>You have requested to reset your password for your AutoResearch.pro account. Please click the button below to proceed:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" style="display:inline-block; padding:10px 20px; margin:10px 0; background-color:#3498DB; color:#fff; text-decoration:none; border-radius:4px;">Reset Your Password</a>
                <p>If you did not request this, please ignore this email.</p>
              </div>
            </body>
          </html>
        `
            });
            res.json({ message: 'Password reset email sent' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Failed to send reset email' });
        }
    });

    app.post('/api/auth/reset-password/:token', async (req, res) => {
        try {
            const { password } = req.body;
            const user = await User.findOne({
                resetPasswordToken: crypto
                    .createHash('sha256')
                    .update(req.params.token)
                    .digest('hex'),
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.json({ message: 'Password reset successful' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Password reset failed' });
        }
    });

    app.get('/api/auth/verify-email', async (req, res) => {
        try {
            const { token, email } = req.query;
            if (!token || !email) {
                return res.status(400).send(`
          <html>
            <body style="font-family: 'Open Sans', sans-serif; color: #333;">
              <div style="max-width:600px; margin: auto; padding:20px;">
                <h1 style="color:#E74C3C;">Verification Failed</h1>
                <p>Invalid verification parameters.</p>
              </div>
            </body>
          </html>
        `);
            }
            const user = await User.findOne({ email, verificationToken: token });
            if (!user) {
                return res.status(400).send(`
          <html>
            <body style="font-family: 'Open Sans', sans-serif; color: #333;">
              <div style="max-width:600px; margin: auto; padding:20px;">
                <h1 style="color:#E74C3C;">Verification Failed</h1>
                <p>Invalid or expired verification token.</p>
              </div>
            </body>
          </html>
        `);
            }
            user.emailVerified = true;
            user.verificationToken = undefined;
            await user.save();
            res.send(`
        <html>
          <body style="font-family: 'Open Sans', sans-serif; background-color:#f4f4f4; color:#333;">
            <div style="max-width:600px; margin: auto; padding:20px; background-color:#fff; border-radius:8px; text-align:center;">
              <h1 style="color:#3498DB;">Welcome to AutoResearch.pro!</h1>
              <p>Your email has been successfully verified.</p>
              <p>Explore our platform to automate your research workflow and create stunning presentations effortlessly.</p>
              <a href="${process.env.FRONTEND_URL}/presentation-creator" style="display:inline-block; padding:10px 20px; background-color:#3498DB; color:#fff; text-decoration:none; border-radius:4px;">Go to Presentation Creator</a>
            </div>
          </body>
        </html>
      `);
        } catch {
            res.status(500).send(`
        <html>
          <body style="font-family: 'Open Sans', sans-serif; color:#333;">
            <div style="max-width:600px; margin: auto; padding:20px;">
              <h1 style="color:#E74C3C;">Verification Error</h1>
              <p>Email verification failed.</p>
            </div>
          </body>
        </html>
      `);
        }
    });
};

export default userRoutes;
