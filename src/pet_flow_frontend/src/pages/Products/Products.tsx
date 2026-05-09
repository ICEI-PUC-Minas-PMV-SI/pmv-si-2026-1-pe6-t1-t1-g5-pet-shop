import { useEffect, useState } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { productsService, type Product, type ProductPayload } from '../../services/products.service';
import styles from './Products.module.css';

const LOW_STOCK_THRESHOLD = 5;

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSave = async (payload: ProductPayload) => {
    try {
      if (editingProduct) {
        await productsService.update(editingProduct.id, payload);
      } else {
        await productsService.create(payload);
      }
      handleModalClose();
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar produto');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await productsService.delete(deletingProduct.id);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir produto');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Produtos</h1>
        <button className={styles.newBtn} onClick={handleNew}>
          <MdAdd size={16} />
          Novo produto
        </button>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total de produtos</span>
          <span className={styles.cardValue}>{products.length}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Itens em estoque</span>
          <span className={styles.cardValue}>{totalStock}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Estoque baixo</span>
          <span className={lowStockCount > 0 ? styles.cardValueWarning : styles.cardValue}>
            {lowStockCount}
          </span>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Lista de produtos</h2>

        {loading && <p className={styles.loadingText}>Carregando...</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      Nenhum produto cadastrado
                    </td>
                  </tr>
                )}
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <span className={styles.tagCategory}>{p.category}</span>
                    </td>
                    <td>{p.description}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td className={p.stock <= LOW_STOCK_THRESHOLD ? styles.stockLow : undefined}>
                      {p.stock}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(p)}
                          aria-label="Editar"
                        >
                          <MdEdit size={14} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => setDeletingProduct(p)}
                          aria-label="Excluir"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          productName={deletingProduct.name}
          onCancel={() => setDeletingProduct(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

/* ===== PRODUCT MODAL ===== */
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (payload: ProductPayload) => void;
}

function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock) : '',
    category: product?.category || '',
  });

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    if (!form.name || !form.category || isNaN(price) || isNaN(stock)) return;

    onSave({
      name: form.name,
      description: form.description,
      price,
      stock,
      category: form.category,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {product ? 'Editar produto' : 'Novo produto'}
        </h2>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Ex: Ração Premium"
              required
            />
          </div>

          <div className={styles.formField}>
            <label>Categoria</label>
            <input
              type="text"
              value={form.category}
              onChange={handleChange('category')}
              placeholder="Ex: Alimentação, Higiene, Acessórios"
              required
            />
          </div>

          <div className={styles.formField}>
            <label>Descrição</label>
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Descreva o produto"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange('price')}
                placeholder="0.00"
                required
              />
            </div>
            <div className={styles.formField}>
              <label>Estoque</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange('stock')}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== DELETE CONFIRM MODAL ===== */
interface DeleteConfirmModalProps {
  productName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ productName, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Confirmar exclusão</h2>
        <p className={styles.confirmText}>
          Tem certeza que deseja excluir o produto <strong>{productName}</strong>? Essa ação não pode ser desfeita.
        </p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.deleteBtnConfirm} onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
