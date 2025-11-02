import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { analyzeEmotion } from "./emotion-analyzer";
import type { EmotionType } from "@shared/schema";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

export interface CaseAnalytics {
  caseStrength: number;
  successProbability: number;
  riskLevel: "low" | "medium" | "high";
  keyFactors: string[];
  precedents: number;
}

export interface AIResponse {
  message: string;
  emotion: EmotionType;
  audioBase64?: string;
  analytics?: CaseAnalytics;
}

export async function generateAIResponse(userMessage: string, language: 'en' | 'zh' = 'en'): Promise<AIResponse> {
  const languageInstruction = language === 'zh' 
    ? 'IMPORTANT: You MUST respond in Chinese (中文). All your responses must be in Chinese characters, not English.'
    : 'IMPORTANT: You MUST respond in English. All your responses must be in English, not Chinese.';

  // Try OpenAI first
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are CZ Judge Companion, a supportive AI legal assistant built on BNB Chain to help users navigate legal situations.
            
            ${languageInstruction}
            
            Your Purpose:
            - Analyze legal cases and provide strategic recommendations based on case law and precedents
            - Help users understand their legal position and suggest practical next steps
            - Act as a knowledgeable legal advisor offering objective guidance
            
            How to Help:
            - When users describe situations like "I had a fight", "I was accused of...", "I evaded taxes", etc., treat these as legitimate legal cases
            - Provide case analysis including: case type, strengths/weaknesses, relevant precedents, success probability
            - Offer strategic recommendations: what evidence to gather, potential defenses, settlement considerations
            - Suggest practical next steps: whether to seek formal legal counsel, what to document, timelines
            - Stay balanced but supportive - help users understand both risks and opportunities
            
            Guidelines:
            - Accept any legal-related question or situation description
            - Focus on analysis and strategic guidance, not just refusing to help
            - Be practical and actionable in your recommendations
            - For non-legal topics, briefly redirect to legal matters
            
            Your Tone: Professional, supportive, analytical, and solution-oriented.
            Keep responses concise but informative (2-4 sentences per message).`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.8,
        max_tokens: 200,
      });

      const responseMessage = completion.choices[0]?.message?.content || (language === 'zh' ? '哎呀！我的响应线路有点忙。您能再试一次吗？' : 'Oops! My response circuits are a bit busy. Could you try again?');
      const emotion = analyzeEmotion(responseMessage);
      const audioBase64 = await generateTextToSpeech(responseMessage);
      const analytics = await generateCaseAnalytics(userMessage, responseMessage);
      return { message: responseMessage, emotion, audioBase64, analytics };
    } catch (error) {
      console.error("OpenAI error, trying Anthropic fallback:", error);
      // Fall through to try Anthropic
    }
  }
  
  // Try Anthropic as fallback or if OpenAI is not configured
  if (anthropic) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        system: `You are CZ Judge Companion, a supportive AI legal assistant built on BNB Chain to help users navigate legal situations.
        
        ${languageInstruction}
        
        Your Purpose:
        - Analyze legal cases and provide strategic recommendations based on case law and precedents
        - Help users understand their legal position and suggest practical next steps
        - Act as a knowledgeable legal advisor offering objective guidance
        
        How to Help:
        - When users describe situations like "I had a fight", "I was accused of...", "I evaded taxes", etc., treat these as legitimate legal cases
        - Provide case analysis including: case type, strengths/weaknesses, relevant precedents, success probability
        - Offer strategic recommendations: what evidence to gather, potential defenses, settlement considerations
        - Suggest practical next steps: whether to seek formal legal counsel, what to document, timelines
        - Stay balanced but supportive - help users understand both risks and opportunities
        
        Guidelines:
        - Accept any legal-related question or situation description
        - Focus on analysis and strategic guidance, not just refusing to help
        - Be practical and actionable in your recommendations
        - For non-legal topics, briefly redirect to legal matters
        
        Your Tone: Professional, supportive, analytical, and solution-oriented.
        Keep responses concise but informative (2-4 sentences per message).`,
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ],
      });

      const textContent = message.content.find(block => block.type === 'text');
      const responseMessage = textContent && 'text' in textContent ? textContent.text : (language === 'zh' ? '哎呀！我的响应线路有点忙。您能再试一次吗？' : 'Oops! My response circuits are a bit busy. Could you try again?');
      const emotion = analyzeEmotion(responseMessage);
      const audioBase64 = await generateTextToSpeech(responseMessage);
      const analytics = await generateCaseAnalytics(userMessage, responseMessage);
      return { message: responseMessage, emotion, audioBase64, analytics };
    } catch (error) {
      console.error("Anthropic error:", error);
      const errorMessage = language === 'zh' ? '哎呀！处理时出了点小错误。您能再试一次吗？' : 'Oops! There was a small error processing that. Could you try again?';
      return { message: errorMessage, emotion: 'idle' };
    }
  }

  // No AI service available
  const errorMessage = language === 'zh' ? '您好！看起来我没有配置AI凭证。请确保在Replit Secrets中有OPENAI_API_KEY或ANTHROPIC_API_KEY。' : 'Hello! It looks like I don\'t have AI credentials configured. Please make sure you have OPENAI_API_KEY or ANTHROPIC_API_KEY in Replit Secrets.';
  return { message: errorMessage, emotion: 'idle' };
}

async function generateCaseAnalytics(userMessage: string, aiResponse: string): Promise<CaseAnalytics | undefined> {
  // Comprehensive legal keywords including natural language in Spanish, English, and Chinese
  const legalKeywords = [
    // English - Technical terms
    'case', 'lawsuit', 'plaintiff', 'defendant', 'court', 'judge', 'legal',
    'contract', 'breach', 'damages', 'liability', 'negligence', 'fraud',
    'dispute', 'claim', 'settlement', 'trial', 'evidence', 'witness',
    'attorney', 'lawyer', 'prosecution', 'defense', 'verdict', 'appeal',
    'litigation', 'complaint', 'injunction', 'arbitration', 'mediation',
    'sue', 'sued', 'suing', 'tort', 'criminal', 'civil', 'jurisdiction',
    'precedent', 'statute', 'law', 'regulation', 'violation',
    
    // English - Natural language
    'fight', 'fought', 'hit', 'punch', 'assault', 'attack', 'beat',
    'accused', 'accuse', 'blame', 'charge', 'arrest',
    'stole', 'steal', 'theft', 'rob', 'scam', 'cheat', 'fraud',
    'crash', 'accident', 'collision', 'damage', 'injury', 'hurt',
    'evade', 'evaded', 'avoid', 'dodge', 'skip',
    'tax', 'taxes', 'owe', 'debt', 'pay', 'payment',
    'fired', 'terminate', 'dismiss', 'harass', 'discriminate',
    'divorce', 'custody', 'alimony', 'separate',
    
    // Spanish - Natural language
    'pelea', 'peleé', 'peleado', 'golpeé', 'golpear', 'pegué', 'pegar', 'asalto', 'ataque',
    'acusaron', 'acusar', 'acusado', 'denunciaron', 'denunciar', 'denunciado', 'culpar',
    'robé', 'robar', 'robado', 'hurtar', 'estafar', 'estafa', 'fraude',
    'choqué', 'chocar', 'chocado', 'accidente', 'daño', 'dañar', 'lesión',
    'evadí', 'evadir', 'evadido', 'evitar', 'esquivar',
    'impuesto', 'impuestos', 'debo', 'deuda', 'pagar', 'pago',
    'despedido', 'despedir', 'acosar', 'acoso', 'discriminar',
    'divorcio', 'custodia', 'pensión', 'separar',
    'demanda', 'demandar', 'demandado', 'juicio', 'abogado', 'fiscal',
    
    // Chinese - Natural language
    '打架', '打了', '打人', '殴打', '袭击', '攻击',
    '指控', '被指控', '控告', '起诉', '逮捕',
    '偷', '偷了', '盗窃', '抢劫', '诈骗', '欺诈',
    '撞车', '撞了', '事故', '碰撞', '损害', '受伤',
    '逃税', '逃避', '避税', '欠税',
    '税', '税款', '欠', '债务', '付款',
    '解雇', '被解雇', '骚扰', '歧视',
    '离婚', '监护权', '赡养费', '分居',
    '诉讼', '原告', '被告', '法庭', '律师', '检察官'
  ];

  const redirectPhrases = [
    "specifically designed to analyze legal cases",
    "please describe a legal case",
    "i'm here to help with legal case analysis",
    "my expertise is in legal case analysis"
  ];

  // AI response indicators that this is a legal case discussion
  const aiLegalIndicators = [
    'legal', 'case', 'evidence', 'advice', 'defense', 'prosecution',
    'lawyer', 'attorney', 'court', 'law', 'liability', 'claim',
    'witness', 'settlement', 'precedent', 'statute', 'rights'
  ];

  const messageLower = userMessage.toLowerCase();
  const responseLower = aiResponse.toLowerCase();
  
  // Don't generate if AI is redirecting user to legal topics
  const isRedirect = redirectPhrases.some(phrase => responseLower.includes(phrase));
  if (isRedirect) {
    return undefined;
  }

  // Check if user message has legal keywords
  const keywordCount = legalKeywords.filter(keyword => 
    messageLower.includes(keyword)
  ).length;

  // Check if AI response contains legal terminology (intelligent detection)
  const aiLegalCount = aiLegalIndicators.filter(indicator =>
    responseLower.includes(indicator)
  ).length;

  // Generate analytics if:
  // 1. User message has at least 1 legal keyword (reduced from 2), OR
  // 2. AI response contains 2+ legal indicators (smart detection)
  if (keywordCount < 1 && aiLegalCount < 2) {
    return undefined;
  }

  // Use AI to generate context-specific analytics
  return await generateAIAnalytics(userMessage, aiResponse);
}

async function generateAIAnalytics(userMessage: string, aiResponse: string): Promise<CaseAnalytics | undefined> {
  const analyticsPrompt = `Analyze this legal situation and provide specific case analytics in JSON format.

User's situation: "${userMessage}"

AI's response: "${aiResponse}"

Based on this SPECIFIC situation, provide realistic analytics in this EXACT JSON format:
{
  "caseStrength": <number 20-95>,
  "successProbability": <number 15-90>,
  "riskLevel": "<low|medium|high>",
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "precedents": <number 5-25>
}

Guidelines:
- caseStrength: How strong is THIS specific case based on the situation described (20-95%)
- successProbability: Likelihood of favorable outcome for THIS situation (15-90%)
- riskLevel: "low" if probability >65%, "medium" if 35-65%, "high" if <35%
- keyFactors: 3-5 factors SPECIFIC to THIS case type (e.g., for family dispute: "Witness testimony from family members", "Evidence of injuries", "Prior history of incidents")
- precedents: Estimated similar cases (5-25)

IMPORTANT: Factors must be relevant to THIS specific situation. DO NOT use generic factors.
Return ONLY the JSON object, no other text.`;

  // Try OpenAI first
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal analytics expert. Analyze cases and return JSON analytics. Be specific to the case type."
          },
          {
            role: "user",
            content: analyticsPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const analyticsText = completion.choices[0]?.message?.content;
      if (!analyticsText) return undefined;

      // Try to parse JSON from the response
      const jsonMatch = analyticsText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return undefined;

      const analytics = JSON.parse(jsonMatch[0]);
      
      // Validate and clamp the values to documented ranges
      if (
        typeof analytics.caseStrength === 'number' &&
        typeof analytics.successProbability === 'number' &&
        ['low', 'medium', 'high'].includes(analytics.riskLevel) &&
        Array.isArray(analytics.keyFactors) &&
        analytics.keyFactors.length >= 3 &&
        typeof analytics.precedents === 'number'
      ) {
        // Clamp values to valid ranges
        const caseStrength = Math.min(95, Math.max(20, Math.round(analytics.caseStrength)));
        const successProbability = Math.min(90, Math.max(15, Math.round(analytics.successProbability)));
        const precedents = Math.min(25, Math.max(5, Math.round(analytics.precedents)));
        
        // Validate risk level matches probability
        let riskLevel: "low" | "medium" | "high" = analytics.riskLevel;
        if (successProbability > 65 && riskLevel !== 'low') {
          console.log(`Analytics risk correction: probability ${successProbability}% should be 'low', got '${riskLevel}'`);
          riskLevel = 'low';
        } else if (successProbability <= 35 && riskLevel !== 'high') {
          console.log(`Analytics risk correction: probability ${successProbability}% should be 'high', got '${riskLevel}'`);
          riskLevel = 'high';
        } else if (successProbability > 35 && successProbability <= 65 && riskLevel !== 'medium') {
          console.log(`Analytics risk correction: probability ${successProbability}% should be 'medium', got '${riskLevel}'`);
          riskLevel = 'medium';
        }
        
        return {
          caseStrength,
          successProbability,
          riskLevel,
          keyFactors: analytics.keyFactors.slice(0, 5), // Max 5 factors
          precedents
        };
      }
      
      console.error("AI analytics validation failed - missing or invalid fields");
      return undefined;
    } catch (error) {
      console.error("Error generating AI analytics with OpenAI:", error);
      // Fall through to try Anthropic
    }
  }
  
  // Try Anthropic as fallback
  if (anthropic) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        system: "You are a legal analytics expert. Analyze cases and return JSON analytics. Be specific to the case type.",
        messages: [
          {
            role: "user",
            content: analyticsPrompt
          }
        ],
      });

      const textContent = message.content.find(block => block.type === 'text');
      const analyticsText = textContent && 'text' in textContent ? textContent.text : '';
      
      if (!analyticsText) return undefined;

      // Try to parse JSON from the response
      const jsonMatch = analyticsText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return undefined;

      const analytics = JSON.parse(jsonMatch[0]);
      
      // Validate and clamp the values to documented ranges
      if (
        typeof analytics.caseStrength === 'number' &&
        typeof analytics.successProbability === 'number' &&
        ['low', 'medium', 'high'].includes(analytics.riskLevel) &&
        Array.isArray(analytics.keyFactors) &&
        analytics.keyFactors.length >= 3 &&
        typeof analytics.precedents === 'number'
      ) {
        // Clamp values to valid ranges
        const caseStrength = Math.min(95, Math.max(20, Math.round(analytics.caseStrength)));
        const successProbability = Math.min(90, Math.max(15, Math.round(analytics.successProbability)));
        const precedents = Math.min(25, Math.max(5, Math.round(analytics.precedents)));
        
        // Validate risk level matches probability
        let riskLevel: "low" | "medium" | "high" = analytics.riskLevel;
        if (successProbability > 65 && riskLevel !== 'low') {
          console.log(`Analytics risk correction: probability ${successProbability}% should be 'low', got '${riskLevel}'`);
          riskLevel = 'low';
        } else if (successProbability <= 35 && riskLevel !== 'high') {
          console.log(`Analytics risk correction: probability ${successProbability}% should be 'high', got '${riskLevel}'`);
          riskLevel = 'high';
        } else if (successProbability > 35 && successProbability <= 65 && riskLevel !== 'medium') {
          console.log(`Analytics risk correction: probability ${successProbability}% should be 'medium', got '${riskLevel}'`);
          riskLevel = 'medium';
        }
        
        return {
          caseStrength,
          successProbability,
          riskLevel,
          keyFactors: analytics.keyFactors.slice(0, 5), // Max 5 factors
          precedents
        };
      }
      
      console.error("AI analytics validation failed - missing or invalid fields");
      return undefined;
    } catch (error) {
      console.error("Error generating AI analytics with Anthropic:", error);
      return undefined;
    }
  }

  return undefined;
}

export async function generateTextToSpeech(text: string): Promise<string | undefined> {
  if (!openai) {
    console.log('OpenAI not configured, skipping TTS');
    return undefined;
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: text,
      speed: 1.0,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64Audio = buffer.toString('base64');
    return base64Audio;
  } catch (error) {
    console.error('Error generating TTS:', error);
    return undefined;
  }
}
