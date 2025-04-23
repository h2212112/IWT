import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost/story_portal/login.php", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.text();
    alert(result); // You can show success/failure message
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <br />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
