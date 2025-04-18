import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Add Product</Link>
      <Link to="/bill">Bill</Link>
    </nav>
  );
};

export default Navbar;
