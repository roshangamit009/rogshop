import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  productName: string;
  price: number;
  quantity: number;
  isEditing?: boolean;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.map((p: Product) => ({ ...p, isEditing: false })));
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleEdit = (productName: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productName === productName ? { ...p, isEditing: !p.isEditing } : p
      )
    );
  };

  const handleChange = (productName: string, field: keyof Product, value: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productName === productName
          ? { ...p, [field]: field === 'price' || field === 'quantity' ? Number(value) : value }
          : p
      )
    );
  };

  const handleSave = async (product: Product) => {
    try {
      await axios.put('http://localhost:5000/api/products', {
        productName: product.productName,
        newProductName: product.productName,
        price: product.price,
        quantity: product.quantity,
      });
      toggleEdit(product.productName);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (productName: string) => {
    try {
      await axios.delete('http://localhost:5000/api/products', {
        data: { productName },
      });
      setProducts(products.filter((p) => p.productName !== productName));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Products</h2>

      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.productName}>
              <td style={styles.td}>
                {product.isEditing ? (
                  <input
                    value={product.productName}
                    onChange={(e) => handleChange(product.productName, 'productName', e.target.value)}
                  />
                ) : (
                  product.productName
                )}
              </td>
              <td style={styles.td}>
                {product.isEditing ? (
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleChange(product.productName, 'price', e.target.value)}
                  />
                ) : (
                  product.price
                )}
              </td>
              <td style={styles.td}>
                {product.isEditing ? (
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleChange(product.productName, 'quantity', e.target.value)}
                  />
                ) : (
                  product.quantity
                )}
              </td>
              <td style={styles.td}>
                {product.isEditing ? (
                  <button
                    style={styles.saveButton}
                    onClick={() => handleSave(product)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    style={styles.editButton}
                    onClick={() => toggleEdit(product.productName)}
                  >
                    Edit
                  </button>
                )}
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(product.productName)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    color: '#007bff',
    marginBottom: '1rem',
  },
  searchInput: {
    padding: '0.5rem',
    marginBottom: '1rem',
    width: '100%',
    maxWidth: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
  },
  editButton: {
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ManageProducts;
