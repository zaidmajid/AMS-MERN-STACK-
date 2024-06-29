import styled from 'styled-components';

export const AttendanceContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
 
  font-family: 'Arial', sans-serif;
`;

export const FormContainer = styled.div`
  background: #ffffff;
  color: #333;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 1000%;
  max-width: 600px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormControl = styled.input`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 18px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-top: 15px;
`;

export const CheckboxInput = styled.input`
  margin-right: 10px;
`;

export const SubmitButton = styled.button`
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

export const Message = styled.p`
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
`;

export const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
  color: #555;
`;

export const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;
