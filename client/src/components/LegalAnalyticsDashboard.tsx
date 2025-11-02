import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, AlertTriangle, CheckCircle2, FileText, BarChart3, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CaseAnalysis } from "@shared/schema";

interface LegalAnalyticsDashboardProps {
  analysis?: CaseAnalysis;
  isDefaultExample?: boolean;
}

export default function LegalAnalyticsDashboard({ analysis, isDefaultExample = false }: LegalAnalyticsDashboardProps) {
  const { t } = useLanguage();
  
  if (!analysis) {
    return (
      <div className="space-y-4 p-6">
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-semibold text-foreground">{t('analytics.noAnalysisTitle')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('analytics.noAnalysisDesc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-500/10 text-green-600 border-green-500";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500";
      case "high": return "bg-red-500/10 text-red-600 border-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle2 className="h-4 w-4" />;
      case "medium": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4 p-6">
      {isDefaultExample && (
        <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-3 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">
              {t('analytics.exampleCase')}: {t('analytics.binanceRegulatory')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('analytics.description')}
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        <Card data-testid="card-case-strength">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {t('analytics.caseStrength')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{analysis.caseStrength}%</span>
                <TrendingUp className={`h-5 w-5 ${analysis.caseStrength > 60 ? 'text-green-500' : 'text-yellow-500'}`} />
              </div>
              <Progress 
                value={analysis.caseStrength} 
                className="h-2" 
                data-testid="progress-case-strength"
              />
              <p className="text-xs text-muted-foreground">{t('analytics.basedOnPrecedents')}</p>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-success-probability">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              {t('analytics.successProbability')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{analysis.successProbability}%</span>
                <Badge variant="secondary" className="font-bold">
                  {analysis.successProbability > 70 ? t('analytics.strong') : analysis.successProbability > 40 ? t('analytics.moderate') : t('analytics.weak')}
                </Badge>
              </div>
              <Progress 
                value={analysis.successProbability} 
                className="h-2"
                data-testid="progress-success-probability"
              />
              <p className="text-xs text-muted-foreground">{t('analytics.estimatedOutcome')}</p>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-risk-assessment">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              {t('analytics.riskAssessment')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('analytics.overallRisk')}</span>
              <Badge 
                className={`${getRiskColor(analysis.riskLevel)} flex items-center gap-1.5 border-2 font-bold`}
                data-testid="badge-risk-level"
              >
                {getRiskIcon(analysis.riskLevel)}
                {t(`analytics.${analysis.riskLevel}`)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-precedents">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {t('analytics.similarPrecedents')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('analytics.casesAnalyzed')}</span>
              <span className="text-2xl font-black" data-testid="text-precedents-count">
                {analysis.precedents}
              </span>
            </div>
          </CardContent>
        </Card>

        {analysis.keyFactors.length > 0 && (
          <Card data-testid="card-key-factors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{t('analytics.keyFactors')}</CardTitle>
              <CardDescription className="text-xs">{t('analytics.keyFactorsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.keyFactors.map((factor, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-2 text-sm"
                    data-testid={`factor-${index}`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
