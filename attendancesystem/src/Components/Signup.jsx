import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './signup-styles.css';
import './style.css'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const [showLoginButton, setShowLoginButton] = useState(false); // State to control visibility of login button

  const handleSubmit = (e) => {
    e.preventDefault();
    const rollNumber = role === 'student' ? `ROLL-${Date.now()}` : null;

    axios.post('http://localhost:3001/register', { name, email, password, role, rollNumber })
      .then(result => {
        setMessage('You registered successfully! Please login.');
        setName('');
        setEmail('');
        setPassword('');
        setRole('student');
        setShowLoginButton(true); // Show the login button after successful registration
      })
      .catch(err => {
        console.log(err);
        setMessage('Failed to register');
      });
  }

  const handleLoginClick = () => {
    // Navigate to login page
    window.location.href = '/login'; // Replace with your actual login route if different
  }

  return (
    <div className="position-relative d-flex justify-content-center align-items-center vh-100 signup-page">
      <div className="p-3 rounded w-25 border signup-form">
        <h2>Register</h2>
        {message && (
          <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name"><strong>Name:</strong></label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Enter your Name"
              className="form-control rounded-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter your Email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password:</strong></label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role"><strong>Role:</strong></label>
            <select
              name="role"
              className="form-control rounded-0"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="btn btn-success w-100 rounded-0">Sign Up</Button>
        </form>
      </div>
      {showLoginButton && (
        <div className="position-absolute top-0 end-0 mt-3 me-3">
          <Button onClick={handleLoginClick} variant="info" className="rounded-pill p-3 login-button">
            Login
          </Button>
        </div>
      )}
    </div>
  );
}

export default Signup;
