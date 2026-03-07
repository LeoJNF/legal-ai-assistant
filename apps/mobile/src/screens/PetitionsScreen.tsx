import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import type { Petition } from '@legal-ai/shared';
import { PETITION_TYPES } from '@legal-ai/shared';

export function PetitionsScreen() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetitions();
  }, []);

  const loadPetitions = async () => {
    try {
      const response = await api.get('/api/petitions');
      setPetitions(response.data.data || []);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as petições');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (petition: Petition) => {
    Alert.alert(
      petition.title,
      petition.content.substring(0, 500) + '...',
      [{ text: 'Fechar' }]
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  return (
    <View style={styles.container}>
      {petitions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⚖️</Text>
          <Text style={styles.emptyTitle}>Nenhuma petição</Text>
          <Text style={styles.emptyText}>Use o app web para gerar petições com IA</Text>
        </View>
      ) : (
        <FlatList
          data={petitions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleView(item)}>
              <View style={styles.cardHeader}>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>
                    {PETITION_TYPES[item.type as keyof typeof PETITION_TYPES]}
                  </Text>
                </View>
                <View style={[styles.statusTag, { backgroundColor: item.status === 'FINAL' ? '#dcfce7' : '#fef9c3' }]}>
                  <Text style={{ fontSize: 11, color: item.status === 'FINAL' ? '#16a34a' : '#a16207' }}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>Cliente: {item.clientName}</Text>
              {item.caseNumber && (
                <Text style={styles.cardMeta}>Processo: {item.caseNumber}</Text>
              )}
            </TouchableOpacity>
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
  cardHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  typeTag: { backgroundColor: '#ede9fe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeText: { fontSize: 11, color: '#7c3aed', fontWeight: '600' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardMeta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
});
