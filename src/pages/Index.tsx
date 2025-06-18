
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AIAvatar from '@/components/AIAvatar';
import PromptInput from '@/components/PromptInput';
import SpotifyAuth from '@/components/SpotifyAuth';
import PlaylistResult from '@/components/PlaylistResult';
import { generatePlaylist } from '@/services/aiService';
import { createSpotifyPlaylist } from '@/services/spotifyService';

type AppState = 'auth' | 'input' | 'generating' | 'result';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
}

interface Playlist {
  name: string;
  description: string;
  tracks: Track[];
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSpotifyAuth = (token: string) => {
    setSpotifyToken(token);
    setAppState('input');
    toast({
      title: "Connected to Spotify! 🎵",
      description: "You can now create playlists directly to your account.",
    });
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    setAppState('generating');

    try {
      const playlist = await generatePlaylist(prompt);
      setCurrentPlaylist(playlist);
      setAppState('result');
      toast({
        title: "Playlist Generated! ✨",
        description: `Created "${playlist.name}" with ${playlist.tracks.length} tracks.`,
      });
    } catch (error) {
      console.error('Failed to generate playlist:', error);
      toast({
        title: "Generation Failed",
        description: "Sorry, we couldn't generate your playlist. Please try again.",
        variant: "destructive",
      });
      setAppState('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToSpotify = async () => {
    if (!currentPlaylist) return;

    setIsSaving(true);
    try {
      const result = await createSpotifyPlaylist(
        spotifyToken,
        currentPlaylist.name,
        currentPlaylist.description,
        currentPlaylist.tracks
      );

      if (result.success) {
        toast({
          title: "Saved to Spotify! 🎉",
          description: "Your playlist has been added to your Spotify account.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save playlist:', error);
      toast({
        title: "Save Failed",
        description: "Couldn't save to Spotify. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentPlaylist(null);
    setAppState('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
            TuneSmith AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Your AI-Powered Playlist Creator
          </p>
          <p className="text-gray-400">
            Powered by artificial intelligence • Connected to Spotify
          </p>
        </div>

        {/* AI Avatar */}
        <AIAvatar />

        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {appState === 'auth' && (
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                What do you want to listen to today?
              </h2>
              <SpotifyAuth onAuthSuccess={handleSpotifyAuth} />
            </div>
          )}

          {appState === 'input' && (
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                What do you want to listen to today?
              </h2>
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isGenerating} />
            </div>
          )}

          {appState === 'generating' && (
            <div className="text-center space-y-8">
              <div className="animate-pulse">
                <h2 className="text-3xl font-semibold text-white mb-4">
                  Creating your perfect playlist...
                </h2>
                <p className="text-gray-400">
                  Our AI is analyzing your request and curating the best tracks
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {appState === 'result' && currentPlaylist && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-white mb-4">
                  Your playlist is ready! 🎵
                </h2>
              </div>
              <PlaylistResult
                playlist={currentPlaylist}
                onCreateNew={handleCreateNew}
                onSaveToSpotify={handleSaveToSpotify}
                isSaving={isSaving}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Discover new music • Create perfect playlists • Powered by AI</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
