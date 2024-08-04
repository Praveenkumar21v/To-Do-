import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTodo } from '../features/todoSlice';
import { Form, Button } from 'react-bootstrap';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(createTodo({ title, token }));
      setTitle('');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Add a new todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" className='mt-3' type="submit">Add Todo</Button>
    </Form>
  );
};

export default TodoForm;
