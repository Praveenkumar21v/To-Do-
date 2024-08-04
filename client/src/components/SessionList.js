import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessions } from '../features/sessionSlice';
import { Button, Container, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/sessionlist.css'; 

const SessionsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const sessions = useSelector((state) => state.sessions.sessions || []);
  const status = useSelector((state) => state.sessions.status);
  const error = useSelector((state) => state.sessions.error);

  useEffect(() => {
    if (token) {
      dispatch(fetchSessions(token))
        .unwrap()
        .catch((err) => {
          console.error(`Failed to fetch sessions: ${err.message}`);
        });
    }
  }, [dispatch, token]);

  const handleBack = () => {
    navigate(-1);
  };

  if (status === 'loading') {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Failed to fetch sessions: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button
        variant="outline-secondary"
        onClick={handleBack}
        className="mb-4"
      >
        Back
      </Button>
      <h2 className="mb-4 text-center text-primary">Sessions List</h2>
      {sessions.length === 0 ? (
        <Alert variant="info" className="text-center">
          No sessions available.
        </Alert>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <Table striped bordered hover responsive="md" className="shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>Email</th>
                  <th>User ID</th>
                  <th>Sign In At</th>
                  <th>Sign Out At</th>
                  <th>Session Token</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session._id}>
                    <td>{session.email}</td>
                    <td>{session.userId}</td>
                    <td>{new Date(session.signInAt).toLocaleString()}</td>
                    <td>{session.signOutAt ? new Date(session.signOutAt).toLocaleString() : 'Not Signed Out'}</td>
                    <td className="session-token">
                      {session.sessionToken}
                    </td>
                    <td>{new Date(session.createdAt).toLocaleString()}</td>
                    <td>{session.updatedAt ? new Date(session.updatedAt).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default SessionsList;
