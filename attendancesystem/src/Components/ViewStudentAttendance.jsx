import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

function ViewStudentAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('/api/student/attendance');
        setAttendanceData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setError('Error fetching attendance. Please try again.');
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <Container>
      <h2 className="my-4">Your Attendance Records</h2>
      {loading ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : attendanceData.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <Row>
          {attendanceData.map((attendance) => (
            <Col key={attendance._id} xs={12} md={6} lg={4} className="mb-3">
              <Card className="p-3">
                <h5>{new Date(attendance.date).toLocaleDateString()}</h5>
                <p>Attendance Status: {attendance.isPresent ? 'Present' : 'Absent'}</p>
                {attendance.leaveRequests.length > 0 && (
                  <div>
                    <h6>Leave Requests:</h6>
                    <ul>
                      {attendance.leaveRequests.map((request, index) => (
                        <li key={index}>
                          <p>Reason: {request.reason}</p>
                          <p>Requested Date: {new Date(request.requestedDate).toLocaleDateString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ViewStudentAttendance;
