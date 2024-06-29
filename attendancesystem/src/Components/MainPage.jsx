import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Import icons
import '../Components/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>&nbsp;&nbsp;AMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto nav-left"> {/* Add nav-left class */}
            <Nav.Link as={Link} to="/login">
              <FaSignInAlt className="nav-icon" /> Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              <FaUserPlus className="nav-icon" /> Signup
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="main-content">
        <div className="container">
          <h1>Welcome to AMS</h1>
          <p>Manage Attendance Like Never Before</p>
          <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
