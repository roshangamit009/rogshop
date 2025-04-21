import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  email: string;
  mobileNo: string; // Add mobile number
  address: string;
  products: Product[];
  createdAt: string;
  received: string;
}

const ShopkeeperOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const shopName = localStorage.getItem('shopkeeperName') || '';
  const email = localStorage.getItem('shopkeeperEmail') || '';
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          params: {
            shopName: shopName || undefined,
            email: email || undefined,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setMessage('Error fetching orders');
      }
    };

    fetchOrders();
  }, [shopName, email]);

  const handleStatusChange = async (orderId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        received: 'Complete', // Update the status to "Complete"
      });

      // Update the order status in the frontend
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, received: 'Complete' } : order
        )
      );

      setMessage('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage('Error updating order status');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{shopName || email} - Shop Orders</h2>
      {message && <p style={styles.message}>{message}</p>}
      {orders.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer Email</th>
              <th style={styles.th}>Mobile Number</th> {/* Add Mobile Number Column */}
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Total Quantity</th>
              <th style={styles.th}>Total Price</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Created At</th>
              <th style={styles.th}>Received</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={styles.td}>{order._id}</td>
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
                  {order.products.reduce((total, p) => total + p.quantity, 0)}
                </td>
                <td style={styles.td}>
                  ₹
                  {order.products
                    .reduce((total, p) => total + p.price * p.quantity, 0)
                    .toFixed(2)}
                </td>
                <td style={styles.td}>{order.address}</td>
                <td style={styles.td}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={styles.td}>{order.received}</td>
                <td style={styles.td}>
                  {order.received !== 'Complete' && (
                    <button
                      style={styles.button}
                      onClick={() => handleStatusChange(order._id)}
                    >
                      Mark as Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.emptyMessage}>No orders found for your shop.</p>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: 'green',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default ShopkeeperOrder;
