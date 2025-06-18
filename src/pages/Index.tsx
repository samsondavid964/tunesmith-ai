import React, { useState } from 'react';
import { generatePlaylist } from '../services/aiService';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4 font-sans">
      {/* AI Orb Graphic and Title */}
      <style>{`
        .ai-orb {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          position: relative;
          margin-left: auto;
          margin-right: auto;
          background: radial-gradient(circle at 30% 30%, #4f46e5, #1d4ed8);
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.5), 0 0 40px rgba(29, 78, 216, 0.3), inset 0 0 10px rgba(255,255,255,0.2);
          animation: pulse 4s infinite ease-in-out, rotate-glow 8s infinite linear;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-orb::before {
          content: '';
          position: absolute;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 70% 70%, #a855f7, transparent 60%);
          animation: rotate-glow 6s infinite linear reverse;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(79, 70, 229, 0.5), 0 0 40px rgba(29, 78, 216, 0.3), inset 0 0 10px rgba(255,255,255,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(79, 70, 229, 0.7), 0 0 60px rgba(29, 78, 216, 0.5), inset 0 0 15px rgba(255,255,255,0.3); }
        }
        @keyframes rotate-glow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-in { animation: fadeIn 1.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .prompt-input {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .prompt-input:focus {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px #1d4ed8;
        }
        .generate-button {
          background-color: #4f46e5;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .generate-button:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
        }
        .generate-button:active {
          transform: translateY(0);
        }
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-left-color: #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .result-card {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1.5rem;
          max-width: 90%;
          width: 500px;
          text-align: left;
          margin-top: 2rem;
          animation: fadeIn 0.5s ease-out forwards;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        .modal-content {
          background-color: #181818;
          padding: 2rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 90%;
          max-width: 400px;
          text-align: center;
          animation: fadeIn 0.3s ease-out;
        }
        .spotify-button {
          background-color: #1DB954;
          color: white;
          transition: background-color 0.3s ease;
        }
        .spotify-button:hover {
          background-color: #1ED760;
        }
        .example-btn {
          background-color: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e0e0e0;
          border-radius: 9999px;
          padding: 0.5rem 1.25rem;
          margin: 0.25rem;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .example-btn:hover {
          background-color: rgba(79,70,229,0.15);
          color: #fff;
          transform: scale(1.05);
        }
      `}</style>
      <div className="main-container text-center w-full flex flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 fade-in tracking-tight" style={{ animationDelay: '0.1s' }}>
          TuneSmith AI
        </h1>
        {/* AI Orb Graphic */}
        <div className="ai-orb mb-8 fade-in" style={{ animationDelay: '0.2s' }}></div>
        {/* Main Question */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 fade-in" style={{ animationDelay: '0.5s' }}>
          What do you want to listen to today?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto fade-in" style={{ animationDelay: '0.8s' }}>
          Describe a mood, a vibe, an activity, or anything you can think of. I'll craft the perfect playlist for you.
        </p>
        {/* Input Form */}
        <div className="w-full max-w-xl mx-auto fade-in" style={{ animationDelay: '1.1s' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="prompt-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="e.g., A rainy afternoon in a cozy coffee shop..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={isLoading}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerateClick(); }}
            />
            <button
              className="generate-button text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center"
              onClick={handleGenerateClick}
              disabled={isLoading}
            >
              <span className={isLoading ? 'hidden' : ''}>✨ Create</span>
              {isLoading && <div className="loader w-5 h-5 rounded-full ml-3"></div>}
            </button>
          </div>
        </div>
        {/* Try these examples */}
        <div className="mt-8 mb-2 fade-in" style={{ animationDelay: '1.3s' }}>
          <p className="text-sm text-gray-400 mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="example-btn"
                onClick={() => handleExampleClick(ex)}
                disabled={isLoading}
                type="button"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
        {/* Status/Result Message Area */}
        <div className="mt-6 text-gray-300 min-h-[24px]">
          {statusMessage && (
            <p className={statusMessage.includes('error') || statusMessage.includes('Please') ? 'text-red-400' : statusMessage.includes('connected') ? 'text-green-400' : 'text-indigo-400'}>{statusMessage}</p>
          )}
        </div>
      </div>
      {/* Spotify Connect Modal */}
      {showSpotifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-2xl font-bold text-white mb-4">Connect to Spotify</h2>
            <p className="text-gray-400 mb-6">To create a playlist, you need to connect your Spotify account first.</p>
            <button
              className="spotify-button font-bold py-3 px-8 rounded-full w-full flex items-center justify-center gap-2"
              onClick={handleSpotifyConnect}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.183 14.225c-.22.359-.688.469-1.047.248-2.91-1.72-6.578-2.115-10.93-1.152-.428.093-.84-.139-.933-.565-.093-.428.139-.84.565-.933 4.673-1.031 8.707-.605 11.883 1.258.359.22.469.688.248 1.047zM17.5 12.65a.563.563 0 0 1-.656.495c-3.286-2.03-8.217-2.65-12.016-1.44a.562.562 0 0 1-.61-.69c.094-.337.458-.512.795-.418 4.232 1.343 9.615 2.018 13.242 0 .337-.094.7.078.795.418.093.336-.078.7-.45.795zm.109-2.93c-.413.313-.938.375-1.35.062C12.2 7.297 7.35 7.125 4.332 8.016c-.375.094-.75-.125-.844-.5-.094-.375.125-.75.5-.844C7.875 5.688 13.25 5.875 16.95 8.8c.438.282.531.875.219 1.313z"></path></svg>
              Connect with Spotify
            </button>
            <button
              className="mt-4 text-gray-500 hover:text-white transition"
              onClick={() => setShowSpotifyModal(false)}
            >Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
