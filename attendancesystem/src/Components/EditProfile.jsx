import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { name, email, imageUrl } = response.data;
      setName(name);
      setEmail(email);
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setMessage(response.data.message);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container centered-content fade-in">
      <h3>Edit Profile</h3>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Profile Information</Card.Title>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Profile Preview" className="img-fluid" />
                </div>
              )}
              <Card.Text><strong>Name:</strong> {name}</Card.Text>
              <Card.Text><strong>Email:</strong> {email}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
            </Button>
          </Form>
          {message && <p className="text-success mt-3">{message}</p>}
        </Col>
      </Row>
    </div>
  );
};

export default EditProfile;
