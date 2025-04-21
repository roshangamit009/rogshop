import { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrder = () => {
  const [orders, setOrders] = useState([]); // State to store user orders
  const userEmail = localStorage.getItem('userEmail'); // Get the logged-in user's email

  // Fetch orders for the logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          params: { email: userEmail }, // Pass userEmail as a query parameter
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userEmail]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      {orders.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Shop Name</th>
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Total Quantity</th>
              <th style={styles.th}>Total Price</th>
              <th style={styles.th}>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={styles.td}>{order._id}</td>
                <td style={styles.td}>{order.shopName}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.emptyMessage}>You have no orders yet.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
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
};

export default MyOrder;