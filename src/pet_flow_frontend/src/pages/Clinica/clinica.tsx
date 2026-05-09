import { useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdLocationOn, MdBusiness, MdClose } from 'react-icons/md';
import { clinicsService, type Clinic, type CreateClinicPayload } from '../../services/clinic.services';
import styles from './clinica.module.css';

const ITEMS_PER_PAGE = 9;

export default function Clinics() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [form, setForm] = useState<CreateClinicPayload>({
    name: '', cnpj: '', email: '', phone: '', address: '',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const data = await clinicsService.getAll();
      setClinics(data);
    } catch (err) {
      console.error('Erro ao carregar clínicas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClinics(); }, []);

  const openEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setForm({
      name: clinic.name,
      cnpj: clinic.cnpj,
      email: clinic.email,
      phone: clinic.phone,
      address: clinic.address,
    });
    setFormError('');
  };

  const closeEdit = () => {
    setEditingClinic(null);
    setFormError('');
  };

  const handleChange = (field: keyof CreateClinicPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cnpj || !form.email) {
      setFormError('Nome, CNPJ e e-mail são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      await clinicsService.update(editingClinic!.id, form);
      closeEdit();
      fetchClinics();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(clinics.length / ITEMS_PER_PAGE);
  const paginated = clinics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Unidades</h1>
      </div>

<<<<<<< HEAD
=======
      <div className={styles.toolbar}>
        <div />
        <button 
          className={styles.newBtn} 
          onClick={() => {
            setEditingClinic(null);
            setShowModal(true);
          }}
        >
          + Nova Clínica
        </button>
      </div>

>>>>>>> main
      {loading ? (
        <p className={styles.loadingText}>Carregando...</p>
      ) : (
        <>
          <div className={styles.grid}>
            {paginated.length === 0 && (
              <p className={styles.emptyText}>Nenhuma clínica encontrada.</p>
            )}
            {paginated.map((clinic) => (
<<<<<<< HEAD
              <div key={clinic.id} className={styles.card} onClick={() => openEdit(clinic)}>
                <div className={styles.cardIconWrap}>
                  <MdBusiness size={28} />
                </div>
=======
              <div 
                key={clinic.id} 
                className={styles.card} 
                onClick={() => {
                  setEditingClinic(clinic);
                  setShowModal(true);
                }}
              >
>>>>>>> main
                <div className={styles.cardInfo}>
                  <h3 className={styles.clinicName}>{clinic.name}</h3>
                  {clinic.address && (
                    <p className={styles.clinicAddress}>
                      <MdLocationOn size={14} />
                      {clinic.address}
                    </p>
                  )}
                  <p className={styles.clinicMeta}>
                    <strong>CNPJ:</strong> {clinic.cnpj}
                  </p>
                  {clinic.phone && (
                    <p className={styles.clinicMeta}>
                      <strong>Tel:</strong> {clinic.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <MdChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`${styles.pageBtn} ${n === currentPage ? styles.pageBtnActive : ''}`}
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Modal de edição ── */}
      {editingClinic && (
        <div className={styles.overlay} onClick={closeEdit}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar clínica</h2>
              <button className={styles.closeBtn} onClick={closeEdit} aria-label="Fechar">
                <MdClose size={18} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSave}>
              <div className={styles.formField}>
                <label htmlFor="m-name">Nome da clínica</label>
                <input
                  id="m-name"
                  type="text"
                  placeholder="Ex: PetFlow Centro"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="m-cnpj">CNPJ</label>
                <input
                  id="m-cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={handleChange('cnpj')}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="m-email">E-mail</label>
                  <input
                    id="m-email"
                    type="email"
                    placeholder="contato@clinica.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="m-phone">Telefone</label>
                  <input
                    id="m-phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="m-address">Endereço</label>
                <input
                  id="m-address"
                  type="text"
                  placeholder="Ex: Rua das Flores, 123, Belo Horizonte - MG"
                  value={form.address}
                  onChange={handleChange('address')}
                />
              </div>

              {formError && <p className={styles.errorMsg}>{formError}</p>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeEdit}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
