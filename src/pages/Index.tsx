
import React, { useState, useEffect } from 'react';
import { generatePlaylist } from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { Music, Sparkles, Play } from 'lucide-react';
import SpotifyAuth from '../components/SpotifyAuth';

const EXAMPLES = [
  'Upbeat songs for a morning workout',
  'Chill indie tracks for studying',
  'Nostalgic 90s hits for a road trip',
  'Relaxing jazz for a quiet evening',
  'Energetic electronic music for coding',
];

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; description: string; searchQueries?: string[] } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored access token
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const handleSpotifyAuth = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('spotify_access_token', token);
    setStatusMessage('✅ Successfully connected to Spotify!');
  };

  const handleGenerateClick = () => {
    setStatusMessage('');
    setResult(null);
    if (!prompt.trim()) {
      setStatusMessage('Please enter a description for your playlist.');
      return;
    }
    if (!accessToken) {
      setStatusMessage('Please connect to Spotify first.');
      return;
    }
    proceedWithPlaylistCreation();
  };

  const proceedWithPlaylistCreation = async () => {
    setIsLoading(true);
    setStatusMessage('');
    try {
      const result = await generatePlaylist(prompt);
      if (result.error) {
        setStatusMessage(result.message || 'Sorry, I can only help with music playlists!');
        setResult(null);
      } else {
        setResult({
          title: result.title,
          description: result.description,
          searchQueries: result.searchQueries,
        });
        setStatusMessage('Playlist created!');
        navigate('/playlist', { state: { playlist: result, accessToken } });
      }
    } catch (e) {
      setStatusMessage('Failed to generate playlist. Please try again.');
      setResult(null);
    }
    setIsLoading(false);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setStatusMessage('');
    setResult(null);
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    localStorage.removeItem('spotify_access_token');
    setStatusMessage('Disconnected from Spotify');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400/3 rounded-full blur-3xl"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Music className="w-8 h-8 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TuneSmith AI
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-gray-300">
            What do you want to listen to today?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Describe your mood, activity, or vibe and I'll craft the perfect playlist for you
          </p>
        </div>

        {/* Spotify Connection Status */}
        {accessToken ? (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Connected to Spotify</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <SpotifyAuth onAuthSuccess={handleSpotifyAuth} />
          </div>
        )}

        {/* Input Section - Only show if connected */}
        {accessToken && (
          <>
            <div className="w-full max-w-2xl mx-auto mb-8">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Energetic pop songs for a Friday night party..."
                  className="w-full h-32 bg-gray-900/50 border border-gray-800 rounded-2xl px-6 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all backdrop-blur-sm"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerateClick();
                    }
                  }}
                />
                <div className="absolute bottom-4 right-4">
                  <Sparkles className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              
              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !prompt.trim()}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-700 disabled:to-gray-800 text-black font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:text-gray-500 flex items-center justify-center gap-3 shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Creating your playlist...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate Playlist
                  </>
                )}
              </button>
            </div>

            {/* Examples */}
            <div className="w-full max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 text-center mb-4">Try these examples:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {EXAMPLES.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-900/40 hover:bg-gray-800/60 border border-gray-800 hover:border-green-500/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-8 text-center">
            <p className={`text-sm ${
              statusMessage.includes('error') || statusMessage.includes('Please')
                ? 'text-red-400'
                : statusMessage.includes('connected') || statusMessage.includes('✅')
                ? 'text-green-400'
                : 'text-blue-400'
            }`}>
              {statusMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
