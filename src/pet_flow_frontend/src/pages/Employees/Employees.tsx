import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useEmployees } from './useEmployees';
import EmployeeModal from './components/EmployeeModal';
import styles from './Employees.module.css';

export default function Employees() {
  const {
    clinics,
    loading,
    editingId,
    showModal,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    form,
    roles,
    totalPages,
    paginated,
    handleSubmit,
    handleDelete,
    handleOpenNew,
    handleOpenEdit,
    handleCloseModal,
    handleChange,
    handleSelectChange,
  } = useEmployees();

  if (loading) {
    return <div className={styles.loading}>Carregando funcionários...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Funcionários</h1>
        <button className={styles.newBtn} onClick={handleOpenNew}>
          + Novo Funcionário
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className={styles.roleSelect}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>

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
                <td colSpan={5} className={styles.emptyRow}>
                  Nenhum funcionário encontrado.
                </td>
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
                    <button
                      className={styles.editBtn}
                      onClick={() => handleOpenEdit(emp)}
                      aria-label="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(emp.id)}
                      aria-label="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {showModal && (
        <EmployeeModal
          editingId={editingId}
          form={form}
          clinics={clinics}
          onClose={handleCloseModal}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
