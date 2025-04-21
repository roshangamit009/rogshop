import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [showUserMenu, setShowUserMenu] = useState(false); // Toggle for user menu
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail') || 'User Email'; // Get email from localStorage

  // Fetch shopkeepers from the backend
  useEffect(() => {
    const fetchShopkeepers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shopkeepers');
        setShopkeepers(response.data);
      } catch (error) {
        console.error('Error fetching shopkeepers:', error);
      }
    };

    fetchShopkeepers();
  }, []);

  // Filter shopkeepers based on the search term
  const filteredShopkeepers = shopkeepers.filter((shopkeeper) =>
    shopkeeper.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle navigation for user menu
  const handleMenuClick = (option) => {
    setShowUserMenu(false); // Close the menu
    if (option === 'profile') {
      navigate('/profile');
    } else if (option === 'cart') {
      navigate('/cart'); // Navigate to the Cart page
    } else if (option === 'orders') {
      navigate('/orders');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all user data from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      {/* Header with Search Bar */}
      <header style={styles.header}>
        <h1 style={styles.heading}>Shopkeepers</h1>
        <input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />
        <div style={styles.userSection}>
          <div
            style={styles.username}
            onClick={() => setShowUserMenu(!showUserMenu)} // Toggle user menu
          >
            {userEmail} ▼
          </div>
          {showUserMenu && (
            <div style={styles.userMenu}>
              <div style={styles.menuItem} onClick={() => handleMenuClick('profile')}>
                My Profile
              </div>
              <div style={styles.menuItem} onClick={() => handleMenuClick('cart')}>
                My Cart
              </div>
              <div style={styles.menuItem} onClick={() => handleMenuClick('orders')}>
                My Orders
              </div>
              <div style={styles.menuItem} onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Shopkeeper List */}
      <div style={styles.shopkeeperList}>
        {filteredShopkeepers.map((shopkeeper) => (
          <div key={shopkeeper._id} style={styles.shopkeeperBox}>
            <h3 style={styles.shopkeeperName}>{shopkeeper.shopName}</h3>
            <p style={styles.shopkeeperDetail}>
              <strong>Email:</strong> {shopkeeper.email}
            </p>
            <p style={styles.shopkeeperDetail}>
              <strong>Address:</strong> {shopkeeper.address}
            </p>
            <button
              style={styles.viewButton}
              onClick={() =>
                navigate(`/shop/${shopkeeper._id}`, { state: { shopName: shopkeeper.shopName } })
              } // Pass shopName in state
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    position: 'relative',
  },
  heading: {
    fontSize: '2rem',
    color: '#007bff',
  },
  searchBar: {
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '50%',
  },
  userSection: {
    position: 'relative',
    cursor: 'pointer',
  },
  username: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  userMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  menuItem: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    color: '#007bff',
    textAlign: 'left',
  },
  shopkeeperList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  shopkeeperBox: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  shopkeeperName: {
    fontSize: '1.2rem',
    color: '#007bff',
    marginBottom: '0.5rem',
  },
  shopkeeperDetail: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '0.5rem',
  },
  viewButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Home;