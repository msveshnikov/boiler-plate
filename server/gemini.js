import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const vertex_ai = new VertexAI({ project: process.env.GOOGLE_KEY, location: 'us-central1' });

export const getTextGemini = async (prompt, model, temperature = 0.7) => {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
            temperature: temperature,
            tools: [
                {
                    googleSearchRetrieval: {
                        disableAttribution: true
                    }
                }
            ]
        }
    });

    const chat = generativeModel.startChat({});
    const result = await chat.sendMessage([{ text: prompt }]);
    return result?.response?.candidates?.[0].content?.parts?.[0]?.text;
};
