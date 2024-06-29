import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './Components/MainPage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import MarkAttendance from './Components/MarkAttendance';
import StudentPage from './Components/StudentPage';
import GenerateReport from './Components/GenerateReport';
import MarkLeave from './Components/MarkLeave';
import AdminPage from './Components/AdminPage';

import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ViewStudentAttendance from './Components/ViewStudentAttendance';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/undefined/generate-report" element={<GenerateReport />} />
          <Route path="/markAttendance" element={<MarkAttendance />} />
          <Route path="/markLeave" element={<MarkLeave />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/student/*" element={<StudentPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
