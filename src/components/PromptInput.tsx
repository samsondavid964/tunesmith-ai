
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Music } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const PromptInput = ({ onSubmit, isLoading = false }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  const suggestions = [
    "Upbeat songs for a morning workout",
    "Chill indie tracks for studying",
    "Nostalgic 90s hits for a road trip",
    "Relaxing jazz for a quiet evening",
    "Energetic electronic music for coding"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the vibe, mood, or type of music you want to listen to..."
            className="min-h-[120px] text-lg p-6 bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl resize-none focus:bg-white/20 transition-all duration-300"
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4">
            <Music className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={!prompt.trim() || isLoading}
          className="w-full h-14 text-lg font-semibold bg-spotify-gradient hover:scale-105 transition-all duration-300 rounded-2xl shadow-lg"
        >
          {isLoading ? 'Creating Your Playlist...' : 'Generate My Playlist ✨'}
        </Button>
      </form>

      <div className="mt-8">
        <p className="text-sm text-gray-400 mb-4 text-center">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-105"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
