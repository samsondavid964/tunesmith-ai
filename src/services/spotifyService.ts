// Mock Spotify service for playlist creation
// In a real implementation, this would use the Spotify Web API

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
}

interface CreatePlaylistResponse {
  success: boolean;
  playlistId?: string;
  playlistUrl?: string;
  error?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  uri: string;
}

export const createSpotifyPlaylist = async (
  accessToken: string,
  playlistName: string,
  description: string,
  tracks: Track[]
): Promise<CreatePlaylistResponse> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful playlist creation
    const mockPlaylistId = 'playlist_' + Date.now();
    const mockPlaylistUrl = `https://open.spotify.com/playlist/${mockPlaylistId}`;

    console.log('Creating Spotify playlist:', {
      name: playlistName,
      description,
      trackCount: tracks.length,
      accessToken: accessToken.substring(0, 10) + '...'
    });

    return {
      success: true,
      playlistId: mockPlaylistId,
      playlistUrl: mockPlaylistUrl
    };
  } catch (error) {
    console.error('Failed to create Spotify playlist:', error);
    return {
      success: false,
      error: 'Failed to create playlist. Please try again.'
    };
  }
};

export const getUserProfile = async (accessToken: string) => {
  // Mock user profile
  return {
    id: 'mock_user_123',
    display_name: 'Music Lover',
    email: 'user@example.com',
    images: []
  };
};

export const searchSpotifyTrack = async (
  accessToken: string,
  query: string
): Promise<SpotifyTrack | null> => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    const track = data.tracks?.items?.[0];
    if (!track) return null;
    return {
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images?.[0]?.url || '',
      uri: track.uri,
    };
  } catch (error) {
    console.error('Spotify search error:', error);
    return null;
  }
};
