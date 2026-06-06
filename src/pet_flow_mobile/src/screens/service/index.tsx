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
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../../contexts/SessionContext';

import { styles } from './styles';
import ServiceModal from './components/ServiceModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import {
  serviceService,
  type Service,
} from './api';

export default function ServiceScreen() {
  const navigation = useNavigation();
  const { session } = useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingServiceId, setEditingServiceId] =
    useState<string | null>(null);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível carregar os serviços.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    setServiceToDeleteId(id);
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    if (!serviceToDeleteId) return;

    setDeleting(true);

    try {
      await serviceService.delete(serviceToDeleteId);

      setServices((prev) => prev.filter((s) => s.id !== serviceToDeleteId));

      setDeleteModalVisible(false);
      setServiceToDeleteId(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível excluir.');
    } finally {
      setDeleting(false);
    }
  }

  async function handleCreate() {
    if (
      !newService.name ||
      !newService.description ||
      !newService.price ||
      !newService.duration
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos.',
      );

      return;
    }

    try {
      const created = await serviceService.create({
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration, 10),
        clinicId: session?.clinicId,
      });

      setServices((prev) => [created, ...prev]);

      setNewService({
        name: '',
        description: '',
        price: '',
        duration: '',
      });

      setEditingServiceId(null);
      setShowForm(false);

      Alert.alert(
        'Sucesso',
        'Serviço criado com sucesso.',
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível criar serviço.',
      );
    }
  }

  async function handleUpdate() {
    if (!editingServiceId) return;

    if (
      !newService.name ||
      !newService.description ||
      !newService.price ||
      !newService.duration
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos.',
      );

      return;
    }

    try {
      const updated = await serviceService.update(
        editingServiceId,
        {
          ...newService,
          price: parseFloat(newService.price),
          duration: parseInt(newService.duration, 10),
        },
      );

      setServices((prev) =>
        prev.map((service) =>
          service.id === editingServiceId
            ? updated
            : service,
        ),
      );

      setNewService({
        name: '',
        description: '',
        price: '',
        duration: '',
      });

      setEditingServiceId(null);
      setShowForm(false);

      Alert.alert(
        'Sucesso',
        'Serviço atualizado.',
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível atualizar.',
      );
    }
  }

  function handleEdit(service: Service) {
    setEditingServiceId(service.id);

    setNewService({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });

    setShowForm(true);
  }

  const editingService = services.find((s) => s.id === editingServiceId) ?? null;

  async function handleSaveFromModal(payload: { name: string; description: string; price: string; duration: string }) {
    setSaving(true);

    if (editingServiceId) {
      try {
        const updated = await serviceService.update(editingServiceId, {
          ...payload,
          price: parseFloat(payload.price.replace(/\./g, '').replace(',', '.')),
          duration: parseInt(payload.duration, 10),
        });

        setServices((prev) => prev.map((s) => (s.id === editingServiceId ? updated : s)));

        setNewService({ name: '', description: '', price: '', duration: '' });
        setEditingServiceId(null);
        setShowForm(false);

        Alert.alert('Sucesso', 'Serviço atualizado.');
      } catch (error) {
        console.error(error);
        // Propagate error to modal so it can show messages
        throw error;
      } finally {
        setSaving(false);
      }

      return;
    }

    // create
    try {
      const created = await serviceService.create({
        ...payload,
        price: parseFloat(payload.price.replace(/\./g, '').replace(',', '.')),
        duration: parseInt(payload.duration, 10),
        clinicId: session?.clinicId,
      });

      setServices((prev) => [created, ...prev]);

      setNewService({ name: '', description: '', price: '', duration: '' });
      setShowForm(false);

      Alert.alert('Sucesso', 'Serviço criado com sucesso.');
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [services, search]);

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
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por serviço..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingServiceId(null);

          setNewService({
            name: '',
            description: '',
            price: '',
            duration: '',
          });

          setShowForm(true);
        }}
      >
        <MaterialIcons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Novo Serviço</Text>
      </TouchableOpacity>
      
      <ServiceModal
        visible={showForm}
        service={editingService}
        onClose={() => {
          setShowForm(false);
          setEditingServiceId(null);
        }}
        onSave={handleSaveFromModal}
        saving={saving}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        title="Excluir serviço"
        message="Deseja realmente excluir este serviço?"
        loading={deleting}
        onClose={() => {
          setDeleteModalVisible(false);
          setServiceToDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        scrollEnabled={true}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum serviço encontrado.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>
                {item.description}
              </Text>

              <View style={styles.serviceMetadata}>
                <View style={styles.priceAndDuration}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      R$ {item.price.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.durationContainer}>
                    <MaterialIcons
                      name="schedule"
                      size={16}
                      color="#6B7280"
                    />
                    <Text style={styles.duration}>
                      {item.duration} min
                    </Text>
                  </View>
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
                    onPress={() => handleDelete(item.id)}
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
          </View>
        )}
      />
    </View>
  );
}
