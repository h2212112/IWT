import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import StoryHome from './components/StoryHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/StoryHome" element={<StoryHome />} />
      </Routes>
    </Router>
  );
}

export default App;
