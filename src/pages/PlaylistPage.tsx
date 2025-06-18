
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchSpotifyTrack, SpotifyTrack, createSpotifyPlaylist } from '../services/spotifyService';
import { ArrowLeft, Music, Play, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

const getSongAndArtist = (query: string) => {
  const match = query.match(/^(.*?) by (.*)$/i);
  if (match) {
    return { song: match[1], artist: match[2] };
  }
  return { song: query, artist: '' };
};

const PlaylistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playlist = location.state?.playlist;
  const accessToken = location.state?.accessToken;
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!playlist || !accessToken) {
      navigate('/');
      return;
    }
    const fetchTracks = async () => {
      setLoading(true);
      const foundTracks: SpotifyTrack[] = [];
      for (const query of playlist.searchQueries) {
        const track = await searchSpotifyTrack(accessToken, query);
        if (track) foundTracks.push(track);
        else foundTracks.push({
          id: query,
          name: getSongAndArtist(query).song,
          artist: getSongAndArtist(query).artist,
          album: '',
          albumArt: '',
          uri: '',
        });
      }
      setTracks(foundTracks);
      setLoading(false);
    };
    fetchTracks();
  }, [playlist, accessToken, navigate]);

  const handleSaveToSpotify = async () => {
    if (!tracks || !accessToken) return;
    setSaving(true);
    setSaveError('');
    setPlaylistUrl(null);
    try {
      const uris = tracks.filter(t => t.uri).map(t => t.uri);
      const res = await createSpotifyPlaylist(
        accessToken,
        playlist.title,
        playlist.description,
        uris
      );
      if (res.success && res.playlistUrl) {
        setPlaylistUrl(res.playlistUrl);
      } else {
        setSaveError(res.error || 'Failed to save playlist.');
      }
    } catch (e) {
      setSaveError('Failed to save playlist.');
    }
    setSaving(false);
  };

  if (!playlist || !accessToken) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-400/3 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 min-h-screen px-6 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          {/* Playlist Info */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                <Music className="w-12 h-12 text-black" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {playlist.title}
                </h1>
                <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                  {playlist.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{playlist.searchQueries?.length || 0} songs</span>
                  <span>•</span>
                  <span>Created by TuneSmith AI</span>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              {playlistUrl ? (
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open on Spotify
                </a>
              ) : (
                <button
                  onClick={handleSaveToSpotify}
                  disabled={saving || loading}
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving to Spotify...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Save to Spotify
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Error Message */}
            {saveError && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{saveError}</span>
              </div>
            )}
          </div>

          {/* Track List */}
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Music className="w-6 h-6 text-green-500" />
              Your Playlist
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                <p className="text-gray-400">Finding your perfect tracks...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tracks?.map((track, idx) => (
                  <div
                    key={track.id + idx}
                    className="flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-2xl transition-all duration-300 group"
                  >
                    {/* Track Number */}
                    <div className="w-8 text-center text-gray-500 text-sm font-medium">
                      {idx + 1}
                    </div>
                    
                    {/* Album Art */}
                    <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {track.albumArt ? (
                        <img 
                          src={track.albumArt} 
                          alt={track.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Music className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    
                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                        {track.name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {track.artist}
                      </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {track.uri ? (
                        <a
                          href={`https://open.spotify.com/track/${track.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                        >
                          <Play className="w-4 h-4" />
                          Play
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-gray-700 text-gray-500 px-4 py-2 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Not found
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
