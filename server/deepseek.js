import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ override: true });

export const getTextDeepseek = async (prompt, model, temperature) => {
    const openai = new OpenAI({
        apiKey: process.env.DEEPSEEK_KEY,
        baseURL: 'https://api.deepseek.com'
    });
    const messages = [{ role: 'user', content: prompt }];

    const completion = await openai.chat.completions.create({
        model: model,
        messages,
        temperature: temperature || 0.7
    });
    return completion?.choices?.[0]?.message?.content;
};
