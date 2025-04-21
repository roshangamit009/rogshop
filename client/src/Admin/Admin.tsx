import { useState } from 'react';
import AddShopkeeper from './AddShopkeeper'; // Import the AddShopkeeper component
import AdminDashboard from './AdminDashboard'; // Import the AdminDashboard component

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Manage active tab state

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />; // Render AdminDashboard
      case 'add-shopkeeper':
        return <AddShopkeeper />; // Render AddShopkeeper
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Navigation Bar */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Panel</h1>
      </header>

      <div style={styles.main}>
        {/* Left Sidebar */}
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
            onClick={() => setActiveTab('add-shopkeeper')}
            style={{
              ...styles.sidebarButton,
              backgroundColor: activeTab === 'add-shopkeeper' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'add-shopkeeper' ? '#fff' : '#000',
            }}
          >
            Add Shopkeeper
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
    textAlign: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
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

export default Admin;