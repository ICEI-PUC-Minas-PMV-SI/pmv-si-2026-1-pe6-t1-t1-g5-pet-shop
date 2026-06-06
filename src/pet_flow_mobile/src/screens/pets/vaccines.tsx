/**
 * screens/pets/vaccines.tsx
 * Tela de Vacinas do Pet — Detalhe do Pet + lista de vacinas
 * Padrão Figma, integrado com a API real.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { petsService, type Pet } from '../../services/petsservice';
import { vaccineService, type Vaccine, type CreateVaccinePayload } from '../../services/vaccineservice';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type RouteParams = {
  petId: string;
  petName?: string;
};
type VaccineForm = {
  name: string;
  date: string;
};

const EMPTY_VACCINE_FORM: VaccineForm = {
  name: '',
  date: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    // Se a data vier no formato ISO puro YYYY-MM-DD (sem horário T00:00:00)
    if (dateStr.includes('-') && !dateStr.includes('T')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Caso venha com timestamp completo do banco de dados
    const date = new Date(dateStr);
    const targetTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + targetTimezoneOffset);
    
    return localDate.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

function getVaccineStatus(vaccine?: Vaccine) {
  return {
    label: 'Aplicada',
    color: '#16A34A',
    bg: '#DCFCE7',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────────────────────────────────────────

export default function VaccinesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { petId, petName } = route.params as RouteParams;

  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form modal
  const [formVisible, setFormVisible] = useState(false);
  const [editingVaccineId, setEditingVaccineId] = useState<string | null>(null);
  const [form, setForm] = useState<VaccineForm>(EMPTY_VACCINE_FORM);

  // delete modal
  const [vaccineToDelete, setVaccineToDelete] = useState<Vaccine | null>(null);

  // ── Load ─────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [petData, vaccinesData] = await Promise.all([
        petsService.getById(petId),
        vaccineService.getByPet(petId),
      ]);
      setPet(petData);
      setVaccines(vaccinesData);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Form helpers ──────────────────────────────────────────────────────────

  function openNewVaccine() {
    setEditingVaccineId(null);
    setForm(EMPTY_VACCINE_FORM);
    setFormVisible(true);
  }

  function openEditVaccine(vaccine: Vaccine) {
    setEditingVaccineId(vaccine.id);
    setForm({
      name: vaccine.name ?? '',
      date: vaccine.date
        ? vaccine.date.substring(8, 10) +
          '/' +
          vaccine.date.substring(5, 7) +
          '/' +
          vaccine.date.substring(0, 4)
        : '',
    });
    setFormVisible(true);
  }

  function patchForm(key: keyof VaccineForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // parse dd/mm/aaaa → ISO
  function parseBrDate(str: string): string | undefined {
    if (!str.trim()) return undefined;

    const [day, month, year] = str.split('/');

    if (!day || !month || !year) return undefined;

    // Retorna apenas a data, sem conversão de fuso horário
    return `${year}-${month}-${day}`;
  }

  // ── Save vaccine ──────────────────────────────────────────────────────────

  async function handleSaveVaccine() {
    if (!form.name.trim() || !form.date.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha Nome da Vacina e Data da Aplicação.');
      return;
    }

    const payload: CreateVaccinePayload = {
      name: form.name.trim(),
      date: parseBrDate(form.date)!,
      petId,
    };

    console.log('Payload enviado para API:', payload);

    try {
      setSaving(true);

      if (editingVaccineId) {
        const updated = await vaccineService.update(editingVaccineId, payload);

        console.log('Resposta da API (update):', updated);

        setVaccines((prev) =>
          prev.map((v) => (v.id === editingVaccineId ? updated : v))
        );

        Alert.alert('Sucesso', 'Vacina atualizada.');
      } else {
        const created = await vaccineService.create(payload);

        console.log('Resposta da API (create):', created);

        setVaccines((prev) => [created, ...prev]);

        Alert.alert('Sucesso', 'Vacina cadastrada.');
      }

      setFormVisible(false);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar a vacina.');
    } finally {
      setSaving(false);
    }
  }

  // ── Delete vaccine ────────────────────────────────────────────────────────

  async function handleDeleteVaccine() {
    if (!vaccineToDelete) return;
    try {
      await vaccineService.delete(vaccineToDelete.id);
      setVaccines((prev) => prev.filter((v) => v.id !== vaccineToDelete.id));
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível excluir a vacina.');
    } finally {
      setVaccineToDelete(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[s.root, s.centered]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const lastVisit = pet?.updatedAt ? formatDate(pet.updatedAt) : '—';

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhe do Pet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Seção Vacinas */}
        <Text style={s.sectionTitle}>Vacinas</Text>

        {/* Pet info card */}
        {pet && (
          <View style={s.petCard}>
            {pet.photo_url ? (
              <Image source={{ uri: pet.photo_url }} style={s.petPhoto} />
            ) : (
              <View style={[s.petPhoto, s.petPhotoFallback]}>
                <MaterialIcons name="pets" size={28} color="#94A3B8" />
              </View>
            )}
            <View style={{ marginTop: 10, gap: 2 }}>
              <Text style={s.petCardName}>Nome: {pet.name}</Text>
              <Text style={s.petCardBreed}>
                {pet.species}{pet.breed ? ` • ${pet.breed}` : ''}{pet.age ? ` • ${pet.age} anos` : ''}
              </Text>
              {pet.tutor_name && (
                <Text style={s.petCardMeta}>Tutor: {pet.tutor_name}</Text>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={s.petCardMeta}>Última visita: </Text>
                <Text style={[s.petCardMeta, { color: '#2563EB', fontWeight: '600' }]}>{lastVisit}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Vaccine list */}
        {vaccines.length === 0 ? (
          <Text style={s.emptyText}>Nenhuma vacina registrada.</Text>
        ) : (
          vaccines.map((vaccine) => {
            const status = getVaccineStatus(vaccine);
            return (
              <View key={vaccine.id} style={s.vaccineCard}>
                <View style={s.vaccineCardHeader}>
                  <Text style={s.vaccineName}>{vaccine.name}</Text>
                  <View style={s.vaccineActions}>
                    <TouchableOpacity
                      style={s.vaccineActionBtn}
                      onPress={() => openEditVaccine(vaccine)}
                    >
                      <MaterialIcons name="edit" size={16} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.vaccineActionBtn}
                      onPress={() => setVaccineToDelete(vaccine)}
                    >
                      <MaterialIcons name="delete" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={s.vaccineDatesRow}>
                  <View>
                    <Text style={s.vaccineDateLabel}>Data da Aplicação</Text>
                    <Text style={s.vaccineDateValue}>
                      {formatDate(vaccine.date)}
                    </Text>
                  </View>
                </View>

                <View style={[s.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={openNewVaccine} activeOpacity={0.85}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Vaccine Form Modal */}
      <Modal visible={formVisible} transparent animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <KeyboardAvoidingView
          style={s.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setFormVisible(false)} />
          <View style={s.formSheet}>
            <View style={s.formSheetHeader}>
              <Text style={s.formSheetTitle}>
                {editingVaccineId ? 'Editar Vacina' : 'Cadastrar Vacina'}
              </Text>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <MaterialIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Nome */}
              <View style={s.fieldWrapper}>
                <Text style={s.fieldLabel}>Nome da Vacina <Text style={{ color: '#EF4444' }}>*</Text></Text>
                <TextInput
                  style={s.input}
                  placeholder="Ex: V10, Antirrábica..."
                  placeholderTextColor="#94A3B8"
                  value={form.name}
                  onChangeText={(v) => patchForm('name', v)}
                />
              </View>

              {/* Datas */}
              <View style={s.fieldWrapper}>
                <Text style={s.fieldLabel}>
                  Data da Aplicação <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>

                <TextInput
                  style={s.input}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#94A3B8"
                  value={form.date}
                  onChangeText={(v) => {
                    const numbers = v.replace(/\D/g, '').slice(0, 8);
                    let formatted = numbers;

                    if (numbers.length > 2) {
                      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
                    }
                    if (numbers.length > 4) {
                      formatted =
                        numbers.slice(0, 2) +
                        '/' +
                        numbers.slice(2, 4) +
                        '/' +
                        numbers.slice(4);
                    }
                    patchForm('date', formatted);
                  }}
                  keyboardType="numeric"
                />
              </View>

              {/* Botões */}
              <View style={s.formActions}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setFormVisible(false)}>
                  <Text style={s.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.saveBtn, saving && { opacity: 0.7 }]}
                  onPress={handleSaveVaccine}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={s.saveBtnText}>Salvar</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete confirm modal */}
      <Modal visible={!!vaccineToDelete} transparent animationType="fade" onRequestClose={() => setVaccineToDelete(null)}>
        <View style={s.overlay}>
          <View style={s.deleteCard}>
            <Text style={s.deleteTitle}>Excluir Vacina?</Text>
            <Text style={s.deleteMsg}>
              Tem certeza que deseja remover esta vacina? Esta ação não poderá ser desfeita.
            </Text>
            <TouchableOpacity style={s.deleteConfirmBtn} onPress={handleDeleteVaccine}>
              <Text style={s.deleteConfirmText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.deleteCancelBtn} onPress={() => setVaccineToDelete(null)}>
              <Text style={s.deleteCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { marginRight: 10, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },

  // Pet card
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  petPhoto: { width: 72, height: 72, borderRadius: 36 },
  petPhotoFallback: { backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  petCardName: { fontSize: 16, fontWeight: '700', color: '#2563EB', textAlign: 'center' },
  petCardBreed: { fontSize: 13, color: '#64748B', textAlign: 'center' },
  petCardMeta: { fontSize: 13, color: '#475569', textAlign: 'center' },

  // Vaccine card
  vaccineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  vaccineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaccineName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  vaccineActions: { flexDirection: 'row', gap: 8 },
  vaccineActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vaccineDatesRow: { flexDirection: 'row', gap: 24, marginBottom: 10 },
  vaccineDateLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  vaccineDateValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 12, fontWeight: '600' },

  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 32, fontSize: 14 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  // Overlays
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },

  // Form sheet (bottom sheet style)
  formSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  formSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formSheetTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },

  // Form fields
  fieldWrapper: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row2: { flexDirection: 'row', gap: 12 },
  formActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Delete modal
  deleteCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 310,
    padding: 26,
    alignItems: 'center',
    gap: 10,
  },
  deleteTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  deleteMsg: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 6 },
  deleteConfirmBtn: {
    width: '100%', height: 48, backgroundColor: '#DC2626',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  deleteConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteCancelBtn: {
    width: '100%', height: 48, backgroundColor: '#F1F5F9',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  deleteCancelText: { color: '#475569', fontWeight: '600', fontSize: 15 },
});