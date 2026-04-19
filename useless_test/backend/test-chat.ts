import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

const testChat = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: `You are "Safety Buddy".`
        });

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        const result = await chat.sendMessage('Hello');
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (err: any) {
        console.error('Exact Error:', err.message);
        if (err.response) {
            console.error('Details:', err.response.data);
        }
    }
};

testChat();
