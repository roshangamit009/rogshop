import { useState, useEffect } from 'react';
import axios from 'axios';

const ShopkeeperAddProduct = () => {
  const [formData, setFormData] = useState({
    productImage: null, // File object for the image
    productName: '',
    price: '',
    quantity: '',
    category: '', // Selected category
  });
  const [categories, setCategories] = useState([]); // Categories for the shop
  const [newCategory, setNewCategory] = useState(''); // New category input
  const [isOtherCategory, setIsOtherCategory] = useState(false); // Track if "Other" is selected
  const [message, setMessage] = useState('');
  const [categoryMessage, setCategoryMessage] = useState(''); // Message for category addition

  // Get shopkeeper details from localStorage
  const shopName = localStorage.getItem('shopkeeperName') || 'Unknown Shop';
  const shopkeeperId = localStorage.getItem('shopkeeperId'); // Assuming shopkeeperId is stored in localStorage during login

  useEffect(() => {
    // Fetch existing categories for the shop
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products-categories?shopkeeperId=${shopkeeperId}&shopName=${shopName}`
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [shopkeeperId, shopName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, productImage: e.target.files[0] });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'Other') {
      setIsOtherCategory(true);
      setFormData({ ...formData, category: '' }); // Clear the category field
    } else {
      setIsOtherCategory(false);
      setFormData({ ...formData, category: selectedCategory });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('shopkeeperId', shopkeeperId || ''); // Include shopkeeperId
    formDataToSend.append('shopName', shopName);
    formDataToSend.append('productImage', formData.productImage as Blob);
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('category', formData.category); // Include category

    try {
      const response = await axios.post('http://localhost:5000/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message); // Display success message
      setFormData({ productImage: null, productName: '', price: '', quantity: '', category: '' }); // Reset form
      setIsOtherCategory(false); // Reset "Other" category state
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryMessage('Category cannot be empty');
      return;
    }

    try {
      const payload = {
        shopkeeperId,
        shopName,
        categories: [newCategory.trim()],
      };

      const response = await axios.post('http://localhost:5000/api/products-categories', payload);
      setCategories(response.data.shopCategories.categories); // Update categories
      setCategoryMessage('Category added successfully');
      setNewCategory(''); // Clear the input
    } catch (error: any) {
      console.error('Error adding category:', error.response?.data || error.message);
      setCategoryMessage(error.response?.data?.message || 'An error occurred while adding category');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="productImage"
          accept="image/*"
          onChange={handleFileChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          required
          style={styles.input}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {isOtherCategory && (
          <input
            type="text"
            name="category"
            placeholder="Enter New Category"
            value={formData.category}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        )}
        <button type="submit" style={styles.button}>
          Add Product
        </button>
      </form>

      <h3 style={styles.subHeading}>Add New Category</h3>
      <input
        type="text"
        placeholder="New Category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        style={styles.input}
      />
      <button type="button" onClick={handleAddCategory} style={styles.addCategoryButton}>
        Add Category
      </button>

      {message && <p style={{ ...styles.message, color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      {categoryMessage && (
        <p style={{ ...styles.message, color: categoryMessage.includes('success') ? 'green' : 'red' }}>
          {categoryMessage}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  subHeading: {
    marginTop: '2rem',
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  addCategoryButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  message: {
    textAlign: 'center',
    marginTop: '1rem',
  },
};

export default ShopkeeperAddProduct;