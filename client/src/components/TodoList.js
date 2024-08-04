import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, updateTodo, deleteTodo } from '../features/todoSlice';
import TodoForm from './TodoForm';
import { Container, Alert, Button, Card, Form, Modal } from 'react-bootstrap';
import { signOutUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignOutAlt, FaTasks, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import ModalConfirm from './ModalConfirm'; 
import '../styles/todolist.css'; 

const TodoList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const todos = useSelector((state) => state.todos.todos);
  const status = useSelector((state) => state.todos.status);
  const error = useSelector((state) => state.todos.error);

  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ id: '', title: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [confirmType, setConfirmType] = useState('');
  
  const [currentId, setCurrentId] = useState(''); 

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos(token))
        .unwrap()
        .catch((err) => {
          setNotification({ type: 'error', message: `Failed to fetch todos: ${err.message}` });
        });
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (status === 'succeeded' && todos.length > 0) {
      console.log('Todos fetched successfully!');
    } else if (status === 'failed') {
      setNotification({ type: 'error', message: `Failed to fetch todos: ${error}` });
    }
  }, [status, error, todos]);

  useEffect(() => {
    setShowWelcomePopup(true);
    const timer = setTimeout(() => {
      setShowWelcomePopup(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateSubmit = () => {
    if (modalContent.title.trim()) {
      dispatch(updateTodo({ id: modalContent.id, updates: { title: modalContent.title }, token }))
        .unwrap()
        .then(() => {
          setNotification({ type: 'success', message: 'Todo updated successfully!' });
          setShowModal(false);
        })
        .catch((err) => {
          setNotification({ type: 'error', message: `Failed to update todo: ${err.message}` });
        });
    } else {
      setNotification({ type: 'error', message: 'Title cannot be empty.' });
    }
  };

  const handleSignOut = () => {
    dispatch(signOutUser(token))
      .unwrap()
      .then(() => {
        toast.success('Logout successfully');
        navigate('/sessions');
      })
      .catch((err) => {
        toast.error(`Failed to sign out: ${err.message}`);
      });
  };

  const handleSessionsClick = () => {
    navigate('/sessions');
  };

  const handleDelete = (id) => {
    setCurrentId(id);
    setConfirmType('delete');
    setShowConfirmModal(true);
  };

  const handleCheckboxChange = (id, completed) => {
    dispatch(updateTodo({
      id,
      updates: { completed: !completed },
      token,
    }))
      .unwrap()
      .catch((err) => {
        toast.error(`Failed to update todo: ${err.message}`);
      });
  };

  const handleConfirm = () => {
    if (confirmType === 'delete') {
      dispatch(deleteTodo({ id: currentId, token }))
        .unwrap()
        .then(() => {
          toast.success('Todo deleted successfully');
          setShowConfirmModal(false);
        })
        .catch((err) => {
          toast.error(`Failed to delete todo: ${err.message}`);
        });
    } else if (confirmType === 'signOut') {
      handleSignOut();
      setShowConfirmModal(false);
    }
  };

  const notificationStyle = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '15px',
    borderRadius: '5px',
    zIndex: 1000,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
    color: notification.type === 'success' ? '#155724' : '#721c24',
  };

  return (
    <Container className="todo-list-container">
      <div className="top-buttons">
        <Button variant="outline-secondary" onClick={handleSessionsClick} className="me-2">
          <FaTasks /> Sessions
        </Button>
        <Button id='signout' variant="outline-danger" onClick={() => {
          setConfirmType('signOut');
          setShowConfirmModal(true);
        }}>
          <FaSignOutAlt /> Sign Out
        </Button>
      </div>
      <h2 className="mt-5">Todo List</h2>
      <TodoForm />
      {showWelcomePopup && (
        <div style={{ ...notificationStyle, backgroundColor: '#28a745', color: 'white' }}>
          Welcome to In Do Plan Tasks
        </div>
      )}
      {notification.message && (
        <div style={notificationStyle}>
          {notification.message}
        </div>
      )}
      {status === 'failed' && (
        <Alert variant="danger">Failed to fetch todos: {error}</Alert>
      )}
      {todos.length === 0 ? (
        <Alert variant="info">No todos available. Please add some.</Alert>
      ) : (
        <div className="todo-cards-container">
          {todos.map(todo => (
            <Card
              key={todo._id}
              className={`todo-card ${todo.completed ? 'completed' : ''}`}
              onClick={() => handleCheckboxChange(todo._id, todo.completed)}
            >
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckboxChange(todo._id, todo.completed)}
                  label={<span className={todo.completed ? 'completed-task' : ''}>{todo.title}</span>}
                />
                {!todo.completed && (
                  <Button 
                    variant="outline-primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalContent({ id: todo._id, title: todo.title });
                      setShowModal(true);
                    }}
                    className="me-2 edit-button"
                  >
                    <FaEdit /> Edit
                  </Button>
                )}
                <Button 
                  variant="outline-danger" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(todo._id);
                  }}
                  className="delete-button"
                >
                  <FaTrashAlt /> Delete
                </Button>
              </Card.Body>
              <Card.Footer className="text-muted">
                {todo.completed ? 'Completed' : 'Pending'}
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={modalContent.title}
            onChange={(e) => setModalContent({ ...modalContent, title: e.target.value })}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalConfirm 
        show={showConfirmModal} 
        onHide={() => setShowConfirmModal(false)} 
        onConfirm={handleConfirm}
      />
    </Container>
  );
};

export default TodoList;
