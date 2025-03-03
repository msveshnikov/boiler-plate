import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const getTextGpt = async (prompt, model) => {
    const requestParams = {
        model,
        messages: [{ role: 'user', content: prompt }]
    };

    if (model === 'o3-mini') {
        requestParams.reasoning_effort = 'high';
    }

    try {
        const completion = await openai.chat.completions.create(requestParams);
        return completion?.choices?.[0]?.message?.content;
    } catch (error) {
        console.error('Error generating text:', error);
        throw error;
    }
};
