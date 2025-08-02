import React, { useState } from 'react';
import './sidebar.css'; 
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2 className="logo"><img src={logo} alt="Logo" />MindBot</h2>
        <ul className="nav">
         <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/chat">Chat</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/">Home</Link></li>
          
        </ul>
      </div>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '☰' : '→'}
      </button>
    </>
  );
};

export default Sidebar;
