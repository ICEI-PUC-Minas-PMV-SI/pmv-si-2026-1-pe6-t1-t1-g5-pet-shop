import { MdChevronLeft, MdChevronRight, MdLocationOn, MdBusiness } from 'react-icons/md';
import { useClinica } from './useClinica';
import ClinicModal from './components/ClinicModal';
import styles from './clinica.module.css';

export default function Clinics() {
  const {
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    paginated,
    showModal,
    editingClinic,
    handleOpenNew,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
  } = useClinica();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Unidades</h1>
      </div>

      <div className={styles.toolbar}>
        <div />
        <button className={styles.newBtn} onClick={handleOpenNew}>
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
                onClick={() => handleOpenEdit(clinic)}
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
                    <p className={styles.details}>
                      <strong>CNPJ:</strong> {clinic.cnpj}
                    </p>
                    <p className={styles.details}>
                      <strong>Tel:</strong> {clinic.phone}
                    </p>
                  </div>
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
                <MdChevronLeft size={24} />
              </button>
              <span className={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
