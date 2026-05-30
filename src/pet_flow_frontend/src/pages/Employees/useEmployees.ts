import { useEffect, useMemo, useState } from 'react';
import { employeeService, type Employee } from '../../services/employee';
import { clinicsService } from '../../services/clinic.services';

const ITEMS_PER_PAGE = 5;

const emptyForm = {
  name: '',
  cpf: '',
  address: '',
  phone: '',
  email: '',
  role: '',
  clinicId: '',
};

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clinics, setClinics] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function init() {
      try {
        const [clinicList, data] = await Promise.all([
          clinicsService.getAll(),
          employeeService.getAll(),
        ]);
        setClinics(clinicList.map((c) => ({ id: c.id, name: c.name })));
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...form };
    try {
      if (editingId) {
        const updated = await employeeService.update(editingId, payload);
        setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? updated : emp)));
      } else {
        const created = await employeeService.create(payload);
        setEmployees((prev) => [...prev, created]);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar funcionário');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Deseja realmente excluir este funcionário?')) return;
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir funcionário');
    }
  }

  function handleOpenNew() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowModal(true);
  }

  function handleOpenEdit(employee: Employee) {
    setForm({
      name: employee.name,
      cpf: employee.cpf,
      address: employee.address,
      phone: employee.phone,
      email: employee.email,
      role: employee.role,
      clinicId: employee.clinicId,
    });
    setEditingId(employee.id);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, clinicId: e.target.value }));
  };

  const roles = useMemo(() => {
    const unique = employees.map((e) => e.role);
    return ['Todos', ...new Set(unique)];
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.cpf.includes(search);
      const matchRole = roleFilter === 'Todos' || emp.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [employees, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    employees,
    clinics,
    loading,
    editingId,
    showModal,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    form,
    roles,
    filtered,
    totalPages,
    paginated,
    handleSubmit,
    handleDelete,
    handleOpenNew,
    handleOpenEdit,
    handleCloseModal,
    handleChange,
    handleSelectChange,
  };
}
