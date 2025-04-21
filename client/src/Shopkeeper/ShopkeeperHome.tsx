import { useState, useEffect } from 'react';
import ShopkeeperAddProduct from './ShopkeeperAddProduct'; // Import the Add Product form component
import ShopkeeperDashboard from './ShopkeeperDashboard'; // Import the Dashboard component
import ShopkeeperOrder from './ShopkeeperOrder'; // Import the ShopkeeperOrder component
import ManageProducts from './ManageProducts'; // Import the ManageProducts component

const ShopkeeperHome = () => {
  const [shopkeeperName, setShopkeeperName] = useState('Shopkeeper'); // Default name
  const [shopkeeperEmail, setShopkeeperEmail] = useState(''); // State to store shopkeeper email

  // Fetch shopkeeper name and email from localStorage
  useEffect(() => {
    const name = localStorage.getItem('shopkeeperName');
    const email = localStorage.getItem('shopkeeperEmail');
    if (name) {
      setShopkeeperName(name);
    }
    if (email) {
      setShopkeeperEmail(email);
    }
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard'); // Manage active tab state

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ShopkeeperDashboard />; // Render the Dashboard to display products
      case 'add-product':
        return <ShopkeeperAddProduct />; // Render the Add Product form
      case 'orders':
        return <ShopkeeperOrder />; // Render the ShopkeeperOrder component
      case 'manage-products':
        return <ManageProducts />; // Render the ManageProducts component
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{shopkeeperName}'s Dashboard</h1>
        <span style={styles.email}>{shopkeeperEmail}</span>
      </header>

      <div style={styles.main}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              ...styles.sidebarButton,
              backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'dashboard' ? '#fff' : '#000',
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            style={{
              ...styles.sidebarButton,
              backgroundColor: activeTab === 'add-product' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'add-product' ? '#fff' : '#000',
            }}
          >
            Add Product
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              ...styles.sidebarButton,
              backgroundColor: activeTab === 'orders' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'orders' ? '#fff' : '#000',
            }}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('manage-products')}
            style={{
              ...styles.sidebarButton,
              backgroundColor: activeTab === 'manage-products' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'manage-products' ? '#fff' : '#000',
            }}
          >
            Manage Products
          </button>
        </aside>

        {/* Main Content */}
        <main style={styles.content}>{renderContent()}</main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
  },
  email: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  main: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRight: '1px solid #ddd',
  },
  sidebarButton: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    textAlign: 'left',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  content: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#fff',
  },
};

export default ShopkeeperHome;