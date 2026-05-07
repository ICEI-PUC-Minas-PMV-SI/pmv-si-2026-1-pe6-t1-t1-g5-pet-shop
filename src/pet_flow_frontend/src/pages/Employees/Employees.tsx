import { useEffect, useMemo, useState } from 'react';
import { employeeService, type Employee } from '../../services/employee';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    address: '',
    phone: '',
    email: '',
    role: '',
    clinicId: '07ac3797-114f-4de9-b8f0-db8b2ca32cfc',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEmployee(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      const newEmployee = await employeeService.create(form);

      setEmployees((prev) => [...prev, newEmployee]);

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar funcionário');
    }
  }

  async function handleUpdateEmployee(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!editingId) return;

    try {
      const updatedEmployee = await employeeService.update(
        editingId,
        form,
      );

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingId
            ? updatedEmployee
            : employee,
        ),
      );

      setEditingId(null);

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar funcionário');
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Deseja realmente excluir este funcionário?',
    );

    if (!confirmed) return;

    try {
      await employeeService.delete(id);

      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== id),
      );
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir funcionário');
    }
  }

  function resetForm() {
    setForm({
      name: '',
      cpf: '',
      address: '',
      phone: '',
      email: '',
      role: '',
      clinicId: '07ac3797-114f-4de9-b8f0-db8b2ca32cfc',
    });
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        employee.cpf.includes(search);

      const matchesRole =
        roleFilter === 'Todos'
          ? true
          : employee.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const roles = useMemo(() => {
    const uniqueRoles = employees.map(
      (employee) => employee.role,
    );

    return ['Todos', ...new Set(uniqueRoles)];
  }, [employees]);

  const totalPages = Math.ceil(
    filteredEmployees.length / ITEMS_PER_PAGE,
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          fontSize: 18,
          color: '#666',
        }}
      >
        Carregando funcionários...
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#141313',
          }}
        >
          Funcionários
        </h1>

        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
          style={{
            background: '#4B91F1',
            color: '#fff',
            border: 'none',
            padding: '12px 18px',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            boxShadow: '0 4px 10px rgba(75,145,241,0.25)',
          }}
        >
          + Novo Funcionário
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: 320,
            padding: 12,
            borderRadius: 10,
            border: '1px solid #ddd',
            background: '#fff',
            outline: 'none',
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid #ddd',
            background: '#fff',
          }}
        >
          {roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead
            style={{
              background: '#f5f5f5',
            }}
          >
            <tr>
              <th
                align="left"
                style={{ padding: 18 }}
              >
                Nome
              </th>

              <th align="left">CPF</th>

              <th align="left">E-mail</th>

              <th align="left">Cargo</th>

              <th align="left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.map((employee) => (
              <tr
                key={employee.id}
                style={{
                  borderBottom: '1px solid #eee',
                }}
              >
                <td style={{ padding: 18 }}>
                  {employee.name}
                </td>

                <td>{employee.cpf}</td>

                <td>{employee.email}</td>

                <td>{employee.role}</td>

                <td>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditingId(employee.id);

                        setForm({
                          name: employee.name,
                          cpf: employee.cpf,
                          address: employee.address,
                          phone: employee.phone,
                          email: employee.email,
                          role: employee.role,
                          clinicId: employee.clinicId,
                        });

                        setShowModal(true);
                      }}
                      style={{
                        background: '#f5f5f5',
                        border: 'none',
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(employee.id)
                      }
                      style={{
                        background: '#fff1f0',
                        border: 'none',
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: 20,
          }}
        >
          {Array.from({ length: totalPages }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border:
                    currentPage === index + 1
                      ? '2px solid #4B91F1'
                      : '1px solid #ddd',
                  background:
                    currentPage === index + 1
                      ? '#eef5ff'
                      : '#fff',
                  color:
                    currentPage === index + 1
                      ? '#4B91F1'
                      : '#555',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </button>
            ),
          )}

          {currentPage < totalPages && (
            <button
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              →
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 16,
              width: 500,
            }}
          >
            <h2
              style={{
                marginBottom: 20,
                fontSize: 22,
              }}
            >
              {editingId
                ? 'Editar Funcionário'
                : 'Novo Funcionário'}
            </h2>

            <form
              onSubmit={async (e) => {
                if (editingId) {
                  await handleUpdateEmployee(e);
                } else {
                  await handleCreateEmployee(e);
                }

                setShowModal(false);
              }}
              style={{
                display: 'grid',
                gap: 12,
              }}
            >
              <input
                placeholder="Nome"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="CPF"
                value={form.cpf}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cpf: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Telefone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Cargo"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Endereço"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#4B91F1',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {editingId
                    ? 'Salvar'
                    : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: '1px solid #ddd',
  outline: 'none',
  fontSize: 14,
};