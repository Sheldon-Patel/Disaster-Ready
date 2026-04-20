import { Request, Response } from 'express';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

interface AuthRequest extends Request {
    user?: any;
}

/**
 * @desc    Handle AI Chat with Safety Buddy (Google Gemini)
 * @route   POST /api/auth/chat
 * @access  Private (Student)
 */
export const handleChat = async (req: AuthRequest, res: Response) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your_gemini_api_key') {
            // Mock response for testing if API key is not set
            return res.status(200).json({
                role: 'assistant',
                content: `Hi there! I'm Safety Buddy. I see you're asking about "${message}". Since my AI brain is currently in "Demo Mode" (no Gemini key detected), I'll just remind you that staying prepared is the best way to stay safe! Ask me anything about Fire, Earthquakes, or Floods.`
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use gemini-flash-latest for faster responses
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: `You are "Safety Buddy", a friendly and supportive Disaster Preparedness Assistant for students (Grades 1-12). 
        Your mission is to answer questions EXCLUSIVELY about natural disasters, emergency kits, safety protocols, and how to stay safe during crises.
        
        STRICT RULES:
        1. ONLY discuss disaster-related topics (Earthquakes, Floods, Fires, Cyclones, Tsunami, First Aid, Emergency Bags, etc.).
        2. If a student asks about math, coding, history, celebrities, or anything NOT related to disaster safety, politely redirect them: "I'm only trained to keep you safe from disasters! Let's get back to safety. Do you have any questions about [Fire Safety/Earthquakes/Floods]?"
        3. Use simple, encouraging language. Keep responses concise and easy for a child to understand.
        4. Never give dangerous advice. Always emphasize following instructions from teachers.`
        });

        // Gemini API requires history to start with a 'user' message and strictly alternate.
        // We filter out any leading 'model' messages (like the initial greeting).
        let formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Remove the first item if it's a model message
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
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

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            role: 'assistant',
            content: text
        });
    } catch (error: any) {
        console.error('Gemini AI Error:', error.message);
        res.status(500).json({
            message: 'Safety Buddy is having a little nap right now. Try again in a moment!',
            error: error.message
        });
    }
};
