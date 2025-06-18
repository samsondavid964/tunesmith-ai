
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SpotifyAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

const SpotifyAuth = ({ onAuthSuccess }: SpotifyAuthProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSpotifyLogin = async () => {
    setIsConnecting(true);
    
    // For MVP, we'll simulate the authentication process
    // In a real app, this would redirect to Spotify's OAuth flow
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful authentication
      const mockToken = 'mock_spotify_access_token_' + Date.now();
      onAuthSuccess(mockToken);
      
      console.log('Spotify authentication successful (simulated)');
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsConnecting(false);
    }
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
