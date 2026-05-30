import { useEffect, useState } from 'react';
import { clinicsService } from '../../services/clinic.services';
import type { Clinic } from './components/ClinicModal';

const ITEMS_PER_PAGE = 6;

export function useClinica() {
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

  useEffect(() => {
    fetchClinics();
  }, []);

  const totalPages = Math.ceil(clinics.length / ITEMS_PER_PAGE);
  const paginated = clinics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenNew = () => {
    setEditingClinic(null);
    setShowModal(true);
  };

  const handleOpenEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClinic(null);
  };

  const handleSave = async (payload: Omit<Clinic, 'id'>) => {
    if (editingClinic) {
      await clinicsService.update(editingClinic.id, payload);
    } else {
      await clinicsService.create(payload);
    }
    setShowModal(false);
    fetchClinics();
  };

  return {
    clinics,
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
  };
}
