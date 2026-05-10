import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { type Service, type CreateServicePayload } from '../../services/service';
import styles from './ServiceModal.module.css';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onSave: (data: CreateServicePayload) => Promise<void>;
}

export default function ServiceModal({ service, onClose, onSave }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
      });
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação
    if (!formData.name.trim()) {
      setError('Nome do serviço é obrigatório');
      return;
    }
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Preço deve ser maior que 0');
      return;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Duração deve ser maior que 0');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{service ? 'Editar Serviço' : 'Novo Serviço'}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Fechar"
          >
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="name">Nome do Serviço *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Banho Completo"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o serviço"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Preço (R$) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="duration">Duração (min) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="30"
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 