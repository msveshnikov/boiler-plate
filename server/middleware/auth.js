import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getIpFromRequest } from '../index.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        const metadata = {
            userAgent: req.headers['user-agent'] || '',
            countryCode: req.headers['geoip_country_code'] || '',
            countryName: req.headers['geoip_country_name'] || '',
            browserLanguage: req.headers['accept-language'] || '',
            ip: getIpFromRequest(req)
        };
        User.findByIdAndUpdate(user.id, { $set: { metadata, lastLogin: new Date() } }).catch(
            (error) => {
                console.error('Error updating user metadata:', error);
            }
        );
        next();
    });
};

export const authenticateTokenOptional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        next();
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) {
            req.user = user;
        }
        next();
    });
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.sendStatus(403);
        next();
    } catch {
        res.sendStatus(500);
    }
};
