import React, { useState } from 'react';
import axios from 'axios';
import {
  AttendanceContainer,
  FormContainer,
  Form,
  FormGroup,
  FormControl,
  CheckboxLabel,
  CheckboxInput,
  SubmitButton,
  Message,
} from '../Components/MarkAttendanceStyled'; // Adjust the path if necessary

const MarkAttendance = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [isPresent, setIsPresent] = useState(false);
  const [message, setMessage] = useState('');

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/markAttendance', {
        rollNumber,
        isPresent,
      });

      // Check for specific error message from the backend
      if (response.data.message === 'Cannot mark attendance more than once in 24 hours') {
        setMessage(response.data.message);
      } else {
        setMessage('Attendance marked successfully');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Failed to mark attendance');
    }
  };

  return (
    <AttendanceContainer>
      <FormContainer>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Mark Attendance</h2>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Attendance can be marked once in 24 hours</p>
        <Form onSubmit={handleAttendanceSubmit}>
          <FormGroup>
            <label htmlFor="rollNumber">Roll Number:</label>
            <FormControl
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={isPresent}
                onChange={(e) => setIsPresent(e.target.checked)}
              />
              Present
            </CheckboxLabel>
          </FormGroup>
          <SubmitButton type="submit">Mark Attendance</SubmitButton>
        </Form>
        {message && <Message className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>{message}</Message>}
      </FormContainer>
    </AttendanceContainer>
  );
};

export default MarkAttendance;
