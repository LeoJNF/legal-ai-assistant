import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { sendChatMessage } from '@legal-ai/ai';
import { sendMessageSchema } from '@legal-ai/shared';
import { logger } from '../utils/logger';
import type { ApiResponse, ChatMessage, ChatResponse } from '@legal-ai/shared';

export const chatRouter = Router();

// In-memory conversation store for development.
// In production, replace with MongoDB persistence using the @legal-ai/api MongoDB connection.
// See MONGODB_URI in .env.example for configuration.
const conversations = new Map<string, { title: string; messages: ChatMessage[]; userId: string }>();

// List conversations
chatRouter.get('/conversations', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const userConversations = Array.from(conversations.entries())
    .filter(([, conv]) => conv.userId === req.userId)
    .map(([id, conv]) => ({
      id,
      title: conv.title,
      messageCount: conv.messages.length,
      createdAt: conv.messages[0]?.createdAt || new Date(),
    }));

  res.json({ success: true, data: userConversations });
});

// Get conversation by ID
chatRouter.get('/conversations/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const conversation = conversations.get(req.params.id);

  if (!conversation || conversation.userId !== req.userId) {
    res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    return;
  }

  res.json({ success: true, data: conversation });
});

// Send message
chatRouter.post('/message', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse<ChatResponse>>) => {
  try {
    const data = sendMessageSchema.parse(req.body);

    let conversationId = data.conversationId;
    let conversation = conversationId ? conversations.get(conversationId) : null;

    if (!conversation) {
      conversationId = uuidv4();
      conversation = {
        title: data.message.substring(0, 50),
        messages: [],
        userId: req.userId!,
      };
      conversations.set(conversationId, conversation);
    }

    if (conversation.userId !== req.userId) {
      res.status(403).json({ success: false, error: 'Acesso negado' });
      return;
    }

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: data.message,
      createdAt: new Date(),
    };

    conversation.messages.push(userMessage);

    const aiResponse = await sendChatMessage(data.message, conversation.messages.slice(0, -1));

    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: aiResponse,
      createdAt: new Date(),
    };

    conversation.messages.push(assistantMessage);

    res.json({
      success: true,
      data: {
        conversationId: conversationId!,
        message: assistantMessage,
      },
    });
  } catch (error) {
    logger.error('Error sending chat message:', error);
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao enviar mensagem' });
    }
  }
});

// Delete conversation
chatRouter.delete('/conversations/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const conversation = conversations.get(req.params.id);

  if (!conversation || conversation.userId !== req.userId) {
    res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    return;
  }

  conversations.delete(req.params.id);
  res.json({ success: true, message: 'Conversa excluída com sucesso' });
});
