import { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    email: '',
    mobileNo: '',
    address: '',
  });

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart`, {
          params: { userEmail },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [userEmail]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const mergedCartItems = cartItems.map((cartItem) => {
    const productDetails = products.find(
      (product) =>
        product.productName === cartItem.product &&
        product.shopkeeperId === cartItem.shopId
    );
    return {
      ...cartItem,
      stock: productDetails?.quantity || 0,
    };
  });

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedItem = cartItems.find((item) => item._id === itemId);
      if (!updatedItem) return;

      if (newQuantity > updatedItem.stock) {
        alert('Quantity exceeds available stock');
        return;
      }

      const updatedTotalBill =
        (updatedItem.totalBill / updatedItem.quantity) * newQuantity;

      await axios.put(`http://localhost:5000/api/cart/${itemId}`, {
        quantity: newQuantity,
        totalBill: updatedTotalBill,
      });

      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity: newQuantity, totalBill: updatedTotalBill }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`);
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    const products = cartItems.map((item) => ({
      productName: item.product,
      quantity: item.quantity,
      price: item.totalBill / item.quantity,
    }));

    const orderData = {
      shopId: cartItems[0]?.shopId,
      shopName: cartItems[0]?.shopName,
      email: orderDetails.email,
      mobileNo: orderDetails.mobileNo,
      address: orderDetails.address,
      products,
    };

    try {
      // Send the order data to the backend
      await axios.post('http://localhost:5000/api/orders', orderData);

      alert('Order placed successfully');

      // Automatically remove all items from the cart
      for (const item of cartItems) {
        await handleRemoveItem(item._id); // Trigger the remove action for each item
      }

      // Clear the cart items from the frontend state
      setCartItems([]);
      setShowOrderForm(false);
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Error placing order');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Cart</h2>
      {mergedCartItems.length > 0 ? (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Shop Name</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Total Bill</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mergedCartItems.map((item) => (
                <tr key={item._id}>
                  <td style={styles.td}>{item.product}</td>
                  <td style={styles.td}>{item.shopName}</td>
                  <td style={styles.td}>
                    {item.stock > 0 ? (
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item._id, parseInt(e.target.value, 10))
                        }
                        style={styles.select}
                      >
                        {[...Array(item.stock).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ color: 'red' }}>Out of Stock</span>
                    )}
                  </td>
                  <td style={styles.td}>{item.stock}</td>
                  <td style={styles.td}>${item.totalBill.toFixed(2)}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.removeButton}
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.summary}>
            <p style={styles.summaryText}>
              <strong>Total Quantity:</strong> {totalQuantity}
            </p>
          </div>
          <button
            style={styles.orderButton}
            onClick={() => setShowOrderForm(true)}
          >
            Place Order
          </button>
        </>
      ) : (
        <p style={styles.emptyMessage}>Your cart is empty.</p>
      )}

      {showOrderForm && (
        <div style={styles.orderForm}>
          <h3>Order Details</h3>
          <input
            type="email"
            placeholder="Email"
            value={orderDetails.email}
            onChange={(e) =>
              setOrderDetails({ ...orderDetails, email: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Mobile No"
            value={orderDetails.mobileNo}
            onChange={(e) =>
              setOrderDetails({ ...orderDetails, mobileNo: e.target.value })
            }
            style={styles.input}
          />
          <textarea
            placeholder="Address"
            value={orderDetails.address}
            onChange={(e) =>
              setOrderDetails({ ...orderDetails, address: e.target.value })
            }
            style={styles.textarea}
          />
          <button style={styles.submitButton} onClick={handlePlaceOrder}>
            Submit Order
          </button>
        </div>
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
  select: {
    padding: '0.25rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  summary: {
    marginTop: '1rem',
    textAlign: 'right',
  },
  summaryText: {
    fontSize: '1.2rem',
    color: '#333',
  },
  orderButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  orderForm: {
    marginTop: '2rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'none',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  removeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default Cart;
