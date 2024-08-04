import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTodo, updateTodo } from '../features/todoSlice';
import { ListGroup, Button, Form } from 'react-bootstrap';

const TodoItem = ({ todo, token, onDelete, onEdit }) => {
  const dispatch = useDispatch();

  const handleCheckboxChange = () => {
    const updatedTodo = { completed: !todo.completed };
    dispatch(updateTodo({ id: todo._id, updates: updatedTodo, token }))
      .unwrap()
      .catch((err) => {
        console.error(`Failed to update todo: ${err.message}`);
      });
  };

  const confirmDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
    if (confirmDelete) {
      handleDelete();
    }
  };

  const handleDelete = useCallback(() => {
    dispatch(deleteTodo({ id: todo._id, token }))
      .unwrap()
      .then(() => {
        if (onDelete) onDelete();
      })
      .catch((err) => {
        console.error(`Failed to delete todo: ${err.message}`);
      });
  }, [dispatch, todo._id, token, onDelete]);

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <Form.Check 
        type="checkbox" 
        checked={todo.completed} 
        onChange={handleCheckboxChange}
        label={todo.title}
      />
      <div>
        <Button 
          variant="primary" 
          onClick={() => onEdit(todo)} 
          className="me-2"
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          onClick={confirmDelete} 
        >
          Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default TodoItem;
