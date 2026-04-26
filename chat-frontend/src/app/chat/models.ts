// chat/models.ts
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}