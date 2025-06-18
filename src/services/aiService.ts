// Mock AI service for generating playlist recommendations
// In a real implementation, this would call OpenAI, Claude, or another AI service

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
}

interface PlaylistRecommendation {
  name: string;
  description: string;
  tracks: Track[];
}

const mockTracks: Track[] = [
  { id: '1', name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20' },
  { id: '2', name: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54' },
  { id: '3', name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
  { id: '4', name: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58' },
  { id: '5', name: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', duration: '2:21' },
  { id: '6', name: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58' },
  { id: '7', name: 'Industry Baby', artist: 'Lil Nas X & Jack Harlow', album: 'MONTERO', duration: '3:32' },
  { id: '8', name: 'Peaches', artist: 'Justin Bieber ft. Daniel Caesar', album: 'Justice', duration: '3:18' },
  { id: '9', name: 'Kiss Me More', artist: 'Doja Cat ft. SZA', album: 'Planet Her', duration: '3:28' },
  { id: '10', name: 'Montero', artist: 'Lil Nas X', album: 'MONTERO', duration: '2:17' },
  { id: '11', name: 'Dynamite', artist: 'BTS', album: 'BE', duration: '3:19' },
  { id: '12', name: 'Positions', artist: 'Ariana Grande', album: 'Positions', duration: '2:52' },
  { id: '13', name: 'Drivers License', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '4:02' },
  { id: '14', name: 'Willow', artist: 'Taylor Swift', album: 'evermore', duration: '3:34' },
  { id: '15', name: 'Therefore I Am', artist: 'Billie Eilish', album: 'Therefore I Am', duration: '2:54' }
];

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generatePlaylist = async (prompt: string): Promise<any> => {
  try {
    const response = await fetch('http://localhost:5001/api/generate-playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    return await response.json();
  } catch (error) {
    return { error: true, message: "Failed to generate playlist. Please try again." };
  }
};

const generatePlaylistName = (prompt: string): string => {
  const keywords = prompt.toLowerCase();
  
  if (keywords.includes('workout') || keywords.includes('gym') || keywords.includes('exercise')) {
    return '💪 Workout Vibes';
  } else if (keywords.includes('chill') || keywords.includes('relax') || keywords.includes('calm')) {
    return '😌 Chill Sessions';
  } else if (keywords.includes('party') || keywords.includes('dance') || keywords.includes('energy')) {
    return '🎉 Party Mode';
  } else if (keywords.includes('study') || keywords.includes('focus') || keywords.includes('concentration')) {
    return '📚 Focus Flow';
  } else if (keywords.includes('sad') || keywords.includes('melancholy') || keywords.includes('emotional')) {
    return '💙 Emotional Escape';
  } else if (keywords.includes('happy') || keywords.includes('upbeat') || keywords.includes('positive')) {
    return '☀️ Good Vibes Only';
  } else {
    return '🎵 Custom Mix';
  }
};

const generatePlaylistDescription = (prompt: string): string => {
  return `AI-curated playlist based on: "${prompt}". Perfect for your current mood and vibe!`;
};

const selectTracksBasedOnPrompt = (prompt: string): Track[] => {
  // Randomly select 8-12 tracks from our mock database
  const shuffled = [...mockTracks].sort(() => 0.5 - Math.random());
  const numTracks = Math.floor(Math.random() * 5) + 8; // 8-12 tracks
  return shuffled.slice(0, numTracks);
};
