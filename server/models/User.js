import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            trim: true,
            default: ''
        },
        lastName: {
            type: String,
            trim: true,
            default: ''
        },
        profilePicture: {
            type: String,
            default: ''
        },
        subscriptionStatus: {
            type: String,
            default: 'free'
        },
        subscriptionId: {
            type: String,
            default: ''
        },
        researchPreferences: {
            field: {
                type: String,
                trim: true
            },
            dataSources: {
                type: String,
                trim: true
            },
            aiAssistance: {
                type: String
            }
        },
        presentationSettings: {
            slideLayout: {
                type: String
            },
            theme: {
                type: String
            }
        },
        lastAiRequestTime: {
            type: Date
        },
        aiRequestCount: {
            type: Number,
            default: 0
        },
        resetPasswordToken: {
            type: String,
            default: ''
        },
        resetPasswordExpires: {
            type: Date
        },
        verificationToken: {
            type: String,
            default: ''
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        metadata: {
            userAgent: String,
            browserLanguage: String,
            countryCode: {
                type: String,
                trim: true,
                maxLength: 2
            },
            countryName: {
                type: String,
                trim: true,
                maxLength: 100
            },
            ip: {
                type: String,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);

UserSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 3600000;
    return resetToken;
};

const User = mongoose.model('User', UserSchema);

export default User;
