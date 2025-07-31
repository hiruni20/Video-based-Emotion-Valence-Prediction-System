import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import Chat from './Components/Chat/Chat';
import LandingPage from './Components/Landing Page/LandingPage';

function LayoutWrapper() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/'; // Hide sidebar on landing page

  return (
    <div className="layout">
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'main-content-wrapper' : 'main-content-wrapper no-margin'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;

