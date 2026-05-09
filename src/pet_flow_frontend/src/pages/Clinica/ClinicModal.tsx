import { useEffect, useState } from 'react';
import styles from './registerclinic.module.css';

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  city: string;
  state: string;
  phone: string;
}

interface Props {
  clinic: Clinic | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function ClinicModal({ clinic, onClose, onSave }: Props) {
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    city: '',
    state: '',
    phone: ''
  });

  // Sincroniza os dados quando o modal abre (Edição vs Cadastro)
  useEffect(() => {
    if (clinic) {
      setFormData(clinic);
    } else {
      setFormData({ name: '', cnpj: '', city: '', state: '', phone: '' });
    }
  }, [clinic]);

  // Função para atualizar os campos conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Envia apenas os campos editáveis, sem id nem campos gerados pela API
  onSave({
    name: formData.name,
    cnpj: formData.cnpj,
    city: formData.city,
    state: formData.state,
    phone: formData.phone,
  });
};
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{clinic ? 'Detalhes da Unidade' : 'Nova Unidade'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nome</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label>CNPJ</label>
            <input name="cnpj" value={formData.cnpj} onChange={handleChange} required />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Cidade</label>
              <input name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>UF</label>
              <input name="state" value={formData.state} onChange={handleChange} maxLength={2} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Telefone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}