import React, { useState, useEffect } from 'react';
import { Button, Form, FormControl, Table } from 'react-bootstrap';
import axios from 'axios';

function ViewAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/attendance', {
        params: { date, rollNumber }
      });
      setAttendance(response.data);
      setFilteredAttendance(response.data);
    } catch (error) {
      setError('Error fetching attendance. Please try again.');
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date, rollNumber]); // Fetch attendance data when date or rollNumber changes

  const handleSearch = () => {
    fetchAttendance();
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`http://localhost:3001/api/attendance/${recordId}`);
      setAttendance(attendance.filter(record => record._id !== recordId));
      setFilteredAttendance(filteredAttendance.filter(record => record._id !== recordId));
      console.log('Attendance record deleted successfully');
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      setError('Failed to delete attendance record');
    }
  };

  return (
    <div  className="centered-content">
      <h3>View Attendance Records</h3>
      {/* Form for filtering attendance */}
      <Form inline className="mb-3">
        <FormControl
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mr-sm-2"
        />
        <FormControl
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="mr-sm-2"
        />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      {/* Loading and error messages */}
      {loading && <p>Loading attendance records...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Display table if there are filtered attendance records */}
      {filteredAttendance.length > 0 && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Roll Number</th>
              <th>Present</th>
              <th>Leave Requests</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.rollNumber}</td>
                <td>{record.records.length > 0 && record.records[0].isPresent ? 'Yes' : 'No'}</td>
                <td>
                  {record.records.filter(r => r.isLeave).length > 0 ? (
                    <ul>
                      {record.records.filter(r => r.isLeave).map((leave, index) => (
                        <li key={index}>
                          <strong>Reason:</strong> {leave.leaveReason}
                          <br />
                          <strong>Created At:</strong> {new Date(leave.createdAt).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'None'
                  )}
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(record._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Message when no records are found */}
      {filteredAttendance.length === 0 && !loading && (
        <p>No attendance records found for the selected criteria.</p>
      )}
    </div>
  );
}

export default ViewAttendance;
