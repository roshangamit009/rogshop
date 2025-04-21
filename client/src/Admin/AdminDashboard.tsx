import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]); // State to store all orders
  const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders
  const [searchTerm, setSearchTerm] = useState(''); // State for the shop name search term
  const [statusFilter, setStatusFilter] = useState(''); // State for the status filter
  const [message, setMessage] = useState(''); // State for success/error messages

  // Fetch all orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/orders'); // Backend endpoint for fetching all orders
        setOrders(response.data);
        setFilteredOrders(response.data); // Initialize filtered orders
      } catch (error) {
        console.error('Error fetching orders:', error);
        setMessage('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterOrders(value, statusFilter);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterOrders(searchTerm, value);
  };

  // Filter orders based on shop name and status
  const filterOrders = (shopName, status) => {
    const filtered = orders.filter((order) => {
      const matchesShopName = order.shopName.toLowerCase().includes(shopName.toLowerCase());
      const matchesStatus = status ? order.received === status : true;
      return matchesShopName && matchesStatus;
    });
    setFilteredOrders(filtered);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard - All Orders</h2>
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by Shop Name"
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchBar}
        />
        <select value={statusFilter} onChange={handleStatusChange} style={styles.dropdown}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
        </select>
      </div>
      {message && <p style={styles.message}>{message}</p>}
      {filteredOrders.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Shop Name</th>
              <th style={styles.th}>Customer Email</th>
              <th style={styles.th}>Mobile Number</th> {/* Add Mobile Number Column */}
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Total Quantity</th>
              <th style={styles.th}>Total Price</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td style={styles.td}>{order._id}</td>
                <td style={styles.td}>{order.shopName}</td>
                <td style={styles.td}>{order.email}</td>
                <td style={styles.td}>{order.mobileNo}</td> {/* Display Mobile Number */}
                <td style={styles.td}>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.productName} (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td style={styles.td}>
                  {order.products.reduce((total, product) => total + product.quantity, 0)}
                </td>
                <td style={styles.td}>
                  $
                  {order.products
                    .reduce((total, product) => total + product.price * product.quantity, 0)
                    .toFixed(2)}
                </td>
                <td style={styles.td}>{order.address}</td>
                <td style={styles.td}>{order.received || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.emptyMessage}>No orders found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#007bff',
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  searchBar: {
    width: '70%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  dropdown: {
    width: '25%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  td: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
  },
  message: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: 'red',
  },
};

export default AdminDashboard;