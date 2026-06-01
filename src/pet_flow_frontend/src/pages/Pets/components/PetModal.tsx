import { useState, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import type { Pet } from '../../../services/pets.service';
import styles from '../PetModal.module.css';

export interface CreatePetPayload {
  name: string;
  species: string;
  breed?: string;
  tutor_name: string;
  tutor_id?: string;
  age?: number;
  weight?: number;
  notes?: string;
  photo_url?: string;
  clinic_id: string;
}

interface PetModalProps {
  pet?: Pet | null;
  onClose: () => void;
  onSave: (payload: CreatePetPayload) => Promise<void>;
}

function tutorKey(petId?: string) {
  return petId ? `tutor_pet_${petId}` : 'tutor_pet_new';
}

export default function PetModal({ pet, onClose, onSave }: PetModalProps) {
  const [form, setForm] = useState({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    age: pet?.age || '',
    weight: pet?.weight || '',
    tutor_name: localStorage.getItem(tutorKey(pet?.id)) || pet?.tutor_name || '',
    notes: pet?.notes || '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(pet?.photo_url || null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.species || !form.tutor_name) return;

    setSaving(true);
    try {
      if (pet?.id) {
        localStorage.setItem(tutorKey(pet.id), form.tutor_name);
      } else {
        localStorage.setItem('tutor_pet_new', form.tutor_name);
      }

      await onSave({
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        age: Number(form.age) || undefined,
        weight: Number(form.weight) || undefined,
        tutor_name: form.tutor_name,
        notes: form.notes || undefined,
        photo_url: photoPreview || undefined,
        clinic_id: pet?.clinic_id || '',
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{pet ? 'Editar Pet' : 'Cadastro Pet'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar" type="button">
            <MdClose size={20} />
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formRow3}>
            <div className={styles.formField}>
              <label>Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Ex: Thor"
                required
              />
            </div>

            <div className={styles.formField}>
              <label>Espécie</label>
              <div className={styles.selectWrapper}>
                <select value={form.species} onChange={handleChange('species')} required>
                  <option value="">Selecione</option>
                  <option value="Cão">Cão</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Outro">Outro</option>
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </div>

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
              </div>
              <button type="button" className={styles.photoLabel} onClick={handlePhotoClick}>
                Foto do pet
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handlePhotoChange}
              />
            </div>

            <div className={styles.formField} style={{ flex: 1 }}>
              <label>Observações</label>
              <textarea
                value={form.notes}
                onChange={handleChange('notes')}
                placeholder="Observações sobre o pet..."
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
