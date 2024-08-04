import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TodoList from './components/TodoList';
import SessionList from './components/SessionList';
import ModalConfirm from './components/ModalConfirm';
import { clearCredentials } from './features/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import NotFound from './components/NotFound';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [showModal, setShowModal] = React.useState(false);

  const handleSignOut = () => {
    dispatch(clearCredentials());
    setShowModal(false);
    toast.success('Signed out successfully!');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/todos" element={token ? <TodoList /> : <LoginPage />} />
        <Route path="/sessions" element={token ? <SessionList/> : <LoginPage />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <ModalConfirm
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleSignOut}
      />
      <ToastContainer />
    </Router>
  );
};

const persistor = persistStore(store);

export default function Root() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}
