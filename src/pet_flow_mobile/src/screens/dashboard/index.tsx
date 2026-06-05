import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../../contexts/SessionContext';
import { colors } from '../../theme';
import { useDashboard } from './useDashboard';
import { styles } from './styles';
import { AppRoutes } from '../../navigation/routes';

function formatTime(dateTime: string) {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateTime: string) {
  const date = new Date(dateTime);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { loading, appointmentsToday, petsCount, revenue, alertsCount, upcomingAppointments } = useDashboard();

  const cards = useMemo(
    () => [
      {
        label: 'Agendamentos hoje',
        value: String(appointmentsToday),
        icon: 'calendar-today' as const,
        iconColor: colors.primary,
      },
      {
        label: 'Pets cadastrados',
        value: String(petsCount),
        icon: 'pets' as const,
        iconColor: colors.primaryDark,
      },
      {
        label: 'Receita mensal',
        value: revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        icon: 'attach-money' as const,
        iconColor: colors.success,
      },
      {
        label: 'Alertas estoque',
        value: String(alertsCount),
        icon: 'warning' as const,
        iconColor: colors.danger,
      },
    ],
    [appointmentsToday, alertsCount, petsCount, revenue],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Que bom te ver, {session?.name?.split(' ')[0] || 'Marcos'}!</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              {cards.map((card) => (
                <View key={card.label} style={styles.statCard}>
                  <View style={[styles.statCardIconCircle, { backgroundColor: card.iconColor }]}>
                    <MaterialIcons name={card.icon} size={18} color={require('../../theme').colors.textWhite} />
                  </View>
                  <Text style={styles.statCardLabel}>{card.label}</Text>
                  <Text style={styles.statCardValue}>{card.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próximos agendamentos</Text>
              </View>

              {upcomingAppointments.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Nenhum agendamento futuro encontrado.</Text>
                </View>
              ) : (
                <View>
                <FlatList
                  data={upcomingAppointments}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.appointmentList}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                      <View style={styles.appointmentCard}>
                      <View style={styles.appointmentRow}>
                        <Text style={styles.appointmentTitle}>{item.petName}</Text>
                        <Text style={styles.appointmentTime}>{formatTime(item.dateTime)}</Text>
                      </View>
                      <Text style={styles.appointmentMeta}>{formatDate(item.dateTime)} · {item.serviceName}</Text>
                      <Text style={styles.appointmentValue}>
                        <Text style={styles.appointmentLabelStrong}>Tutor:</Text> {item.tutorName} - <Text style={styles.appointmentLabelStrong}>Funcionário:</Text> {item.employeeName}
                      </Text>
                    </View>
                  )}
                />
                <TouchableOpacity style={styles.viewCompleteLink} onPress={() => navigation.navigate(AppRoutes.SCHEDULING)}>
                  <Text style={styles.viewCompleteLinkText}>Ver agenda completa</Text>
                </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
