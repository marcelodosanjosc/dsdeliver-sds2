import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  fetchproducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  ProductPayload
} from '../api';
import { Product } from '../Orders/types';
import './styles.css';

function AdminPortal() {
  const [tab, setTab] = useState<'products' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form states for Product
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUri, setProdImageUri] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState<number | ''>('');

  // Form states for Category
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catName, setCatName] = useState('');

  const loadData = () => {
    fetchproducts()
      .then(res => setProducts(res.data))
      .catch(() => toast.error('Erro ao buscar produtos'));

    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Erro ao buscar categorias'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductPayload = {
      name: prodName,
      price: parseFloat(prodPrice),
      description: prodDescription,
      imageUri: prodImageUri,
      category: prodCategoryId ? { id: Number(prodCategoryId) } : undefined
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload)
        .then(() => {
          toast.success('Produto atualizado com sucesso!');
          resetProductForm();
          loadData();
        })
        .catch(() => toast.error('Erro ao atualizar produto'));
    } else {
      createProduct(payload)
        .then(() => {
          toast.success('Produto criado com sucesso!');
          resetProductForm();
          loadData();
        })
        .catch(() => toast.error('Erro ao criar produto'));
    }
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdPrice(p.price.toString());
    setProdDescription(p.description);
    setProdImageUri(p.imageUri);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id)
        .then(() => {
          toast.success('Produto removido');
          loadData();
        })
        .catch(() => toast.error('Erro ao remover produto'));
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice('');
    setProdDescription('');
    setProdImageUri('');
    setProdCategoryId('');
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId) {
      updateCategory(editingCatId, catName)
        .then(() => {
          toast.success('Categoria atualizada!');
          resetCategoryForm();
          loadData();
        })
        .catch(() => toast.error('Erro ao atualizar categoria'));
    } else {
      createCategory(catName)
        .then(() => {
          toast.success('Categoria criada!');
          resetCategoryForm();
          loadData();
        })
        .catch(() => toast.error('Erro ao criar categoria'));
    }
  };

  const handleEditCategory = (c: Category) => {
    setEditingCatId(c.id);
    setCatName(c.name);
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(id)
        .then(() => {
          toast.success('Categoria removida');
          loadData();
        })
        .catch(() => toast.error('Erro ao remover categoria'));
    }
  };

  const resetCategoryForm = () => {
    setEditingCatId(null);
    setCatName('');
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Painel do Funcionário / Admin</h1>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${tab === 'products' ? 'active' : ''}`}
            onClick={() => setTab('products')}
          >
            Gerenciar Produtos
          </button>
          <button
            className={`admin-tab-btn ${tab === 'categories' ? 'active' : ''}`}
            onClick={() => setTab('categories')}
          >
            Gerenciar Categorias
          </button>
        </div>

        {tab === 'products' ? (
          <>
            <div className="admin-card">
              <h3>{editingProductId ? 'Editar Produto' : 'Novo Produto'}</h3>
              <form onSubmit={handleProductSubmit}>
                <div className="admin-form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="admin-input"
                    value={prodPrice}
                    onChange={e => setProdPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Categoria</label>
                  <select
                    className="admin-select"
                    value={prodCategoryId}
                    onChange={e => setProdCategoryId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">Selecione uma Categoria...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>URI da Imagem</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={prodImageUri}
                    onChange={e => setProdImageUri(e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descrição</label>
                  <textarea
                    className="admin-textarea"
                    value={prodDescription}
                    onChange={e => setProdDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-actions">
                  {editingProductId && (
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={resetProductForm}>
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="admin-btn admin-btn-primary">
                    {editingProductId ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h3>Lista de Produtos</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>R$ {p.price.toFixed(2)}</td>
                      <td>
                        <button className="admin-btn admin-btn-secondary" style={{ marginRight: 8 }} onClick={() => handleEditProduct(p)}>
                          Editar
                        </button>
                        <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteProduct(p.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="admin-card">
              <h3>{editingCatId ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <form onSubmit={handleCategorySubmit}>
                <div className="admin-form-group">
                  <label>Nome da Categoria</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-actions">
                  {editingCatId && (
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={resetCategoryForm}>
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="admin-btn admin-btn-primary">
                    {editingCatId ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h3>Lista de Categorias</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>
                        <button className="admin-btn admin-btn-secondary" style={{ marginRight: 8 }} onClick={() => handleEditCategory(c)}>
                          Editar
                        </button>
                        <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteCategory(c.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPortal;
