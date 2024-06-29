import React from 'react';
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Spinner } from 'react-bootstrap';
import { FaClipboardCheck, FaCalendarAlt, FaUserClock } from 'react-icons/fa'; // Importing icons
import './StudentPage.css';
import MarkAttendance from './MarkAttendance';
import MarkLeave from './MarkLeave';
import ViewStudentAttendance from './ViewStudentAttendance';

function StudentPage() {
  const match = useMatch('/student/*');
  const navigate = useNavigate();

  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <Container fluid className="vh-100 student-page">
      <Row>
        <Col className="sidebar" md={3}>
          <h2>Student Dashboard</h2>
          <Nav defaultActiveKey={`${match.url}/mark-attendance`} className="flex-column">
            <Nav.Link as={Link} to={`${match.url}/mark-attendance`}>
              <FaUserClock className="icon" /> Mark Attendance
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigation(`${match.url}/mark-leave`)}>
              <FaCalendarAlt className="icon" /> Request Leave
            </Nav.Link>
            <Nav.Link as={Link} to={`${match.url}/view-attendance`}>
              <FaClipboardCheck className="icon" /> View Attendance
            </Nav.Link>
          </Nav>
        </Col>
        <Col className="content" md={9}>
          <Routes>
            <Route path={`${match.url}/mark-attendance`} element={<MarkAttendance />} />
            <Route path={`${match.url}/mark-leave`} element={<MarkLeave />} />
            <Route path={`${match.url}/view-attendance`} element={<ViewStudentAttendance />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentPage;

