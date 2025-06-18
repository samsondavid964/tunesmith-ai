
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ExternalLink, RefreshCw } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
}

interface PlaylistResultProps {
  playlist: {
    name: string;
    description: string;
    tracks: Track[];
  };
  onCreateNew: () => void;
  onSaveToSpotify: () => void;
  isSaving?: boolean;
}

const PlaylistResult = ({ playlist, onCreateNew, onSaveToSpotify, isSaving = false }: PlaylistResultProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Playlist Header */}
      <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-spotify-gradient rounded-lg flex items-center justify-center">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{playlist.name}</h2>
            <p className="text-gray-400 mb-4">{playlist.description}</p>
            <p className="text-sm text-gray-500">{playlist.tracks.length} songs</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onSaveToSpotify}
          disabled={isSaving}
          className="bg-spotify-green hover:bg-spotify-green/90 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
        >
          {isSaving ? 'Saving...' : 'Save to Spotify'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
        <Button
          onClick={onCreateNew}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Create New Playlist
        </Button>
      </div>

      {/* Track List */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h3 className="text-lg font-semibold mb-4">Track List</h3>
        <div className="space-y-3">
          {playlist.tracks.map((track, index) => (
            <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
              <span className="text-gray-400 text-sm w-6 text-center">{index + 1}</span>
              <div className="flex-1">
                <p className="font-medium">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artist} • {track.album}</p>
              </div>
              <span className="text-sm text-gray-400">{track.duration}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PlaylistResult;
