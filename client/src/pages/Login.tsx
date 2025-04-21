import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = formData;

      // Check for admin credentials
      if (email === 'roshan@gmail.com' && password === '9282@bca') {
        // Redirect to Admin page
        navigate('/admin');
        return;
      }

      // Otherwise, proceed with normal login
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Store the token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); // Assuming the backend sends the username
      localStorage.setItem('userId', response.data.userId); // Assuming the backend sends the user ID
      localStorage.setItem('userEmail', response.data.email); // Assuming the backend sends the email

      // Redirect to the Home page
      navigate('/home');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      {message && <p style={{ ...styles.message, color: 'red' }}>{message}</p>}
      <p style={styles.linkText}>
        Don't have an account?{' '}
        <Link to="/register" style={styles.link}>
          Register here
        </Link>
      </p>
      <p style={styles.linkText}>
        Are you a shopkeeper?{' '}
        <Link to="/shopkeeperlogin" style={styles.link}>
          Login as Shopkeeper
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;