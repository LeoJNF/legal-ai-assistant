import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import type { Document } from '@legal-ai/shared';
import { formatDate, formatFileSize, DOCUMENT_TYPES } from '@legal-ai/shared';

export function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await api.get('/api/documents');
      setDocuments(response.data.data || []);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzing(id);
    try {
      const response = await api.post(`/api/documents/${id}/analyze`);
      const analysis = response.data.data;
      Alert.alert(
        'Análise Concluída',
        `Resumo: ${analysis.summary?.substring(0, 200)}...`,
        [{ text: 'OK' }]
      );
      setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, status: 'ANALYZED' } : d));
    } catch {
      Alert.alert('Erro', 'Não foi possível analisar o documento');
    } finally {
      setAnalyzing(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'ANALYZED': return '#16a34a';
      case 'ANALYZING': return '#2563eb';
      case 'ERROR': return '#dc2626';
      default: return '#9ca3af';
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  return (
    <View style={styles.container}>
      {documents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>Nenhum documento</Text>
          <Text style={styles.emptyText}>Use o app web para enviar documentos</Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardMeta}>
                    {DOCUMENT_TYPES[item.type as keyof typeof DOCUMENT_TYPES]} • {formatFileSize(item.fileSize)}
                  </Text>
                  <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
              </View>
              {item.status !== 'ANALYZED' && (
                <TouchableOpacity
                  style={[styles.analyzeButton, analyzing === item.id && styles.analyzeButtonDisabled]}
                  onPress={() => handleAnalyze(item.id)}
                  disabled={analyzing === item.id}
                >
                  {analyzing === item.id ? (
                    <ActivityIndicator size="small" color="#2563eb" />
                  ) : (
                    <Text style={styles.analyzeButtonText}>⚡ Analisar com IA</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  emptyText: { fontSize: 14, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardMeta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  cardDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8, marginTop: 4 },
  analyzeButton: { marginTop: 12, backgroundColor: '#eff6ff', borderRadius: 8, padding: 8, alignItems: 'center' },
  analyzeButtonDisabled: { opacity: 0.6 },
  analyzeButtonText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
});
