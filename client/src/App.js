import React, { useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Tickets from './components/Tickets';
import Customers from './components/Customers';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateTicket from './components/CreateTicket';
import GlobalHeader from './components/GlobalHeader';  // Import the GlobalHeader component
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('tickets');
  const location = useLocation(); // Get the current location

  // Check if the current route is '/login' or '/signup'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {/* Global Header is always visible */}
      <GlobalHeader />

      {/* Conditionally render Sidebar only if not on /login or /signup */}
      {!isAuthPage && (
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      )}

      {/* Content area */}
      <div className={`content-area ${isAuthPage ? 'full-screen' : ''}`}>
        <Routes>
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Default route */}
          <Route path="/tickets/create" element={<CreateTicket />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
