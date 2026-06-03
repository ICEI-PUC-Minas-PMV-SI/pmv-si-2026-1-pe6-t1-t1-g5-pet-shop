import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useSession } from '../../contexts/SessionContext';

import { styles } from './styles';
import {
  employeeService,
  type Employee,
} from './api';

export default function EmployeesScreen() {
  const { session } = useSession();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingEmployeeId, setEditingEmployeeId] =
    useState<string | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
     cpf: '',
    address: '',
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

      Alert.alert(
        'Erro',
        'Não foi possível carregar os funcionários.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert(
      'Excluir funcionário',
      'Deseja realmente excluir este funcionário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await employeeService.delete(id);

              setEmployees((prev) =>
                prev.filter(
                  (employee) => employee.id !== id,
                ),
              );
            } catch (error) {
              console.error(error);

              Alert.alert(
                'Erro',
                'Não foi possível excluir.',
              );
            }
          },
        },
      ],
    );
  }

  async function handleCreate() {
  if (
    !newEmployee.name ||
    !newEmployee.email ||
    !newEmployee.phone ||
    !newEmployee.role ||
    !newEmployee.cpf ||
    !newEmployee.address
  ) {
    Alert.alert(
      'Campos obrigatórios',
      'Preencha todos os campos.',
    );

    return;
  }

  try {
    const created = await employeeService.create({
      ...newEmployee,
      clinicId: session?.clinicId,
    });

    setEmployees((prev) => [created, ...prev]);

    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      cpf: '',
      address: '',
    });

    setEditingEmployeeId(null);
    setShowForm(false);

    Alert.alert(
      'Sucesso',
      'Funcionário criado com sucesso.',
    );
  } catch (error) {
    console.error(error);

    Alert.alert(
      'Erro',
      'Não foi possível criar funcionário.',
    );
  }
}
  async function handleUpdate() {
    if (!editingEmployeeId) return;

    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.phone ||
      !newEmployee.role ||
      !newEmployee.cpf ||
      !newEmployee.address
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos.',
      );

      return;
    }

    try {
      const updated = await employeeService.update(
        editingEmployeeId,
        {
          ...newEmployee,
        },
      );

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingEmployeeId
            ? updated
            : employee,
        ),
      );

      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        role: '',
        cpf: '',
        address: '',
      });

      setEditingEmployeeId(null);
      setShowForm(false);

      Alert.alert(
        'Sucesso',
        'Funcionário atualizado.',
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível atualizar.',
      );
    }
  }

  function handleEdit(employee: Employee) {
  setEditingEmployeeId(employee.id);

  setNewEmployee({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    role: employee.role,
    cpf: employee.cpf,
    address: employee.address,
  });

  setShowForm(true);
}

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) =>
      employee.name
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Funcionários
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar funcionário..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.actionsRow}>
        <Text style={styles.sectionTitle}>
          Lista de funcionários
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingEmployeeId(null);

            setNewEmployee({
              name: '',
              email: '',
              phone: '',
              role: '',
              cpf: '',
              address: '',
});

            setShowForm(!showForm);
          }}
        >
          <Text style={styles.addButtonText}>
            + Novo
          </Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View
          style={{
            backgroundColor: '#FFF',
            marginHorizontal: 20,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            gap: 10,
          }}
        >
          <TextInput
            placeholder="Nome"
            value={newEmployee.name}
            onChangeText={(text) =>
              setNewEmployee((prev) => ({
                ...prev,
                name: text,
              }))
            }
            style={styles.searchInput}
          />

          <TextInput
            placeholder="Email"
            value={newEmployee.email}
            onChangeText={(text) =>
              setNewEmployee((prev) => ({
                ...prev,
                email: text,
              }))
            }
            style={styles.searchInput}
          />

          <TextInput
            placeholder="Telefone"
            value={newEmployee.phone}
            onChangeText={(text) =>
              setNewEmployee((prev) => ({
                ...prev,
                phone: text,
              }))
            }
            style={styles.searchInput}
          />

          <TextInput
            placeholder="CPF"
            value={newEmployee.cpf}
            onChangeText={(text) =>
              setNewEmployee((prev) => ({
                ...prev,
                cpf: text,
              }))
            }
            style={styles.searchInput}
          />

          <TextInput
            placeholder="Cargo"
            value={newEmployee.role}
            onChangeText={(text) =>
              setNewEmployee((prev) => ({
                ...prev,
                role: text,
              }))
            }
            style={styles.searchInput}
          />

          <TextInput
            placeholder="Endereço"
            value={newEmployee.address}
            onChangeText={(text) =>
              setNewEmployee((prev) => ({
                ...prev,
                address: text,
              }))
            }
            style={styles.searchInput}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={
              editingEmployeeId
                ? handleUpdate
                : handleCreate
            }
          >
            <Text style={styles.addButtonText}>
              {editingEmployeeId
                ? 'Atualizar Funcionário'
                : 'Salvar Funcionário'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum funcionário encontrado.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.employeeName}>
                  {item.name}
                </Text>

                <Text style={styles.employeeRole}>
                  {item.role}
                </Text>

                <Text style={styles.employeeInfo}>
                  {item.email}
                </Text>

                <Text style={styles.employeeInfo}>
                  {item.phone}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEdit(item)}
                >
                  <MaterialIcons
                    name="edit"
                    size={18}
                    color="#2563EB"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    handleDelete(item.id)
                  }
                >
                  <MaterialIcons
                    name="delete"
                    size={18}
                    color="#DC2626"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}