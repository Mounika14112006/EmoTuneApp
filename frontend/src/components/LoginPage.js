import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !verifyPassword.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== verifyPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Simulate user registration/login success after validation
    setErrorMessage('');
    onLogin({ email, password });
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Create Your Account / Login</h2>

        <input
          type="email"
          placeholder="Username (Email)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={e => setVerifyPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
