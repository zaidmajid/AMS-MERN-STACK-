import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Import icons
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const result = await axios.post('http://localhost:3001/login', { email, password, role });
      if (result.data.success) {
        login(result.data.token);
        setMessage(`Login successful as ${role}! Redirecting...`);
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'student') {
            navigate('/student');
          }
        }, 2000);
      } else {
        setMessage('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(`An error occurred: ${err.response ? err.response.data.message : 'Internal server error'}`);
    }
  };

  const handleSignup = () => {
    navigate('/register'); // Navigate to the signup page
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-center mb-4">Login</h2>
        {message && (
          <div className={`alert-message ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formRole" className="role-group">
            <Form.Label>Role:</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" className="btn-login">
            <FaSignInAlt className="icon" /> Log In
          </Button>

          <Button variant="secondary" className="mt-3 btn-signup" onClick={handleSignup}>
            <FaUserPlus className="icon" /> Sign Up for Free
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
