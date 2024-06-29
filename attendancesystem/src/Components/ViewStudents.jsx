import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaThList, FaThLarge } from 'react-icons/fa';
import styled from 'styled-components'; // Import styled-components

// Styled button component
const ToggleButton = styled(Button)`
  background-color: #6c757d;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }

  svg {
    margin: 0;
  }
`;

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCardView, setIsCardView] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/students');
      setStudents(response.data);
    } catch (error) {
      setError('Error fetching students. Please try again.');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleViewMode = () => {
    setIsCardView(prevMode => !prevMode);
  };

  return (
    <div className="centered-content fade-in">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: '1000' }}>
        <ToggleButton onClick={toggleViewMode}>
          {isCardView ? <FaThList /> : <FaThLarge />}
        </ToggleButton>
      </div>
      <h3>View All Student Records</h3>
      <Button onClick={fetchStudents} variant="primary" disabled={loading}>
        {loading ? 'Loading...' : 'Load Students'}
      </Button>
      {error && <p className="text-danger">{error}</p>}
      <div className="view-container" style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
        {isCardView ? (
          <Row style={{ marginTop: '20px', opacity: 1, transform: 'translateY(0)' }}>
            {students.map(student => (
              <Col key={student._id} xs={12} md={6} lg={4}>
                <Card className="student-card">
                  <Card.Body>
                    <div>
                      <Card.Title>{student.name}</Card.Title>
                      <Card.Text>
                        <strong>Email:</strong> {student.email} <br />
                        <strong>Roll Number:</strong> {student.rollNumber}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <ListGroup style={{ marginTop: '20px', opacity: 1, transform: 'translateY(0)' }}>
            {students.map(student => (
              <ListGroup.Item key={student._id}>
                <strong>Name:</strong> {student.name} <br />
                <strong>Email:</strong> {student.email} <br />
                <strong>Roll Number:</strong> {student.rollNumber}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}

export default ViewStudents;
