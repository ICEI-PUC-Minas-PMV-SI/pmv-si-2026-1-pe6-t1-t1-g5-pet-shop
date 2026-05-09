import { useEffect, useState } from 'react';
import { MdSearch, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { petsService, type Pet } from '../../services/pets.service';
import PetModal, { type CreatePetPayload } from './PetModal';
import styles from './Pets.module.css';

const ITEMS_PER_PAGE = 6;

function getTutorName(petId: string): string {
  return localStorage.getItem(`tutor_pet_${petId}`) || '—';
}

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const fetchPets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await petsService.getAll();
      setPets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.species?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPets.length / ITEMS_PER_PAGE));
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSave = async (payload: CreatePetPayload) => {
    try {
      if (editingPet) {
        await petsService.update(editingPet.id, payload);
        localStorage.setItem(`tutor_pet_${editingPet.id}`, payload.tutor_name);
      } else {
        const created = await petsService.create(payload);
        if (created?.id) {
          localStorage.setItem(`tutor_pet_${created.id}`, payload.tutor_name);
          localStorage.removeItem('tutor_pet_new');
        }
      }
      setShowModal(false);
      setEditingPet(null);
      fetchPets();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

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
        <button
          className={styles.newBtn}
          onClick={() => { setEditingPet(null); setShowModal(true); }}
        >
          + Novo Pet
        </button>
      </div>

      {loading && <p className={styles.loadingText}>Carregando...</p>}
      {error   && <p className={styles.errorText}>{error}</p>}

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
                onClick={() => { setEditingPet(pet); setShowModal(true); }}
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
                    {pet.species}{pet.breed ? ` • ${pet.breed}` : ''}
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
          onClose={() => { setShowModal(false); setEditingPet(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
