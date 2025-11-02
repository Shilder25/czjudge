import type { Express } from "express";
import { createServer, type Server } from "http";
// WebSocket imports removed for Vercel compatibility (HTTP-only now)
// import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateAIResponse } from "./ai-service";
import { chatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Track last message time per user (5 second rate limit)
  const userLastMessageTime = new Map<string, number>();
  const MESSAGE_COOLDOWN_MS = 5000;

  // HTTP endpoint for chat (Vercel-compatible)
  const chatRequestSchema = z.object({
    content: z.string().min(1).max(2000),
    username: z.string().optional(),
    language: z.enum(['en', 'zh']).default('en'),
    walletAddress: z.string().optional(),
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const { content, username, language, walletAddress } = validatedData;

      // Rate limiting based on wallet address or IP
      const sessionKey = walletAddress || req.ip || 'unknown';
      const now = Date.now();
      const lastMessageTime = userLastMessageTime.get(sessionKey) || 0;
      const timeSinceLastMessage = now - lastMessageTime;

      if (timeSinceLastMessage < MESSAGE_COOLDOWN_MS) {
        const remainingTime = Math.ceil((MESSAGE_COOLDOWN_MS - timeSinceLastMessage) / 1000);
        return res.status(429).json({
          error: `Please wait ${remainingTime} seconds before sending another message.`,
          remainingTime
        });
      }

      // Update last message time
      userLastMessageTime.set(sessionKey, now);

      // Generate AI response
      const aiResponse = await generateAIResponse(content, language);

      // Build response messages
      const userMessage = {
        id: Date.now().toString(),
        message: content,
        sender: 'user' as const,
        username: username || 'Anonymous',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const czMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse.message,
        sender: 'cz' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: aiResponse.emotion,
        audioBase64: aiResponse.audioBase64,
      };

      // Return complete response
      res.json({
        userMessage,
        czMessage,
        analytics: aiResponse.analytics || null,
      });
    } catch (error) {
      console.error('Error in /api/chat:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /* WebSocket server removed for Vercel compatibility
   * The application now uses HTTP-only communication via POST /api/chat
   * This makes it compatible with serverless platforms like Vercel
   * 
   * Previous WebSocket code commented out below for reference:
   * 
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const broadcastViewerCount = () => { ... };
  wss.on('connection', (ws: WebSocketClient) => { ... });
  */

  return httpServer;
}
