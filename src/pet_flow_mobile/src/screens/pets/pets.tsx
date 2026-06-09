import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../../contexts/SessionContext';
import { petsService, type Pet, type CreatePetPayload } from '../../services/petsservice';
import { tutorService, type Tutor } from '../../services/tutorService';
import { AppRoutes } from '../../navigation/routes';

const PAGE_SIZE = 5;
const SPECIES_OPTIONS = ['Cão', 'Gato', 'Pássaro', 'Réptil', 'Outro'];

type FormState = {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  tutor_id: string;
  tutor_name: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  species: '',
  breed: '',
  age: '',
  weight: '',
  tutor_id: '',
  tutor_name: '',
};

export default function PetsScreen() {
  const navigation = useNavigation<any>();
  const { session } = useSession();

  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  type Screen = 'list' | 'form';
  const [screen, setScreen] = useState<Screen>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [menuPet, setMenuPet] = useState<Pet | null>(null);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const [speciesOpen, setSpeciesOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorSearch, setTutorSearch] = useState('');
  const [tutors, setTutors] = useState<Tutor[]>([]);

  const loadPets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await petsService.getAll();
      setPets(data);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível carregar os pets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
    tutorService.getAll().then(setTutors).catch(() => {});
  }, [loadPets]);

  function openNewForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setScreen('form');
  }

  function openEditForm(pet: Pet) {
    setMenuPet(null);
    setEditingId(pet.id);
    setForm({
      name: pet.name ?? '',
      species: pet.species ?? '',
      breed: pet.breed ?? '',
      age: pet.age != null ? String(pet.age) : '',
      weight: pet.weight != null ? String(pet.weight) : '',
      tutor_id: pet.tutorId ?? '',
      tutor_name: tutors.find(t => t.id === pet.tutorId)?.name ?? pet.tutor_name ?? '',
    });
    setScreen('form');
  }

  function goBack() {
    setScreen('list');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSpeciesOpen(false);
    setTutorOpen(false);
    setTutorSearch('');
  }

  function patch(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const { name, species } = form;
    if (!name.trim() || !species.trim() || !form.tutor_id) {
      Alert.alert('Campos obrigatórios', 'Preencha Nome, Espécie e Tutor.');
      return;
    }

    const payload: CreatePetPayload = {
      name: form.name.trim(),
      species: form.species.trim(),
      breed: form.breed.trim() || undefined,
      tutor_id: form.tutor_id,
      tutor_name: form.tutor_name,
      age: form.age ? Number(form.age) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      clinic_id: session?.clinicId ?? '',
    };

    try {
      setSaving(true);
      if (editingId) {
        const updated = await petsService.update(editingId, payload);
        setPets((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        Alert.alert('Sucesso', 'Pet atualizado com sucesso.');
      } else {
        const created = await petsService.create(payload);
        setPets((prev) => [created, ...prev]);
        Alert.alert('Sucesso', 'Pet cadastrado com sucesso.');
      }
      goBack();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar o pet.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!petToDelete) return;
    try {
      await petsService.delete(petToDelete.id);
      setPets((prev) => prev.filter((p) => p.id !== petToDelete.id));
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível excluir o pet.');
    } finally {
      setPetToDelete(null);
    }
  }

  const filtered = useMemo(
    () =>
      pets.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.tutor_name?.toLowerCase().includes(search.toLowerCase()),
      ),
    [pets, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (screen === 'form') {
    const filteredTutors = tutors.filter(t =>
      t.name.toLowerCase().includes(tutorSearch.toLowerCase())
    );

    return (
      <KeyboardAvoidingView
        style={s.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.header}>
          <TouchableOpacity onPress={goBack} style={s.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>
            {editingId ? 'Editar Pet' : 'Cadastrar Pet'}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={s.formScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.formSubtitle}>
            Insira as informações básicas para o novo registro.
          </Text>

          <FormField label="Nome" required>
            <TextInput
              style={s.input}
              placeholder="Ex: Thor"
              placeholderTextColor="#94A3B8"
              value={form.name}
              onChangeText={(v) => patch('name', v)}
            />
          </FormField>

          <View style={s.row2}>
            <View style={{ flex: 1 }}>
              <FormField label="Espécie" required>
                <TouchableOpacity
                  style={s.select}
                  onPress={() => setSpeciesOpen((v) => !v)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.selectText, !form.species && { color: '#94A3B8' }]}>
                    {form.species || 'Selecionar'}
                  </Text>
                  <MaterialIcons
                    name={speciesOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
                {speciesOpen && (
                  <View style={s.dropdown}>
                    {SPECIES_OPTIONS.map((sp) => (
                      <TouchableOpacity
                        key={sp}
                        style={s.dropdownItem}
                        onPress={() => { patch('species', sp); setSpeciesOpen(false); }}
                      >
                        <Text style={s.dropdownItemText}>{sp}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </FormField>
            </View>

            <View style={{ flex: 1 }}>
              <FormField label="Raça">
                <TextInput
                  style={s.input}
                  placeholder="Ex: Persa"
                  placeholderTextColor="#94A3B8"
                  value={form.breed}
                  onChangeText={(v) => patch('breed', v)}
                />
              </FormField>
            </View>
          </View>

          <View style={s.row2}>
            <View style={{ flex: 1 }}>
              <FormField label="Idade (anos)">
                <TextInput
                  style={s.input}
                  placeholder="Ex: 2"
                  placeholderTextColor="#94A3B8"
                  value={form.age}
                  onChangeText={(v) => patch('age', v)}
                  keyboardType="numeric"
                />
              </FormField>
            </View>

            <View style={{ flex: 1 }}>
              <FormField label="Peso (kg)">
                <TextInput
                  style={s.input}
                  placeholder="Ex: 5.2"
                  placeholderTextColor="#94A3B8"
                  value={form.weight}
                  onChangeText={(v) => patch('weight', v)}
                  keyboardType="decimal-pad"
                />
              </FormField>
            </View>
          </View>

          <FormField label="Tutor Responsável" required>
            <TouchableOpacity
              style={s.select}
              onPress={() => { setTutorOpen(v => !v); setTutorSearch(''); }}
              activeOpacity={0.8}
            >
              <Text style={[s.selectText, !form.tutor_name && { color: '#94A3B8' }]}>
                {form.tutor_name || 'Selecionar tutor'}
              </Text>
              <MaterialIcons
                name={tutorOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>

            {tutorOpen && (
              <View style={s.dropdown}>
                <View style={s.tutorSearchWrapper}>
                  <MaterialIcons name="search" size={16} color="#94A3B8" />
                  <TextInput
                    style={s.tutorSearchInput}
                    placeholder="Buscar tutor..."
                    placeholderTextColor="#94A3B8"
                    value={tutorSearch}
                    onChangeText={setTutorSearch}
                    autoFocus
                  />
                </View>

                {filteredTutors.map(t => (
                  <TouchableOpacity
                    key={t.id}
                    style={s.dropdownItem}
                    onPress={() => {
                      patch('tutor_id', t.id);
                      patch('tutor_name', t.name);
                      setTutorOpen(false);
                    }}
                  >
                    <Text style={s.dropdownItemText}>{t.name}</Text>
                    {t.cpf ? (
                      <Text style={s.dropdownItemSub}>CPF: {t.cpf}</Text>
                    ) : null}
                  </TouchableOpacity>
                ))}

                {filteredTutors.length === 0 && (
                  <Text style={s.dropdownEmpty}>Nenhum tutor encontrado</Text>
                )}
              </View>
            )}
          </FormField>

          <View style={s.formActions}>
            <TouchableOpacity style={s.cancelBtn} onPress={goBack} activeOpacity={0.8}>
              <Text style={s.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={s.saveBtnText}>Salvar</Text>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.DASHBOARD)} style={s.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Pets</Text>
      </View>

      <View style={s.searchWrapper}>
        <MaterialIcons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar por pet ou tutor..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={(t) => { setSearch(t); setPage(1); }}
        />
      </View>

      <TouchableOpacity style={s.newBtn} onPress={openNewForm} activeOpacity={0.85}>
        <MaterialIcons name="add" size={18} color="#fff" />
        <Text style={s.newBtnText}>Novo Pet</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={paged}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={s.emptyText}>Nenhum pet encontrado.</Text>}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() => openEditForm(item)}
              onMenuPress={() => setMenuPet(item)}
            />
          )}
        />
      )}

      {!loading && totalPages > 1 && (
        <View style={s.paginationRow}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <TouchableOpacity
              key={n}
              style={[s.pageBtn, page === n && s.pageBtnActive]}
              onPress={() => setPage(n)}
            >
              <Text style={[s.pageBtnText, page === n && s.pageBtnTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
          {page < totalPages && (
            <TouchableOpacity style={s.pageBtn} onPress={() => setPage(page + 1)}>
              <MaterialIcons name="chevron-right" size={18} color="#2563EB" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity style={s.fab} onPress={openNewForm} activeOpacity={0.85}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={!!menuPet} transparent animationType="fade" onRequestClose={() => setMenuPet(null)}>
        <Pressable style={s.overlay} onPress={() => setMenuPet(null)}>
          <View style={s.menuCard}>
            <ContextMenuItem
              icon="edit"
              label="Editar Pet"
              color="#1E293B"
              onPress={() => menuPet && openEditForm(menuPet)}
            />
            <View style={s.menuDivider} />
            <ContextMenuItem
              icon="vaccines"
              label="Ver Vacinas"
              color="#1E293B"
              onPress={() => {
                if (!menuPet) return;
                setMenuPet(null);
                navigation.navigate(
                  AppRoutes.VACCINES,
                  {
                    petId: menuPet.id,
                    petName: menuPet.name,
                  }
                );
              }}
            />
            <View style={s.menuDivider} />
            <ContextMenuItem
              icon="delete-outline"
              label="Excluir Pet"
              color="#DC2626"
              onPress={() => {
                if (menuPet) { setPetToDelete(menuPet); setMenuPet(null); }
              }}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal visible={!!petToDelete} transparent animationType="fade" onRequestClose={() => setPetToDelete(null)}>
        <View style={s.overlay}>
          <View style={s.deleteCard}>
            <Text style={s.deleteTitle}>Excluir Pet?</Text>
            <Text style={s.deleteMsg}>
              Tem certeza que deseja remover este pet? Esta ação não poderá ser desfeita.
            </Text>
            <TouchableOpacity style={s.deleteConfirmBtn} onPress={handleDelete}>
              <Text style={s.deleteConfirmText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.deleteCancelBtn} onPress={() => setPetToDelete(null)}>
              <Text style={s.deleteCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PetCard({
  pet,
  onPress,
  onMenuPress,
}: {
  pet: Pet;
  onPress: () => void;
  onMenuPress: () => void;
}) {
  const lastVisit = pet.updatedAt
    ? new Date(pet.updatedAt).toLocaleDateString('pt-BR')
    : '—';

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.photo, s.photoFallback]}>
        <MaterialIcons name="pets" size={26} color="#94A3B8" />
      </View>

      <View style={s.cardBody}>
        <Text style={s.petName}>{pet.name}</Text>
        <Text style={s.petBreed}>
          {pet.species}{pet.breed ? ` • ${pet.breed}` : ''}
        </Text>
        {pet.tutor_name ? (
          <View style={s.metaRow}>
            <MaterialIcons name="person-outline" size={13} color="#64748B" />
            <Text style={s.metaText}> Tutor: {pet.tutor_name}</Text>
          </View>
        ) : null}
        <View style={s.metaRow}>
          <MaterialIcons name="calendar-today" size={13} color="#64748B" />
          <Text style={s.metaText}> Última visita: {lastVisit}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onMenuPress}
        style={s.kebab}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons name="more-vert" size={20} color="#64748B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function ContextMenuItem({
  icon, label, color, onPress,
}: { icon: any; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.menuItem} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons name={icon} size={18} color={color} />
      <Text style={[s.menuItemText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={s.fieldWrapper}>
      <Text style={s.fieldLabel}>
        {label}
        {required && <Text style={{ color: '#EF4444' }}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  backBtn: {
    marginRight: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    height: 46,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  newBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 48,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  photoFallback: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  petBreed: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
  },
  kebab: {
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
    backgroundColor: '#F8FAFC',
  },
  pageBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBtnActive: { backgroundColor: '#2563EB' },
  pageBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  pageBtnTextActive: { color: '#fff' },
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: 220,
    overflow: 'hidden',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 14,
  },
  deleteCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 310,
    padding: 26,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  deleteMsg: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  deleteConfirmBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteCancelBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteCancelText: { color: '#475569', fontWeight: '600', fontSize: 15 },
  formScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 19,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
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
  row2: {
    flexDirection: 'row',
    gap: 12,
  },
  select: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectText: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#0F172A',
  },
  dropdownItemSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  dropdownEmpty: {
    padding: 14,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
  },
  tutorSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  tutorSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
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
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});