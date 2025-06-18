
import { Music } from 'lucide-react';

const AIAvatar = () => {
  return (
    <div className="relative flex items-center justify-center mb-8">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-glow opacity-20 scale-110"></div>
        
        {/* Middle floating ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-float opacity-30 scale-105"></div>
        
        {/* Inner avatar */}
        <div className="relative w-32 h-32 rounded-full bg-spotify-gradient flex items-center justify-center shadow-2xl">
          <Music className="w-12 h-12 text-white animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Floating music notes */}
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-xs">♪</span>
        </div>
        <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
          <span className="text-xs">♫</span>
        </div>
      </div>
    </div>
  );
};

export default AIAvatar;
