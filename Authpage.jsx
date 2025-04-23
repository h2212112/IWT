import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill in all fields to register.");
      return;
    }

    try {
      const res = await fetch('http://localhost/story_portal/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword
        })
      });

      const data = await res.text();
      if (res.ok && data.toLowerCase().includes("successful")) {
        alert("Registered successfully! Now login.");
        // Don't navigate — stay on same page
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
      } else {
        alert(data || "Registration failed!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter both email and password to login.");
      return;
    }

    try {
      const res = await fetch('http://localhost/story_portal/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        alert(data.message);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("userEmail", data.email);
        navigate("/StoryHome");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Story Portal</h1>

      <div className="form-box">
        <div className="form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>

        <div className="form">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
