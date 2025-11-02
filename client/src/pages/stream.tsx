import { useState, useEffect } from "react";
import StreamHeader from "@/components/StreamHeader";
import CZ3DViewer from "@/components/CZ3DViewer";
import ChatPanel from "@/components/ChatPanel";
import ContractAddress from "@/components/ContractAddress";
import AnimationControls from "@/components/AnimationControls";
import PredefinedCases from "@/components/PredefinedCases";
import LegalAnalyticsDashboard from "@/components/LegalAnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FileText, X, BarChart3 } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CaseAnalysis } from "@shared/schema";

// Default Binance example case
const defaultBinanceCase: CaseAnalysis = {
  caseStrength: 65,
  successProbability: 58,
  riskLevel: 'medium',
  precedents: 18,
  keyFactors: [
    'Proactive compliance measures implemented',
    'Multi-jurisdictional regulatory cooperation',
    'Historical precedent of exchange settlements',
    'Evolving regulatory framework for crypto'
  ]
};

export default function StreamPage() {
  const [showContractInfo, setShowContractInfo] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [caseAnalysis, setCaseAnalysis] = useState<CaseAnalysis>(defaultBinanceCase);
  const [isDefaultExample, setIsDefaultExample] = useState(true);
  const { currentEmotion, sendEmotion, lastMessage } = useWebSocket('/ws');
  const { t } = useLanguage();
  
  // Listen for case analytics from WebSocket
  useEffect(() => {
    if (lastMessage?.type === 'case_analytics') {
      setCaseAnalysis(lastMessage.data);
      setIsDefaultExample(false);
      // Auto-open analytics sheet when new data arrives
      setShowAnalytics(true);
    }
  }, [lastMessage]);

  // Handle predefined case selection
  const handleCaseSelect = (caseText: string, analysis: CaseAnalysis) => {
    setCaseAnalysis(analysis);
    setIsDefaultExample(false);
    setShowAnalytics(true);
    // You could also send the case text to the chat if needed
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <StreamHeader />
      
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 w-full lg:w-[70%] relative lg:border-r-4 lg:border-primary border-t-4 border-primary">
          <CZ3DViewer emotion={currentEmotion} />
          
          <div className="absolute bottom-8 left-8 flex flex-col gap-3 z-20">
            <AnimationControls onEmotionChange={sendEmotion} currentEmotion={currentEmotion} />
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-primary border-2 border-primary hover:bg-primary/90 hover-elevate shadow-md rounded-xl px-4 py-2 font-bold text-primary-foreground"
              onClick={() => setShowAnalytics(!showAnalytics)}
              data-testid="button-analytics"
            >
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm">{t('button.caseAnalytics')}</span>
            </Button>
            
            <PredefinedCases onCaseSelect={handleCaseSelect} />
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-card border-2 border-border hover-elevate shadow-md rounded-xl px-4 py-2 font-bold text-foreground"
              onClick={() => setShowContractInfo(!showContractInfo)}
              data-testid="button-contract-info"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">{t('button.contractAddress')}</span>
            </Button>
          </div>
        </div>
        
        <div className="hidden lg:block w-[30%] min-w-[320px] max-w-[420px] border-t-4 border-primary">
          <ChatPanel onOpenAnalytics={() => setShowAnalytics(true)} />
        </div>
      </div>

      {showContractInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative max-w-3xl w-full animate-in zoom-in-95 duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-foreground hover:bg-muted h-10 w-10 rounded-lg bg-white shadow-sm"
              onClick={() => setShowContractInfo(false)}
              data-testid="button-close-contract"
            >
              <X className="h-5 w-5" />
            </Button>
            <ContractAddress />
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[45vh] border-t-2 border-border bg-white z-40">
        <ChatPanel onOpenAnalytics={() => setShowAnalytics(true)} />
      </div>

      <Sheet open={showAnalytics} onOpenChange={setShowAnalytics}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('analytics.title')}
            </SheetTitle>
            <SheetDescription>
              {t('analytics.description')}
            </SheetDescription>
          </SheetHeader>
          <LegalAnalyticsDashboard analysis={caseAnalysis} isDefaultExample={isDefaultExample} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
