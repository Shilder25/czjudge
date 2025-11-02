import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building2, Shield, DollarSign, Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CaseAnalysis } from "@shared/schema";

interface PredefinedCase {
  id: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  icon: React.ReactNode;
  category: string;
  analysis: CaseAnalysis;
}

const predefinedCases: PredefinedCase[] = [
  {
    id: 'binance-regulatory',
    titleEn: 'Binance Regulatory Compliance',
    titleZh: 'Binance监管合规',
    descriptionEn: 'A cryptocurrency exchange faces regulatory scrutiny regarding KYC/AML compliance and licensing requirements in multiple jurisdictions.',
    descriptionZh: '一家加密货币交易所面临多个司法管辖区关于KYC/AML合规和许可要求的监管审查。',
    icon: <Building2 className="h-5 w-5" />,
    category: 'Regulatory',
    analysis: {
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
    }
  },
  {
    id: 'smart-contract-dispute',
    titleEn: 'Smart Contract Dispute - DeFi Protocol',
    titleZh: '智能合约纠纷 - DeFi协议',
    descriptionEn: 'A user claims losses due to a smart contract vulnerability in a DeFi lending protocol, seeking compensation for unauthorized fund withdrawals.',
    descriptionZh: '用户声称因DeFi借贷协议中的智能合约漏洞造成损失，寻求未授权资金提取的赔偿。',
    icon: <Shield className="h-5 w-5" />,
    category: 'Smart Contract',
    analysis: {
      caseStrength: 42,
      successProbability: 35,
      riskLevel: 'high',
      precedents: 12,
      keyFactors: [
        'Code audit documentation available',
        'Terms of service limitations of liability',
        'Decentralized governance structure',
        'Precedent of "code is law" principle'
      ]
    }
  },
  {
    id: 'crypto-fraud',
    titleEn: 'Cryptocurrency Fraud Investigation',
    titleZh: '加密货币欺诈调查',
    descriptionEn: 'Investigation of a suspected pump-and-dump scheme involving coordinated trading activity to manipulate token prices on multiple exchanges.',
    descriptionZh: '调查涉及多个交易所协调交易活动操纵代币价格的疑似拉高出货计划。',
    icon: <DollarSign className="h-5 w-5" />,
    category: 'Fraud',
    analysis: {
      caseStrength: 78,
      successProbability: 72,
      riskLevel: 'low',
      precedents: 23,
      keyFactors: [
        'Clear blockchain transaction evidence',
        'Pattern of coordinated trading activity',
        'Multiple victim testimonies',
        'Existing securities fraud precedents'
      ]
    }
  },
  {
    id: 'binance-user-account',
    titleEn: 'Binance Account Freezing Dispute',
    titleZh: 'Binance账户冻结纠纷',
    descriptionEn: 'A user disputes account freezing and asset seizure by Binance, claiming insufficient evidence for suspected fraudulent activity on their account.',
    descriptionZh: '用户对Binance冻结账户和扣押资产提出异议，声称其账户涉嫌欺诈活动的证据不足。',
    icon: <Scale className="h-5 w-5" />,
    category: 'Platform Dispute',
    analysis: {
      caseStrength: 48,
      successProbability: 41,
      riskLevel: 'medium',
      precedents: 15,
      keyFactors: [
        'Platform terms of service provisions',
        'Evidence of suspicious activity patterns',
        'User cooperation with investigation',
        'Regulatory compliance obligations'
      ]
    }
  }
];

interface PredefinedCasesProps {
  onCaseSelect: (caseText: string, analysis: CaseAnalysis) => void;
}

export default function PredefinedCases({ onCaseSelect }: PredefinedCasesProps) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleCaseClick = (predefinedCase: PredefinedCase) => {
    const caseText = language === 'zh' ? predefinedCase.descriptionZh : predefinedCase.descriptionEn;
    onCaseSelect(caseText, predefinedCase.analysis);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-card border-2 border-border hover-elevate shadow-md rounded-xl px-4 py-2 font-bold text-foreground"
          data-testid="button-predefined-cases"
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm">{language === 'zh' ? '示例案件' : 'Example Cases'}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">
            {language === 'zh' ? '预定义案件示例' : 'Predefined Case Examples'}
          </SheetTitle>
          <SheetDescription>
            {language === 'zh' 
              ? '选择一个加密货币或Binance相关的案件示例以查看AI分析' 
              : 'Select a crypto or Binance-related case example to see AI analysis'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {predefinedCases.map((predefinedCase) => (
            <Card 
              key={predefinedCase.id}
              className="cursor-pointer transition-all hover-elevate active-elevate-2"
              onClick={() => handleCaseClick(predefinedCase)}
              data-testid={`case-card-${predefinedCase.id}`}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {predefinedCase.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold">
                      {language === 'zh' ? predefinedCase.titleZh : predefinedCase.titleEn}
                    </CardTitle>
                    <div className="mt-1 text-xs text-muted-foreground font-semibold uppercase">
                      {predefinedCase.category}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {language === 'zh' ? predefinedCase.descriptionZh : predefinedCase.descriptionEn}
                </CardDescription>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">{language === 'zh' ? '成功率:' : 'Success:'}</span>
                    <span className="font-bold text-foreground">{predefinedCase.analysis.successProbability}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">{language === 'zh' ? '风险:' : 'Risk:'}</span>
                    <span className={`font-bold uppercase ${
                      predefinedCase.analysis.riskLevel === 'low' ? 'text-green-600' :
                      predefinedCase.analysis.riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {language === 'zh' 
                        ? predefinedCase.analysis.riskLevel === 'low' ? '低' : predefinedCase.analysis.riskLevel === 'medium' ? '中' : '高'
                        : predefinedCase.analysis.riskLevel}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
