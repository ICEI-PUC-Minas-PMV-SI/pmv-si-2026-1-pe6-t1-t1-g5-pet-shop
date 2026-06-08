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

import { styles } from './styles';
import ProductModal, { type ProductFormPayload } from './components/ProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { productService, type Product } from './api';

const LOW_STOCK_THRESHOLD = 5;

function parsePrice(value: string): number {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
}

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    setProductToDeleteId(id);
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    if (!productToDeleteId) return;

    setDeleting(true);

    try {
      await productService.delete(productToDeleteId);

      setProducts((prev) => prev.filter((p) => p.id !== productToDeleteId));

      setDeleteModalVisible(false);
      setProductToDeleteId(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível excluir.');
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingProductId(product.id);
    setShowForm(true);
  }

  async function handleSaveFromModal(payload: ProductFormPayload) {
    setSaving(true);

    const data = {
      name: payload.name,
      category: payload.category,
      description: payload.description,
      price: parsePrice(payload.price),
      stock: parseInt(payload.stock, 10),
    };

    try {
      if (editingProductId) {
        const updated = await productService.update(editingProductId, data);
        setProducts((prev) => prev.map((p) => (p.id === editingProductId ? updated : p)));

        setEditingProductId(null);
        setShowForm(false);

        Alert.alert('Sucesso', 'Produto atualizado.');
      } else {
        const created = await productService.create(data);
        setProducts((prev) => [created, ...prev]);

        setShowForm(false);

        Alert.alert('Sucesso', 'Produto criado com sucesso.');
      }
    } catch (error) {
      console.error(error);
      // Propagate error to modal so it can show messages
      throw error;
    } finally {
      setSaving(false);
    }
  }

  const editingProduct = products.find((p) => p.id === editingProductId) ?? null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por produto..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingProductId(null);
          setShowForm(true);
        }}
      >
        <MaterialIcons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Novo Produto</Text>
      </TouchableOpacity>

      <ProductModal
        visible={showForm}
        product={editingProduct}
        onClose={() => {
          setShowForm(false);
          setEditingProductId(null);
        }}
        onSave={handleSaveFromModal}
        saving={saving}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        title="Excluir produto"
        message="Deseja realmente excluir este produto?"
        loading={deleting}
        onClose={() => {
          setDeleteModalVisible(false);
          setProductToDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        scrollEnabled={true}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
        }
        renderItem={({ item }) => {
          const isLowStock = item.stock <= LOW_STOCK_THRESHOLD;

          return (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.productName}>{item.name}</Text>
                  {item.category ? (
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{item.category}</Text>
                    </View>
                  ) : null}
                </View>

                {item.description ? (
                  <Text style={styles.productDescription}>{item.description}</Text>
                ) : null}

                <View style={styles.productMetadata}>
                  <View style={styles.priceAndStock}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                    </View>

                    <View style={styles.stockContainer}>
                      <MaterialIcons
                        name="inventory-2"
                        size={16}
                        color={isLowStock ? '#DE6767' : '#6B7280'}
                      />
                      <Text style={[styles.stock, isLowStock && styles.stockLow]}>
                        {item.stock} un.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => handleEdit(item)}
                    >
                      <MaterialIcons name="edit" size={18} color="#2563EB" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(item.id)}
                    >
                      <MaterialIcons name="delete" size={18} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
