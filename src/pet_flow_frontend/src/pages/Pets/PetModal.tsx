import { useState, useEffect } from 'react';
import { MdClose, MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { vaccineService, type Vaccine, type CreateVaccinePayload } from '../../services/vaccine.service';
import { tutorService, type Tutor } from '../../services/tutor.service';
import type { Pet } from '../../services/pets.service';
import styles from './PetModal.module.css';

export interface CreatePetPayload {
  name: string;
  species: string;
  breed: string;
  age: number | '';
  photo_url: string;
  tutor_name: string;
<<<<<<< HEAD
=======
  tutor_id?: string;
  age?: number;
  weight?: number;
  notes?: string;
  photo_url?: string;
  clinic_id: string;
>>>>>>> main
}

interface Props {
  pet: Pet | null;
  onClose: () => void;
  onSave: (payload: CreatePetPayload) => Promise<void>;
}

type Tab = 'dados' | 'vacinas';

const EMPTY_PET: CreatePetPayload = {
  name: '', species: '', breed: '', age: '', photo_url: '', tutor_name: '',
};

<<<<<<< HEAD
const EMPTY_VACCINE: CreateVaccinePayload = {
  name: '', date: '', petId: '',
};
=======
  const [form, setForm] = useState({
    name:       pet?.name       || '',
    species:    pet?.species    || '',
    breed:      pet?.breed      || '',
    age:        pet?.age        || '',
    weight:     pet?.weight     || '',
    tutor_name: localStorage.getItem(tutorKey(pet?.id)) || pet?.tutor_name || '',
    notes:      pet?.notes      || '',
  });
>>>>>>> main

// ─── Component ────────────────────────────────────────────────────────────────
export default function PetModal({ pet, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dados');

  // ── Dados tab state ─────────────────────────────────────────────────────────
  const [form, setForm] = useState<CreatePetPayload>(EMPTY_PET);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // ── Tutores state ───────────────────────────────────────────────────────────
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(false);

  // ── Vacinas tab state ───────────────────────────────────────────────────────
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
  const [vaccineForm, setVaccineForm] = useState<CreateVaccinePayload>(EMPTY_VACCINE);
  const [savingVaccine, setSavingVaccine] = useState(false);
  const [vaccineError, setVaccineError] = useState('');

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name,
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age ?? '',
        photo_url: pet.photo_url || '',
        tutor_name: localStorage.getItem(`tutor_pet_${pet.id}`) || '',
      });
    } else {
      setForm(EMPTY_PET);
    }
    setActiveTab('dados');
    setFormError('');
  }, [pet]);

  useEffect(() => {
    fetchTutors();
  }, []);

  useEffect(() => {
    if (activeTab === 'vacinas' && pet?.id) {
      fetchVaccines();
    }
  }, [activeTab, pet?.id]);

  const fetchTutors = async () => {
    setLoadingTutors(true);
    try {
      const data = await tutorService.getAll();
      setTutors(data);
    } catch {
      setTutors([]);
    } finally {
      setLoadingTutors(false);
    }
  };

  const fetchVaccines = async () => {
    if (!pet?.id) return;
    setLoadingVaccines(true);
    try {
      const data = await vaccineService.getByPet(pet.id);
      setVaccines(data);
    } catch {
      setVaccines([]);
    } finally {
      setLoadingVaccines(false);
    }
  };

  // ── Pet form handlers ───────────────────────────────────────────────────────
  const handleChange = (field: keyof CreatePetPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'age' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.species) {
      setFormError('Nome e espécie são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
<<<<<<< HEAD
      await onSave(form);
=======
      if (pet?.id) {
        localStorage.setItem(tutorKey(pet.id), form.tutor_name);
      } else {
        localStorage.setItem('tutor_pet_new', form.tutor_name);
      }

      await onSave({
        name:       form.name,
        species:    form.species,
        breed:      form.breed      || undefined,
        age:        Number(form.age) || undefined,
        weight:     Number(form.weight) || undefined,
        tutor_name: form.tutor_name,
        notes:      form.notes      || undefined,
        photo_url:  photoPreview    || undefined,
        clinic_id:  pet?.clinic_id  || '',
      });
>>>>>>> main
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  // ── Vaccine form handlers ───────────────────────────────────────────────────
  const openNewVaccine = () => {
    setEditingVaccine(null);
    setVaccineForm({ ...EMPTY_VACCINE, petId: pet?.id || '' });
    setVaccineError('');
    setShowVaccineForm(true);
  };

  const openEditVaccine = (v: Vaccine) => {
    setEditingVaccine(v);
    setVaccineForm({
      name: v.name,
      date: v.date,
      petId: v.petId,
    });
    setVaccineError('');
    setShowVaccineForm(true);
  };

  const handleVaccineChange = (field: keyof CreateVaccinePayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setVaccineForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineForm.name || !vaccineForm.date) {
      setVaccineError('Nome e data são obrigatórios.');
      return;
    }
    setSavingVaccine(true);
    try {
      if (editingVaccine) {
        await vaccineService.update(editingVaccine.id, vaccineForm);
      } else {
        await vaccineService.create({ ...vaccineForm, petId: pet!.id });
      }
      setShowVaccineForm(false);
      fetchVaccines();
    } catch (err) {
      setVaccineError(err instanceof Error ? err.message : 'Erro ao salvar vacina.');
    } finally {
      setSavingVaccine(false);
    }
  };

  const handleDeleteVaccine = async (id: string) => {
    if (!confirm('Remover esta vacina?')) return;
    try {
      await vaccineService.delete(id);
      fetchVaccines();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover.');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── Modal header ── */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {pet ? 'Editar pet' : 'Novo pet'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <MdClose size={18} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'dados' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('dados')}
          >
            Dados
          </button>
          {pet && (
            <button
              className={`${styles.tab} ${activeTab === 'vacinas' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('vacinas')}
            >
              Vacinas
            </button>
          )}
        </div>

        {/* ══ TAB: DADOS ══ */}
        {activeTab === 'dados' && (
          <form className={styles.modalForm} onSubmit={handleSavePet}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label htmlFor="p-name">Nome do pet</label>
                <input
                  id="p-name"
                  type="text"
                  placeholder="Ex: Thor"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="p-tutor">Tutor</label>
                <select
                  id="p-tutor"
                  value={form.tutor_name}
                  onChange={handleChange('tutor_name')}
                  disabled={loadingTutors}
                >
                  <option value="">
                    {loadingTutors ? 'Carregando...' : 'Selecione um tutor'}
                  </option>
                  {tutors.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

<<<<<<< HEAD
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label htmlFor="p-species">Espécie</label>
                <input
                  id="p-species"
                  type="text"
                  placeholder="Ex: Cachorro"
                  value={form.species}
                  onChange={handleChange('species')}
                />
=======
            <div className={styles.formField}>
              <label>Raça</label>
              <input
                type="text"
                value={form.breed}
                onChange={handleChange('breed')}
                placeholder="Ex: Persa"
              />
            </div>
          </div>

          <div className={styles.formRow3}>
            <div className={styles.formField}>
              <label>Idade (anos)</label>
              <input
                type="number"
                value={form.age}
                onChange={handleChange('age')}
                placeholder="Ex: 3"
                min="0"
              />
            </div>

            <div className={styles.formField}>
              <label>Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={handleChange('weight')}
                placeholder="Ex: 5.2"
              />
            </div>

            <div className={styles.formField}>
              <label>Tutor Responsável</label>
              <input
                type="text"
                value={form.tutor_name}
                onChange={handleChange('tutor_name')}
                placeholder="Nome do tutor"
                required
              />
            </div>
          </div>

          <div className={styles.formRowBottom}>
            <div className={styles.photoSection}>
              <div className={styles.photoCircle} onClick={handlePhotoClick}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Foto do pet" className={styles.photoImg} />
                ) : (
                  <span className={styles.photoIcon}>🐶</span>
                )}
>>>>>>> main
              </div>
              <div className={styles.formField}>
                <label htmlFor="p-breed">Raça</label>
                <input
                  id="p-breed"
                  type="text"
                  placeholder="Ex: Golden Retriever"
                  value={form.breed}
                  onChange={handleChange('breed')}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label htmlFor="p-age">Idade (anos)</label>
                <input
                  id="p-age"
                  type="number"
                  min={0}
                  placeholder="Ex: 3"
                  value={form.age}
                  onChange={handleChange('age')}
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="p-photo">URL da foto</label>
                <input
                  id="p-photo"
                  type="text"
                  placeholder="https://..."
                  value={form.photo_url}
                  onChange={handleChange('photo_url')}
                />
              </div>
            </div>

            {formError && <p className={styles.errorMsg}>{formError}</p>}

            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}

        {/* ══ TAB: VACINAS ══ */}
        {activeTab === 'vacinas' && (
          <div className={styles.vaccineTab}>

            <div className={styles.vaccineToolbar}>
              <button className={styles.newVaccineBtn} onClick={openNewVaccine}>
                <MdAdd size={16} />
                Nova Vacina
              </button>
            </div>

            {showVaccineForm && (
              <div className={styles.vaccineFormWrap}>
                <form className={styles.vaccineForm} onSubmit={handleSaveVaccine}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="v-name">Vacina</label>
                      <input
                        id="v-name"
                        type="text"
                        placeholder="Ex: V10"
                        value={vaccineForm.name}
                        onChange={handleVaccineChange('name')}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="v-date">Data de aplicação</label>
                      <input
                        id="v-date"
                        type="date"
                        value={vaccineForm.date}
                        onChange={handleVaccineChange('date')}
                      />
                    </div>
                  </div>

                  {vaccineError && <p className={styles.errorMsg}>{vaccineError}</p>}

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setShowVaccineForm(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={savingVaccine}>
                      {savingVaccine ? 'Salvando...' : editingVaccine ? 'Atualizar' : 'Adicionar'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loadingVaccines ? (
              <p className={styles.loadingText}>Carregando vacinas...</p>
            ) : vaccines.length === 0 ? (
              <p className={styles.emptyText}>Nenhuma vacina registrada.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Vacina</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccines.map((v) => (
                      <tr key={v.id}>
                        <td>{v.name}</td>
                        <td>{formatDate(v.date)}</td>
                        <td>
                          <div className={styles.tableActions}>
                            <button
                              className={styles.iconBtn}
                              onClick={() => openEditVaccine(v)}
                              aria-label="Editar"
                            >
                              <MdEdit size={16} />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                              onClick={() => handleDeleteVaccine(v.id)}
                              aria-label="Remover"
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
