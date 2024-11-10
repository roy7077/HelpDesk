// import React from 'react';
// import { Link } from 'react-router-dom'; // Importing Link for navigation
// import '../styles/sidebar.css';

// const Sidebar = ({ activeSection, onSectionChange }) => {
//   return (
//     <div className="sidebar">
//       <h2 style={{ textAlign: 'center', color: 'white' }}>Admin Panel</h2>
//       <Link
//         to="/tickets"
//         className={activeSection === 'tickets' ? 'active' : ''}
//         onClick={() => onSectionChange('tickets')}
//       >
//         Tickets
//       </Link>
//       <Link
//         to="/customers"
//         className={activeSection === 'customers' ? 'active' : ''}
//         onClick={() => onSectionChange('customers')}
//       >
//         Customers
//       </Link>
//     </div>
//   );
// };

// export default Sidebar;

// Sidebar.js (Example)
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const isAdmin = false; // Assuming a variable or context to check if the user is an admin

  return (
    <div className="sidebar">
      <ul>
        {/* Tickets Section */}
        <li
          className={activeSection === 'tickets' ? 'active' : ''}
          onClick={() => onSectionChange('tickets')}
        >
          <Link to="/tickets">Tickets</Link>
        </li>
        
        {/* Customers Section */}
        <li
          className={activeSection === 'customers' ? 'active' : ''}
          onClick={() => onSectionChange('customers')}
        >
          <Link to="/customers">Customers</Link>
        </li>

        {/* Create Ticket Button (Only visible to customers) */}
        {!isAdmin && (
          <li
            className={activeSection === 'create-ticket' ? 'active' : ''}
            onClick={() => onSectionChange('create-ticket')}
          >
            <Link to="/tickets/create">Create Ticket</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
