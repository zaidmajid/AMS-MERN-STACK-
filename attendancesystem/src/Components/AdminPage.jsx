import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Spinner } from 'react-bootstrap';
import { FaUserEdit, FaUsers, FaClipboardList, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import './AdminPage.css';
import EditProfile from './EditProfile';
import ViewStudents from './ViewStudents';
import ViewAttendance from './ViewAttendance';
import GenerateReport from './GenerateReport';

function AdminPage() {
  const match = useMatch('/admin/*');
  const [loading, setLoading] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentCount();
  }, []);

  const fetchStudentCount = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/students/count');
      setStudentCount(response.data.count);
    } catch (error) {
      console.error('Error fetching student count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (url) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(url);
    }, 2000);
  };

  return (
    <Container fluid className="vh-100 admin-page">
      <Row className="h-100">
        <Col className="sidebar" md={3}>
          <Nav defaultActiveKey={`${match.url}/edit-profile`} className="flex-column">
            <Nav.Link as={Link} to={`${match.url}/edit-profile`}>
              <FaUserEdit className="icon" /> Edit Profile
            </Nav.Link>
            <Nav.Link as={Link} to={`${match.url}/view-students`}>
              <FaUsers className="icon" /> View All Student Records
            </Nav.Link>
            <Nav.Link as={Link} to={`${match.url}/view-attendance`}>
              <FaClipboardList className="icon" /> View Attendance
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation(`${match.url}/generate-report`)}>
              <FaFileAlt className="icon" /> Generate Report
            </Nav.Link>
            <div style={{ marginTop: 'auto' }} className="student-count">
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total Students: {studentCount}</p>
            </div>
          </Nav>
        </Col>
        <Col className="content p-0" md={9}>
          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" />
            </div>
          ) : (
            <Routes>
              <Route path={`${match.url}/edit-profile`} element={<EditProfile />} />
              <Route path={`${match.url}/view-students`} element={<ViewStudents />} />
              <Route path={`${match.url}/view-attendance`} element={<ViewAttendance />} />
              <Route path={`${match.url}/generate-report`} element={<GenerateReport />} />
            </Routes>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
