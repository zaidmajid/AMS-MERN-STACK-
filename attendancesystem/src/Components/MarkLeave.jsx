import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CenteredContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
`;

const Container = styled.div`
  background: #ffffff;
  color: #333;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 18px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
`;

const MarkLeave = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [message, setMessage] = useState('');

  const handleLeaveRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/requestLeave', {
        rollNumber,
        reason: leaveReason,
      });
      setMessage(response.data.message);
      setRollNumber('');
      setLeaveReason('');
    } catch (error) {
      console.error('Error sending leave request:', error);
      setMessage('Failed to send leave request');
    }
  };

  return (
    <CenteredContainer>
      <Container>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Request Leave</h2>
        <Form onSubmit={handleLeaveRequestSubmit}>
          <label htmlFor="rollNumber">Roll Number:</label>
          <Input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
          <label htmlFor="leaveReason">Reason for Leave:</label>
          <Input
            type="text"
            id="leaveReason"
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            required
          />
          <Button type="submit">Request Leave</Button>
        </Form>
        {message && <Message>{message}</Message>}
      </Container>
    </CenteredContainer>
  );
};

export default MarkLeave;
