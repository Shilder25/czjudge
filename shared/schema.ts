import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const emotionSchema = z.enum(['idle', 'analyzing', 'thinking_deep', 'presenting', 'approving', 'concerned', 'gavel_tap']);
export type EmotionType = z.infer<typeof emotionSchema>;

export const caseAnalysisSchema = z.object({
  caseStrength: z.number().min(0).max(100),
  successProbability: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high']),
  keyFactors: z.array(z.string()),
  precedents: z.number().min(0),
});

export type CaseAnalysis = z.infer<typeof caseAnalysisSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  message: z.string().min(1).max(2000),
  sender: z.enum(["user", "cz", "system"]),
  username: z.string().optional(),
  timestamp: z.string(),
  emotion: emotionSchema.optional(),
  audioBase64: z.string().optional(),
  isAnalyticsButton: z.boolean().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const insertChatMessageSchema = chatMessageSchema.omit({ id: true, timestamp: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
