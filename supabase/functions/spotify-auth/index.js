const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/', async (req, res) => {
  const { code, redirect_uri } = req.body;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!code) return res.status(400).json({ error: 'Authorization code is required' });
  if (!clientId || !clientSecret) return res.status(500).json({ error: 'Spotify credentials not configured' });

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri
      })
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return res.status(400).json({ error: 'Failed to exchange authorization code', details: error });
    }

    const tokenData = await tokenResponse.json();
    res.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Spotify Auth API running on port ${PORT}`)); 