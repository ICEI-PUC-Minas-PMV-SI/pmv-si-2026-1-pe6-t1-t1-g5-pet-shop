import { useEffect, useState } from 'react';
import { petsService, type Pet } from '../../services/pets.service';
import type { CreatePetPayload } from './components/PetModal';

const ITEMS_PER_PAGE = 6;

export function usePets() {
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

  const filteredPets = pets.filter(
    (p) =>
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

  const handleOpenNew = () => {
    setEditingPet(null);
    setShowModal(true);
  };

  const handleOpenEdit = (pet: Pet) => {
    setEditingPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPet(null);
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

  return {
    pets,
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
  };
}
