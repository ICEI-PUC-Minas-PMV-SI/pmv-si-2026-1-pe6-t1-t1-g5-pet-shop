import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { serviceService, type Service, type CreateServicePayload } from '../../services/service';
import SearchBar from '../../components/SearchBar/SearchBar';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import ServiceModal from './ServiceModal';
import styles from './Services.module.css';

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await serviceService.list();
      setServices(data || []);
      setCurrentPage(1);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar serviços';
      console.error('Erro ao buscar serviços:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)) {
      return;
    }

    try {
      await serviceService.delete(service.id);
      fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir serviço');
    }
  };
 
  const handleNew = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSave = async (payload: CreateServicePayload) => {
    try {
      if (editingService) {
        await serviceService.update(editingService.id, {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          duration: payload.duration,
        });
      } else {
        await serviceService.create({
          name: payload.name,
          description: payload.description,
          price: payload.price,
          duration: payload.duration,
        });
      }
      handleModalClose();
      fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar serviço');
    }
  };

  // Filtro por nome
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns: Column<Service>[] = [
    { key: 'name', header: 'Nome' },
    { key: 'description', header: 'Descrição' },
    {
      key: 'price',
      header: 'Preço',
      render: (item) => formatCurrency(item.price),
    },
    {
      key: 'duration',
      header: 'Duração',
      render: (item) => formatDuration(item.duration),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Serviços</h1>
        <button className={styles.newBtn} onClick={handleNew}>
          <MdAdd size={16} />
          Novo Serviço
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Carregando serviços...</div>
      ) : services.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum serviço cadastrado</p>
          <button className={styles.emptyBtn} onClick={handleNew}>
            <MdAdd size={16} />
            Criar Primeiro Serviço
          </button>
        </div>
      ) : (
        <>
          <div className={styles.searchContainer}>
            <SearchBar
              placeholder="Busque por nome do serviço..."
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
            />
          </div>
          {filteredServices.length === 0 ? (
            <div className={styles.empty}>
              <p>Nenhum serviço encontrado</p>
            </div>
          ) : (
            <DataTable<Service>
              columns={columns}
              data={paginatedServices}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
