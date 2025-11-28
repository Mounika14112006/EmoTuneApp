import React, { useState } from 'react';
import './LoginSignupPage.css';

const LoginSignupPage = ({ onLogin, users, addUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const switchToLogin = () => {
    setErrorMessage('');
    setIsLogin(true);
  };
  const switchToSignup = () => {
    setErrorMessage('');
    setIsLogin(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    const user = users.find(u => 
      u.email.toLowerCase() === loginEmail.trim().toLowerCase() && 
      u.password === loginPassword
    );

    if (user) {
      onLogin(user);
    } else {
      setErrorMessage('Invalid email or password');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupName.trim() || !signupEmail.trim() || !signupAge.trim() || !signupPassword || !signupConfirmPassword) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (isNaN(parseInt(signupAge)) || parseInt(signupAge) < 1) {
      setErrorMessage('Please enter a valid age');
      return;
    }

    if(users.some(u => u.email.toLowerCase() === signupEmail.toLowerCase())) {
      setErrorMessage('Email already registered');
      return;
    }

    const newUser = {
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      age: parseInt(signupAge),
      password: signupPassword,
      loginHistory: []
    };

    addUser(newUser);
    onLogin(newUser);
  };

  return (
    <div className="login-signup-page">
      <div className="tabs">
        <button className={isLogin ? 'active' : ''} onClick={switchToLogin}>Login</button>
        <button className={!isLogin ? 'active' : ''} onClick={switchToSignup}>Sign Up</button>
      </div>

      {isLogin ? (
        <form className="form" onSubmit={handleLoginSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value.toLowerCase())}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      ) : (
        <form className="form" onSubmit={handleSignupSubmit} noValidate>
          <input
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={e => setSignupName(e.target.value)}
            required
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value.toLowerCase())}
            required
            autoComplete="email"
          />
          <input
            type="number"
            placeholder="Age"
            value={signupAge}
            onChange={e => setSignupAge(e.target.value)}
            required
            min="1"
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirmPassword}
            onChange={e => setSignupConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default LoginSignupPage;
