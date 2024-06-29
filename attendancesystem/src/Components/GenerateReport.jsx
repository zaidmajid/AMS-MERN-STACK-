import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import './GenerateReport.css';

const GenerateReport = () => {
  const [reportType, setReportType] = useState('allStudents'); // Default report type
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    try {
      let response;
      switch (reportType) {
        case 'allStudents':
          response = await axios.get('http://localhost:3001/api/students');
          break;
        case 'attendance':
          response = await axios.get('http://localhost:3001/api/attendance');
          break;
        case 'leaveRequests':
          response = await axios.get('http://localhost:3001/api/leave-requests');
          break;
        default:
          throw new Error('Invalid report type');
      }
      console.log('Response data:', response.data); // Add this line
      setData(response.data);
    } catch (error) {
      setError('Error fetching data. Please try again.');
      console.error('Error fetching data:', error);
    }
  };

  const handleGeneratePDF = async () => {
    const input = document.getElementById('report-content');

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.text(getReportTitle(), 105, 10, null, null, 'center'); // Centered report title
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${getReportTitle()}.pdf`);
      })
      .catch((error) => {
        setError('Error generating PDF. Please try again.');
        console.error('Error generating PDF:', error);
      });
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'allStudents':
        return 'All Students Report';
      case 'attendance':
        return 'Attendance Report';
      case 'leaveRequests':
        return 'Leave Requests Report';
      default:
        return 'Report';
    }
  };

  const renderTableContent = () => {
    if (data.length === 0) {
      return <p className="text-center">No data available</p>;
    }
  
    if (reportType === 'attendance') {
      return (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Roll Number</th>
              <th>Present</th>
              <th>Leave Requests</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.rollNumber}</td>
                <td>{item.records && item.records.some(record => record.isPresent) ? 'Yes' : 'No'}</td>
                <td>
                  {item.records && item.records.some(record => record.isLeave) ? (
                    <ul>
                      {item.records.filter(record => record.isLeave).map((leave, index) => (
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
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      return (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {Object.keys(data[0])
                .filter(key => key !== '_id')
                .map((key) => (
                  <th key={key}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.keys(item)
                  .filter(key => key !== '_id')
                  .map((key, idx) => (
                    <td key={idx}>
                      {key === 'date'
                        ? new Date(item[key]).toLocaleDateString()
                        : item[key]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };

  return (
    <div className="generate-report-container">
      <Container className="mt-4">
        <h3 className="text-center mb-4">Generate Report</h3>
        <Row className="mb-4">
          <Col md={{ span: 6, offset: 3 }}>
            <Form.Group>
              <Form.Label>Select Report Type:</Form.Label>
              <Form.Control
                as="select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="allStudents">All Students Report</option>
                <option value="attendance">Attendance Report</option>
                <option value="leaveRequests">Leave Requests Report</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col className="text-center">
            <Button onClick={handleGeneratePDF} variant="primary">
              Generate PDF Report
            </Button>
          </Col>
        </Row>
        {error && (
          <Row className="mb-4">
            <Col className="text-center">
              <p className="text-danger">{error}</p>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <div id="report-content" className="p-3 border rounded">
              <h3 className="text-center mb-4">{getReportTitle()}</h3>
              {renderTableContent()}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GenerateReport;
