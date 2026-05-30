import styles from '../Employees.module.css';

interface EmployeeModalProps {
  editingId: string | null;
  form: {
    name: string;
    cpf: string;
    address: string;
    phone: string;
    email: string;
    role: string;
    clinicId: string;
  };
  clinics: { id: string; name: string }[];
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EmployeeModal({
  editingId,
  form,
  clinics,
  onClose,
  onChange,
  onSelectChange,
  onSubmit,
}: EmployeeModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formRow2}>
            <div className={styles.field}>
              <label>Nome</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className={styles.field}>
              <label>CPF</label>
              <input
                name="cpf"
                value={form.cpf}
                onChange={onChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div className={styles.formRow2}>
            <div className={styles.field}>
              <label>E-mail</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Telefone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className={styles.formRow2}>
            <div className={styles.field}>
              <label>Cargo</label>
              <input
                name="role"
                value={form.role}
                onChange={onChange}
                placeholder="Ex: Veterinário"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Endereço</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Rua, número"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Clínica</label>
            <select
              name="clinicId"
              value={form.clinicId}
              onChange={onSelectChange}
              className={styles.selectField}
              required
            >
              <option value="">Selecione uma clínica...</option>
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
