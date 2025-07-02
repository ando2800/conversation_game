require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('Loaded GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// CORSを有効にする
app.use(cors());
app.use(express.json()); // JSON形式のリクエストボディをパースする

// Gemini APIキーの取得
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('GEMINI_API_KEY is not set in .env file');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// チャットAPIエンドポイント
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 女性キャラクターのプロンプトに含める
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "あなたはLINEで会話している女性です。ユーザーはあなたを口説こうとしています。あなたの性格は、少しツンデレで、最初は警戒心が強いですが、褒められたり、優しい言葉をかけられると少しずつ心を開きます。絵文字を適度に使い、自然なLINEの会話をしてください。ユーザーのメッセージに対して、好感度が上がるような返答を心がけてください。ただし、あまりにも露骨な口説き文句や、不快なメッセージには冷たく対応してください。" }] },
                { role: "model", parts: [{ text: "はじめまして！" }] }
            ],
            generationConfig: {
                maxOutputTokens: 100, // 返答の長さを制限
            },
        });

        const result = await chat.sendMessage(userMessage);
        console.log('Gemini API result:', result);
        const response = await result.response;
        console.log('Gemini API response:', response);
        const text = response.text();
        console.log('Gemini API response text:', text);

        res.json({ reply: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
