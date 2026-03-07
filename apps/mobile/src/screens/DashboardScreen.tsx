import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import type { Deadline } from '@legal-ai/shared';
import { daysUntilDeadline, formatDate } from '@legal-ai/shared';

export function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [stats, setStats] = useState({ documents: 0, petitions: 0, pendingDeadlines: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, pets, dlns] = await Promise.all([
          api.get('/api/documents'),
          api.get('/api/petitions'),
          api.get('/api/deadlines'),
        ]);
        setStats({
          documents: docs.data.data?.length || 0,
          petitions: pets.data.data?.length || 0,
          pendingDeadlines: dlns.data.data?.filter((d: Deadline) => d.status === 'PENDING').length || 0,
        });
        setDeadlines((dlns.data.data || []).slice(0, 5));
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name?.split(' ')[0]}! 👋</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: 'Documentos', value: stats.documents, color: '#dbeafe', textColor: '#1d4ed8' },
          { label: 'Petições', value: stats.petitions, color: '#f3e8ff', textColor: '#7c3aed' },
          { label: 'Prazos', value: stats.pendingDeadlines, color: '#ffedd5', textColor: '#c2410c' },
        ].map(({ label, value, color, textColor }) => (
          <View key={label} style={[styles.statCard, { backgroundColor: color }]}>
            <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Prazos</Text>
        {deadlines.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum prazo cadastrado</Text>
        ) : (
          deadlines.slice(0, 5).map((d) => {
            const days = daysUntilDeadline(d.dueDate);
            return (
              <View key={d.id} style={styles.deadlineItem}>
                <View style={styles.deadlineInfo}>
                  <Text style={styles.deadlineTitle}>{d.title}</Text>
                  <Text style={styles.deadlineDate}>{formatDate(d.dueDate)}</Text>
                </View>
                <View style={[styles.daysBadge, { backgroundColor: days < 0 ? '#fee2e2' : days <= 3 ? '#ffedd5' : '#dcfce7' }]}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: days < 0 ? '#dc2626' : days <= 3 ? '#ea580c' : '#16a34a' }}>
                    {days < 0 ? `${Math.abs(days)}d` : `${days}d`}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 48 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  logoutText: { color: '#ef4444', fontSize: 14 },
  statsGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  section: { backgroundColor: '#fff', margin: 20, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  emptyText: { color: '#9ca3af', fontSize: 14 },
  deadlineItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  deadlineInfo: { flex: 1 },
  deadlineTitle: { fontSize: 14, fontWeight: '500', color: '#111827' },
  deadlineDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  daysBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
});
