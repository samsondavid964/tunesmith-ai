
import React, { useState } from 'react';
import { generatePlaylist } from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { Music, Sparkles, Play } from 'lucide-react';

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
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [result, setResult] = useState<{ title: string; description: string; searchQueries?: string[] } | null>(null);
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    setStatusMessage('');
    setResult(null);
    if (!prompt.trim()) {
      setStatusMessage('Please enter a description for your playlist.');
      return;
    }
    if (isSpotifyConnected) {
      proceedWithPlaylistCreation();
    } else {
      setShowSpotifyModal(true);
    }
  };

  const handleSpotifyConnect = () => {
    setShowSpotifyModal(false);
    setIsSpotifyConnected(true);
    setStatusMessage('✅ Successfully connected to Spotify!');
    setTimeout(() => {
      proceedWithPlaylistCreation();
    }, 1200);
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
        navigate('/playlist', { state: { playlist: result } });
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

        {/* Input Section */}
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

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-8 text-center">
            <p className={`text-sm ${
              statusMessage.includes('error') || statusMessage.includes('Please')
                ? 'text-red-400'
                : statusMessage.includes('connected')
                ? 'text-green-400'
                : 'text-blue-400'
            }`}>
              {statusMessage}
            </p>
          </div>
        )}
      </div>

      {/* Spotify Connect Modal */}
      {showSpotifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-black" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Connect to Spotify</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                To create and save playlists, you need to connect your Spotify account first.
              </p>
              
              <button
                onClick={handleSpotifyConnect}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect with Spotify
              </button>
              
              <button
                onClick={() => setShowSpotifyModal(false)}
                className="w-full text-gray-500 hover:text-white py-2 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
