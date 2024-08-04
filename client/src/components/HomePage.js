import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homePage.css'; 

const HomePage = () => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <Card.Title as="h1" className="card-title">Welcome to TodoApp</Card.Title>
              <Card.Text className="card-text">Your personal task manager.</Card.Text>
              <div className="button-container">
                <Link to="/login">
                  <Button variant="primary" className="mr-2">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary">Register</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
