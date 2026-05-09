import { useEffect, useMemo, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { employeeService, type Employee } from '../../services/employee';
import { clinicsService } from '../../services/clinic.services';
import styles from './Employees.module.css';

const ITEMS_PER_PAGE = 5;

const emptyForm = {
  name: '',
  cpf: '',
  address: '',
  phone: '',
  email: '',
  role: '',
  clinicId: '',
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clinics, setClinics] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState(emptyForm);

  // ─── Carrega clínica + funcionários ────────────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const [clinicList, data] = await Promise.all([
          clinicsService.getAll(),
          employeeService.getAll(),
        ]);
        setClinics(clinicList.map((c) => ({ id: c.id, name: c.name })));
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ─── CRUD ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...form };
    try {
      if (editingId) {
        const updated = await employeeService.update(editingId, payload);
        setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? updated : emp)));
      } else {
        const created = await employeeService.create(payload);
        setEmployees((prev) => [...prev, created]);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar funcionário');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Deseja realmente excluir este funcionário?')) return;
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir funcionário');
    }
  }

  function handleOpenNew() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowModal(true);
  }

  function handleOpenEdit(employee: Employee) {
    setForm({
      name: employee.name,
      cpf: employee.cpf,
      address: employee.address,
      phone: employee.phone,
      email: employee.email,
      role: employee.role,
      clinicId: employee.clinicId,
    });
    setEditingId(employee.id);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Filter + Pagination ────────────────────────────────────────────────────
  const roles = useMemo(() => {
    const unique = employees.map((e) => e.role);
    return ['Todos', ...new Set(unique)];
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.cpf.includes(search);
      const matchRole = roleFilter === 'Todos' || emp.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [employees, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return <div className={styles.loading}>Carregando funcionários...</div>;
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Funcionários</h1>
        <button className={styles.newBtn} onClick={handleOpenNew}>
          + Novo Funcionário
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <select
          className={styles.roleSelect}
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
        >
          {roles.map((role) => <option key={role}>{role}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>Nenhum funcionário encontrado.</td>
              </tr>
            )}
            {paginated.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.cpf}</td>
                <td>{emp.email}</td>
                <td>
                  <span className={styles.roleBadge}>{emp.role}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleOpenEdit(emp)} aria-label="Editar">✏️</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(emp.id)} aria-label="Excluir">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <MdChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <MdChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow2}>
                <div className={styles.field}>
                  <label>Nome</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Ex: João Silva" required />
                </div>
                <div className={styles.field}>
                  <label>CPF</label>
                  <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.field}>
                  <label>E-mail</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" required />
                </div>
                <div className={styles.field}>
                  <label>Telefone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div className={styles.formRow2}>
                <div className={styles.field}>
                  <label>Cargo</label>
                  <input name="role" value={form.role} onChange={handleChange} placeholder="Ex: Veterinário" required />
                </div>
                <div className={styles.field}>
                  <label>Endereço</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Rua, número" />
                </div>
              </div>

              <div className={styles.field}>
                <label>Clínica</label>
                <select
                  name="clinicId"
                  value={form.clinicId}
                  onChange={(e) => setForm((prev) => ({ ...prev, clinicId: e.target.value }))}
                  className={styles.selectField}
                  required
                >
                  <option value="">Selecione uma clínica...</option>
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className={styles.saveBtn}>{editingId ? 'Atualizar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
