import { useState, useEffect } from "react";
import { Activity, Sparkles } from "lucide-react";
import maxImage from "@assets/image_1759775310846.png";

interface MaxViewerProps {
  isThinking?: boolean;
  isSpeaking?: boolean;
}

export default function MaxViewer({ isThinking = false, isSpeaking = false }: MaxViewerProps) {
  const [pulse, setPulse] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setPulse(p => !p);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,185,11,0.15)_0%,rgba(252,213,53,0.08)_25%,transparent_70%)]" />
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(240,185,11,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,185,11,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float ${3 + Math.random() * 3}s ease-in-out ${particle.delay}s infinite alternate`,
          }}
        />
      ))}
      
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg shadow-red-500/50" data-testid="badge-live">
          <div className="h-2.5 w-2.5 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" />
          <span className="text-white text-sm font-bold uppercase tracking-wider">LIVE</span>
        </div>
      </div>

      {isThinking && (
        <div className="absolute top-6 right-6 z-10 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/40 shadow-lg shadow-primary/20" data-testid="status-thinking">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-primary text-sm font-semibold">Pensando...</span>
          </div>
        </div>
      )}

      <div className="relative z-10" data-testid="model-max">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent blur-3xl rounded-full -z-10" />
        
        <div 
          className={`relative transition-all duration-500 ease-out ${
            isSpeaking ? 'scale-110' : 'scale-100'
          }`}
        >
          <div 
            className="absolute inset-0 rounded-full blur-2xl -z-10 transition-all duration-500"
            style={{
              background: isSpeaking 
                ? `radial-gradient(circle, rgba(240,185,11,${pulse ? 0.6 : 0.3}) 0%, transparent 70%)`
                : 'radial-gradient(circle, rgba(240,185,11,0.2) 0%, transparent 70%)',
              transform: isSpeaking ? 'scale(1.3)' : 'scale(1)',
            }}
          />
          
          <img 
            src={maxImage}
            alt="Max the AI Rabbit"
            className="relative h-[450px] w-auto md:h-[550px] lg:h-[650px] object-contain drop-shadow-2xl"
            style={{
              filter: isSpeaking 
                ? `drop-shadow(0 0 ${pulse ? '60px' : '40px'} rgba(240, 185, 11, 0.6)) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8))`
                : 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8))'
            }}
          />
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-80 h-4 bg-primary/10 rounded-full blur-2xl" />
      </div>

      {isSpeaking && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-12" data-testid="audio-waves">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-gradient-to-t from-primary to-primary/60 rounded-full shadow-lg shadow-primary/50"
              style={{
                height: '40%',
                animation: `audioWave ${0.4 + (i * 0.05)}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          to { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        
        @keyframes audioWave {
          0% { height: 20%; }
          50% { height: 100%; }
          100% { height: 30%; }
        }
      `}</style>
    </div>
  );
}
