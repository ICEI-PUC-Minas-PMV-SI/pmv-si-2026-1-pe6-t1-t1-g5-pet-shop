import { useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdLocationOn, MdBusiness } from 'react-icons/md';
import ClinicModal, { type Clinic } from './ClinicModal'; 
import { clinicsService } from "../../services/clinic.services";
import styles from './clinica.module.css';

const ITEMS_PER_PAGE = 6;

export default function Clinics() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

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

  const totalPages = Math.ceil(clinics.length / ITEMS_PER_PAGE);
  const paginated = clinics.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Unidades</h1>
      </div>

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

      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <>
          <div className={styles.grid}>
            {paginated.map((clinic) => (
              <div 
                key={clinic.id} 
                className={styles.card} 
                onClick={() => {
                  setEditingClinic(clinic);
                  setShowModal(true);
                }}
              >
                <div className={styles.cardInfo}>
                  <div className={styles.nameHeader}>
                    <MdBusiness className={styles.clinicIcon} size={20} />
                    <h3 className={styles.clinicName}>{clinic.name}</h3>
                  </div>
                  <p className={styles.clinicLocation}>
                    <MdLocationOn size={14} /> {clinic.city} - {clinic.state}
                  </p>
                  <div className={styles.metaData}>
                    <p className={styles.details}><strong>CNPJ:</strong> {clinic.cnpj}</p>
                    <p className={styles.details}><strong>Tel:</strong> {clinic.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                className={styles.pageBtn} 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                disabled={currentPage === 1}
              >
                <MdChevronLeft size={24} />
              </button>
              <span className={styles.pageInfo}>Página {currentPage} de {totalPages}</span>
              <button 
                className={styles.pageBtn} 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                disabled={currentPage === totalPages}
              >
                <MdChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <ClinicModal 
          clinic={editingClinic} 
          onClose={() => {
            setShowModal(false);
            setEditingClinic(null);
          }} 
          onSave={async (payload) => {
            if (editingClinic) {
              await clinicsService.update(editingClinic.id, payload);
            } else {
              await clinicsService.create(payload);
            }
            setShowModal(false);
            fetchClinics();
          }} 
        />
      )}
    </div>
  );
}
