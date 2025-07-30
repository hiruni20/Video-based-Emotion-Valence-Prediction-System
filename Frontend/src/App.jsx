import React from 'react';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import Chat from './Components/Chat/Chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <div className="main-content-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
