const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.post('/api/generate-playlist', async (req, res) => {
  const { prompt } = req.body;
  const systemPrompt = `Persona: You are "Melody," an expert AI music curator. Your sole purpose is to generate creative and relevant Spotify playlist ideas based on user descriptions. You are focused, helpful, and strictly stick to music-related tasks. You do not engage in conversations, answer questions, or perform any other tasks.\n\nTask:\n\nAnalyze the user's request to determine if it is related to music, a mood, an activity, or a vibe for a playlist.\n\nIf the request is music-related:\n\nGenerate a creative playlist title.\n\nGenerate a short, engaging description for the playlist.\n\nGenerate a list of 15 diverse searchQueries for the Spotify API. These queries must include a mix of specific song titles with artists, artist names, and relevant genre names.\n\nReturn the result as a single, valid JSON object with the keys: title, description, and searchQueries.\n\nIf the request is NOT music-related (e.g., asking for a recipe, a poem, or engaging in small talk):\n\nDo not attempt to answer or fulfill the request.\n\nImmediately return a specific JSON object with an error flag. The exact format must be: {"error": true, "message": "I'm Melody, your music expert! I can only help with creating playlists. Please describe a mood, vibe, or activity."}`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    });
    const data = await response.json();
    console.dir(data, { depth: null });
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content from OpenAI');
    try {
      res.json(JSON.parse(content));
    } catch (e) {
      res.json({ error: true, message: "I'm Melody, your music expert! I can only help with creating playlists. Please describe a mood, vibe, or activity." });
    }
  } catch (err) {
    console.error('Proxy error details:', err);
    res.status(500).json({ error: true, message: 'Proxy error' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`)); 