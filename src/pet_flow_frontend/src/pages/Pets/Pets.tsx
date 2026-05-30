import { MdSearch, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { usePets } from './usePets';
import { getTutorName } from './utils';
import PetModal from './components/PetModal';
import styles from './Pets.module.css';

export default function Pets() {
  const {
    loading,
    error,
    search,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedPets,
    showModal,
    editingPet,
    handleSearch,
    handleOpenNew,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
  } = usePets();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pets</h1>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <MdSearch size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por pet ou espécie..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <button className={styles.newBtn} onClick={handleOpenNew}>
          + Novo Pet
        </button>
      </div>

      {loading && <p className={styles.loadingText}>Carregando...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {paginatedPets.length === 0 && (
              <p className={styles.emptyText}>Nenhum pet encontrado.</p>
            )}

            {paginatedPets.map((pet) => (
              <div
                key={pet.id}
                className={styles.card}
                onClick={() => handleOpenEdit(pet)}
              >
                <div className={styles.cardPhoto}>
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} className={styles.photo} />
                  ) : (
                    <div className={styles.photoPlaceholder}>🐾</div>
                  )}
                </div>

                <div className={styles.cardInfo}>
                  <h3 className={styles.petName}>{pet.name}</h3>
                  <p className={styles.petBreed}>
                    {pet.species}
                    {pet.breed ? ` • ${pet.breed}` : ''}
                  </p>
                  <p className={styles.petTutor}>
                    <span className={styles.infoLabel}>Tutor</span>:{' '}
                    {getTutorName(pet.id)}
                  </p>
                  <p className={styles.petAge}>
                    <span className={styles.infoLabel}>Idade</span>:{' '}
                    {pet.age != null
                      ? `${pet.age} ano${pet.age !== 1 ? 's' : ''}`
                      : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <MdChevronLeft size={18} />
            </button>
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
            >
              <MdChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {showModal && (
        <PetModal
          pet={editingPet}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
