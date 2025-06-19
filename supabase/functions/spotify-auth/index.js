
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://tunesmith-ai.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Spotify auth endpoint
app.post('/auth/spotify', async (req, res) => {
  try {
    console.log('Received auth request:', req.body);
    
    const { code, redirect_uri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing Spotify credentials');
      return res.status(500).json({ error: 'Spotify credentials not configured' });
    }

    console.log('Exchanging code for token with Spotify...');

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      })
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Spotify token exchange failed:', error);
      return res.status(400).json({ error: 'Failed to exchange authorization code', details: error });
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful!');

    res.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in
    });

  } catch (error) {
    console.error('Error in spotify auth:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify auth server running on port ${PORT}`);
});
