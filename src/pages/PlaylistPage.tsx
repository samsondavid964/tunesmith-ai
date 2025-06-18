import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchSpotifyTrack, SpotifyTrack, createSpotifyPlaylist } from '../services/spotifyService';

const getSongAndArtist = (query: string) => {
  // Try to split "Song by Artist" format
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
    // eslint-disable-next-line
  }, [playlist, accessToken]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#191414] via-[#232526] to-[#1DB954] flex flex-col items-center py-12 px-4">
      <button
        className="mb-8 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition self-start"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      <div className="bg-[#181818] rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col items-center">
        {/* Playlist Cover */}
        <div className="w-40 h-40 rounded-xl bg-gradient-to-tr from-[#1DB954] to-[#191414] flex items-center justify-center mb-6 shadow-lg">
          <span className="text-6xl text-white/80">🎵</span>
        </div>
        {/* Playlist Title & Description */}
        <h1 className="text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">{playlist.title}</h1>
        <p className="mb-8 text-gray-300 text-center text-lg max-w-xl">{playlist.description}</p>
        {playlistUrl ? (
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 px-6 py-3 bg-[#1DB954] text-white rounded-full font-bold text-lg shadow hover:bg-[#169c46] transition"
          >
            Open Playlist on Spotify
          </a>
        ) : (
          <button
            className="mb-8 px-6 py-3 bg-[#1DB954] text-white rounded-full font-bold text-lg shadow hover:bg-[#169c46] transition disabled:opacity-60"
            onClick={handleSaveToSpotify}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save to Spotify'}
          </button>
        )}
        {saveError && <div className="mb-4 text-red-400 font-semibold">{saveError}</div>}
        {/* Track List */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Tracks</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {tracks?.map((track, idx) => (
                <div
                  key={track.id + idx}
                  className="flex items-center bg-[#232526] rounded-lg shadow-md p-4 hover:bg-[#282828] transition group"
                >
                  <div className="w-14 h-14 rounded-md bg-gray-800 flex items-center justify-center mr-4 overflow-hidden">
                    {track.albumArt ? (
                      <img src={track.albumArt} alt={track.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-white/40">🎶</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white truncate">{track.name}</div>
                    <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                  </div>
                  {track.uri ? (
                    <a
                      href={`https://open.spotify.com/track/${track.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-3 py-1 bg-[#1DB954] text-white rounded-full font-medium text-sm shadow hover:bg-[#169c46] transition"
                    >
                      Play on Spotify
                    </a>
                  ) : (
                    <span className="ml-4 px-3 py-1 bg-gray-700 text-gray-400 rounded-full font-medium text-sm">Not found</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage; 