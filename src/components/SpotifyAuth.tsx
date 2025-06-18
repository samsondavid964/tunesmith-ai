import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SpotifyAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SPOTIFY_SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
].join(' ');

const getAccessTokenFromUrl = () => {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return params.get('access_token');
};

const SpotifyAuth = ({ onAuthSuccess }: SpotifyAuthProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const token = getAccessTokenFromUrl();
    if (token) {
      window.location.hash = '';
      onAuthSuccess(token);
    }
  }, [onAuthSuccess]);

  const handleSpotifyLogin = () => {
    setIsConnecting(true);
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CLIENT_ID}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SPOTIFY_SCOPES)}` +
      `&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-spotify-green rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">♪</span>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Connect to Spotify</h3>
          <p className="text-gray-400 text-sm">
            We need access to your Spotify account to create playlists for you.
          </p>
        </div>

        <Button
          onClick={handleSpotifyLogin}
          disabled={isConnecting}
          className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white font-semibold py-3 rounded-full transition-all duration-300 hover:scale-105"
        >
          {isConnecting ? 'Connecting...' : 'Connect with Spotify'}
        </Button>

        <p className="text-xs text-gray-500">
          This will open Spotify's secure login page
        </p>
      </div>
    </Card>
  );
};

export default SpotifyAuth;
