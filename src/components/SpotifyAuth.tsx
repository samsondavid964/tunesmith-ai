
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface SpotifyAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin;
const SPOTIFY_SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
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
    if (!SPOTIFY_CLIENT_ID) {
      console.error('Spotify Client ID not found. Please set VITE_SPOTIFY_CLIENT_ID in your environment variables.');
      return;
    }

    setIsConnecting(true);
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CLIENT_ID}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SPOTIFY_SCOPES)}` +
      `&show_dialog=true`;
    
    console.log('Redirecting to Spotify auth:', authUrl);
    window.location.href = authUrl;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Music className="w-8 h-8 text-black" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-3 text-white">Connect to Spotify</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect your Spotify account to create and save personalized playlists
            </p>
          </div>

          <Button
            onClick={handleSpotifyLogin}
            disabled={isConnecting || !SPOTIFY_CLIENT_ID}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect with Spotify
              </>
            )}
          </Button>

          {!SPOTIFY_CLIENT_ID && (
            <p className="text-red-400 text-xs">
              Missing VITE_SPOTIFY_CLIENT_ID environment variable
            </p>
          )}

          <p className="text-xs text-gray-500">
            This will open Spotify's secure login page
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SpotifyAuth;
