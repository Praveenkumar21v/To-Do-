import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/loginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  const showAlert = location.state?.showAlert || false;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Login successful!');
        navigate('/todos');
      } else {
        toast.error(`Login failed: ${error}`);
      }
    });
  };

  return (
    <Container className={styles.container}>
      <Form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Login</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
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
            className={styles.input}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={status === 'loading'} className={styles.button}>
          Login
        </Button>

        <div className={styles.linkContainer}>
          <p className={styles.linkText}>
            Don’t have an account? <Link to="/register" className={styles.registerLink}>Create an account</Link>
          </p>
        </div>
      </Form>

      {showAlert && (
        <Alert variant="info" className={styles.alert}>
          <Alert.Heading>Important Information</Alert.Heading>
          <p>
            Before logging in, please make sure to check your email for a verification link if you have not done so already.
          </p>
          <hr />
          <p className="mb-0">
            If you do not see the verification email, please <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">open Gmail</a> or your preferred email service and check your inbox and spam/junk folders.
          </p>
        </Alert>
      )}

      <ToastContainer />
    </Container>
  );
};

export default LoginPage;
