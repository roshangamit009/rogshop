import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';  // Optional, if you have global styles

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Router>
    <App />
  </Router>
);

// Create a new order
app.post('/api/orders', async (req, res) => {
  const { shopId, shopName, email, mobileNo, address, products } = req.body;

  if (!shopId || !shopName || !email || !mobileNo || !address || !products || products.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new order
    const newOrder = new Order({
      shopId,
      shopName,
      email,
      mobileNo,
      address,
      products,
    });

    await newOrder.save();

    // Update stock in ShopkeeperProducts table
    for (const product of products) {
      const dbProduct = await ShopkeeperProducts.findOne({
        shopkeeperId: shopId,
        productName: product.productName,
      });

      if (!dbProduct) {
        return res.status(404).json({ message: `Product "${product.productName}" not found` });
      }

      if (dbProduct.quantity < product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${product.productName}"` });
      }

      dbProduct.quantity -= product.quantity; // Reduce stock
      await dbProduct.save();
    }

    // Delete items from the cart for the user
    await Cart.deleteMany({ userEmail: email });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});
