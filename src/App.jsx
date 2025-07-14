import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainApp from './pages/MainPage';
import RegisterActivity from './components/RegisterActivity';
import UserRegistrationSimulator from './components/UsersSimulation';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? <Navigate to="/app" />
            : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          user
            ? <MainApp />
            : <Navigate to="/" />
        }
      />
      <Route
        path='/register-activity'
        element={<RegisterActivity />}
      >

      </Route>
      <Route
        path='/simulation'
        element={<UserRegistrationSimulator />}>

      </Route>
    </Routes>
  );
}

export default App;
