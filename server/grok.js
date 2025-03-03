import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const openai = new OpenAI({
    apiKey: process.env.GROK_KEY,
    baseURL: 'https://api.x.ai/v1'
});

export async function getTextGrok(prompt, model = 'grok-2-latest', temperature = 0) {
    const requestParams = {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature
    };
    const completion = await openai.chat.completions.create(requestParams);
    return completion?.choices?.[0]?.message?.content;
}
