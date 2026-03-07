import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../services/api';
import type { ChatMessage } from '@legal-ai/shared';
import { v4 as uuidv4 } from 'uuid';

export function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat/message', {
        conversationId,
        message: userMessage.content,
      });

      const { conversationId: newConvId, message } = response.data.data;
      setConversationId(newConvId);
      setMessages((prev) => [...prev, message]);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(undefined);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>🤖 Assistente Jurídico</Text>
        <TouchableOpacity onPress={handleNewChat}>
          <Text style={styles.newChatText}>Nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.messageList, messages.length === 0 && styles.emptyList]}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Assistente Jurídico IA</Text>
            <Text style={styles.emptyText}>
              Especializado em direito brasileiro.{'\n'}
              Faça perguntas sobre legislação e jurisprudência.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.message, item.role === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={[styles.messageText, item.role === 'user' && styles.userMessageText]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Faça uma pergunta jurídica..."
          multiline
          maxLength={500}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  chatTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  newChatText: { color: '#2563eb', fontSize: 14 },
  messageList: { padding: 16, gap: 12 },
  emptyList: { flex: 1, justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  emptyText: { fontSize: 14, color: '#9ca3af', marginTop: 4, textAlign: 'center', lineHeight: 20 },
  message: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  userMessage: { backgroundColor: '#2563eb', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiMessage: { backgroundColor: '#f3f4f6', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, color: '#111827', lineHeight: 20 },
  userMessageText: { color: '#fff' },
  loadingContainer: { flexDirection: 'row', gap: 8, padding: 12, alignItems: 'center' },
  loadingText: { fontSize: 13, color: '#6b7280' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', gap: 8, alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 44, height: 44, backgroundColor: '#2563eb', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontSize: 18 },
});
