import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Brain, FileText, CheckCircle, AlertTriangle, Gavel, CircleDot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EmotionType } from "@shared/schema";

interface AnimationControlsProps {
  onEmotionChange: (emotion: EmotionType) => void;
  currentEmotion: EmotionType;
}

export default function AnimationControls({ onEmotionChange, currentEmotion }: AnimationControlsProps) {
  const { t } = useLanguage();
  
  const emotions: { type: EmotionType; icon: React.ReactNode; activeColor: string; available: boolean }[] = [
    { type: 'idle', icon: <CircleDot className="h-4 w-4" />, activeColor: 'bg-gray-500', available: true },
    { type: 'analyzing', icon: <Search className="h-4 w-4" />, activeColor: 'bg-blue-500', available: false },
    { type: 'thinking_deep', icon: <Brain className="h-4 w-4" />, activeColor: 'bg-purple-500', available: false },
    { type: 'presenting', icon: <FileText className="h-4 w-4" />, activeColor: 'bg-green-500', available: false },
    { type: 'approving', icon: <CheckCircle className="h-4 w-4" />, activeColor: 'bg-emerald-500', available: false },
    { type: 'concerned', icon: <AlertTriangle className="h-4 w-4" />, activeColor: 'bg-orange-500', available: false },
    { type: 'gavel_tap', icon: <Gavel className="h-4 w-4" />, activeColor: 'bg-amber-600', available: false },
  ];

  return (
    <div className="bg-card backdrop-blur-sm border-2 border-border rounded-2xl p-4 shadow-md">
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
        {t('header.title')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => {
          const button = (
            <Button
              key={emotion.type}
              variant="outline"
              size="sm"
              disabled={!emotion.available}
              className={`gap-1.5 border-2 rounded-xl px-3 py-2 font-bold transition-all text-xs ${
                currentEmotion === emotion.type && emotion.available
                  ? `${emotion.activeColor} border-transparent text-white shadow-lg scale-105`
                  : emotion.available
                  ? `bg-card border-border text-foreground hover:bg-muted`
                  : `bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50`
              }`}
              onClick={() => emotion.available && onEmotionChange(emotion.type)}
              data-testid={`button-animation-${emotion.type}`}
            >
              <span className={currentEmotion === emotion.type && emotion.available ? 'text-white' : ''}>{emotion.icon}</span>
              <span>{t(`animation.${emotion.type}`)}</span>
            </Button>
          );

          if (!emotion.available) {
            return (
              <Tooltip key={emotion.type}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('animation.comingSoon')}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </div>
    </div>
  );
}
