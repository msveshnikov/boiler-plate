import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const feedbackSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        type: { type: String, enum: ['bug', 'feature', 'other'], required: true },
        message: { type: String, required: true }
    },
    { timestamps: true }
);

export default model('Feedback', feedbackSchema);
