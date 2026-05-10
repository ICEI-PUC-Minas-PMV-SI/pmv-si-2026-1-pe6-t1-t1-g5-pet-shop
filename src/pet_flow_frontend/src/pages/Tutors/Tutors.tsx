import { useEffect, useState } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdAdd,
} from 'react-icons/md';
import { tutorService, type Tutor } from '../../services/tutor.service';
import { useSession } from '../../contexts/SessionContext';
import styles from './tutors.module.css';

const ITEMS_PER_PAGE = 5;

interface TutorForm {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
}

const emptyForm: TutorForm = {
  name: '',
  cpf: '',
  email: '',
  phone: '',
  address: '',
};

export default function Tutores() {
  const { session } = useSession();
  const clinicId = session?.clinicId || '';

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [form, setForm] = useState<TutorForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const data = await tutorService.getAll();
      setTutors(data);
    } catch (err) {
      console.error('Erro ao carregar tutores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTutors(); }, []);

  const filtered = tutors.filter((t) => {
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.cpf.includes(q);
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [search]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setSelectedTutor(null);
    setModalMode('create');
  };

  const openEdit = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setForm({
      name: tutor.name,
      cpf: tutor.cpf,
      email: tutor.email,
      phone: tutor.phone,
      address: tutor.address,
    });
    setFormError('');
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTutor(null);
    setFormError('');
  };

  const handleChange =
    (field: keyof TutorForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

 const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cpf || !form.email) {
      setFormError('Nome, CPF e e-mail são obrigatórios.');
      return;
    }

    setSaving(true);

    const dadosParaEnviar = {
      name: form.name,
      cpf: form.cpf,
      email: form.email,
      address: form.address,
      phone: form.phone,
      clinic_id: clinicId,
    };

    try {
      if (modalMode === 'edit' && selectedTutor) {
        await tutorService.update(selectedTutor.id, dadosParaEnviar);
      } else {
        await tutorService.create(dadosParaEnviar);
      }
      closeModal();
      fetchTutors();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tutorService.delete(id);
      setDeletingId(null);
      fetchTutors();
    } catch (err) {
      console.error('Erro ao excluir tutor:', err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tutores</h1>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <MdSearch size={18} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.newBtn} onClick={openCreate}>
          <MdAdd size={18} />
          + Novo Tutor
        </button>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Carregando...</p>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Pet</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      Nenhum tutor encontrado.
                    </td>
                  </tr>
                ) : (
                  paginated.map((tutor) => (
                    <tr key={tutor.id}>
                      <td>{tutor.name}</td>
                      <td>{tutor.cpf}</td>
                      <td>{tutor.email}</td>
                      <td>{tutor.phone}</td>
                      <td>{tutor.petName ?? '—'}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => openEdit(tutor)}
                            aria-label="Editar"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => setDeletingId(tutor.id)}
                            aria-label="Excluir"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

      {/* ── Create / Edit Modal ── */}
      {modalMode && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === 'edit' ? 'Editar tutor' : 'Novo tutor'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal} aria-label="Fechar">
                <MdClose size={18} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSave}>
              <div className={styles.formField}>
                <label htmlFor="t-name">Nome completo</label>
                <input
                  id="t-name"
                  type="text"
                  placeholder="Ex: Ana Cláudia"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="t-cpf">CPF</label>
                <input
                  id="t-cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange('cpf')}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="t-email">E-mail</label>
                  <input
                    id="t-email"
                    type="email"
                    placeholder="tutor@email.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="t-phone">Telefone</label>
                  <input
                    id="t-phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="t-address">Endereço</label>
                <input
                  id="t-address"
                  type="text"
                  placeholder="Ex: Rua das Flores, 123, Belo Horizonte - MG"
                  value={form.address}
                  onChange={handleChange('address')}
                />
              </div>

              {formError && <p className={styles.errorMsg}>{formError}</p>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
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

      {/* ── Delete Confirm Modal ── */}
      {deletingId && (
        <div className={styles.overlay} onClick={() => setDeletingId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Confirmar exclusão</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setDeletingId(null)}
                aria-label="Fechar"
              >
                <MdClose size={18} />
              </button>
            </div>
            <p className={styles.confirmText}>
              Tem certeza que deseja excluir este tutor? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeletingId(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={() => handleDelete(deletingId)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}