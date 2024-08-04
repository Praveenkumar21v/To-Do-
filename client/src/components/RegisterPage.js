import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/registerPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password }))
      .unwrap()
      .then(() => {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/login', { state: { showAlert: true } });
        }, 3000);
      })
      .catch((err) => {
        toast.error(`Registration failed: ${err.message}`);
      });
  };

  return (
    <Container className="register-container">
      <Form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={status === 'loading'}>
          Register
        </Button>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default RegisterPage;
