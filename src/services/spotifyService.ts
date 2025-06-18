
// Spotify service for playlist creation using Spotify Web API

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
  trackUris: string[]
): Promise<CreatePlaylistResponse> => {
  try {
    // Get user profile first
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user profile');
    }

    const user = await userResponse.json();

    // Create playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlistName,
        description: description,
        public: false,
      }),
    });

    if (!playlistResponse.ok) {
      throw new Error('Failed to create playlist');
    }

    const playlist = await playlistResponse.json();

    // Add tracks to playlist if any
    if (trackUris.length > 0) {
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      });

      if (!addTracksResponse.ok) {
        console.warn('Failed to add some tracks to playlist');
      }
    }

    console.log('Successfully created Spotify playlist:', {
      name: playlistName,
      description,
      trackCount: trackUris.length,
      playlistId: playlist.id
    });

    return {
      success: true,
      playlistId: playlist.id,
      playlistUrl: playlist.external_urls.spotify
    };
  } catch (error) {
    console.error('Failed to create Spotify playlist:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create playlist. Please try again.'
    };
  }
};

export const getUserProfile = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
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

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

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
