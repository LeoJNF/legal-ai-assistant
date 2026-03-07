import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import type { Deadline } from '@legal-ai/shared';
import { DEADLINE_TYPES, PRIORITY_LABELS, formatDate, daysUntilDeadline } from '@legal-ai/shared';

export function DeadlinesScreen() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    try {
      const response = await api.get('/api/deadlines');
      setDeadlines(response.data.data || []);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os prazos');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.put(`/api/deadlines/${id}`, { status: 'COMPLETED' });
      setDeadlines((prev) => prev.map((d) => d.id === id ? { ...d, status: 'COMPLETED' } : d));
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o prazo');
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  return (
    <View style={styles.container}>
      {deadlines.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>Nenhum prazo cadastrado</Text>
          <Text style={styles.emptyText}>Use o app web para gerenciar prazos</Text>
        </View>
      ) : (
        <FlatList
          data={deadlines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const days = daysUntilDeadline(item.dueDate);
            const isCompleted = item.status === 'COMPLETED';
            return (
              <View style={[styles.card, isCompleted && styles.cardCompleted]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, isCompleted && styles.cardTitleCompleted]}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {DEADLINE_TYPES[item.type as keyof typeof DEADLINE_TYPES]} •{' '}
                      {formatDate(item.dueDate)}
                    </Text>
                    <Text style={styles.cardMeta}>
                      Prioridade: {PRIORITY_LABELS[item.priority as keyof typeof PRIORITY_LABELS]}
                    </Text>
                  </View>
                  <View style={[styles.daysBadge, {
                    backgroundColor: isCompleted ? '#dcfce7' : days < 0 ? '#fee2e2' : days <= 3 ? '#ffedd5' : '#f3f4f6'
                  }]}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isCompleted ? '#16a34a' : days < 0 ? '#dc2626' : days <= 3 ? '#ea580c' : '#374151' }}>
                      {isCompleted ? '✓' : days < 0 ? `-${Math.abs(days)}d` : `${days}d`}
                    </Text>
                  </View>
                </View>
                {!isCompleted && (
                  <TouchableOpacity style={styles.completeButton} onPress={() => handleComplete(item.id)}>
                    <Text style={styles.completeButtonText}>✓ Marcar como concluído</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
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
  cardCompleted: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardTitleCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  cardMeta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  daysBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, minWidth: 44, alignItems: 'center' },
  completeButton: { marginTop: 10, backgroundColor: '#f0fdf4', borderRadius: 8, padding: 8, alignItems: 'center' },
  completeButtonText: { color: '#16a34a', fontWeight: '600', fontSize: 14 },
});
