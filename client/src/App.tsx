// 📄 client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProduct from './pages/AddProduct';
import Bill from './pages/Bill';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddProduct />} />
        <Route path="/bill" element={<Bill />} />
      </Routes>
    </Router>
  );
};

export default App;
