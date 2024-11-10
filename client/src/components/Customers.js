import React, { useEffect, useState } from 'react';
import '../styles/customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // Example: set to true for admin users

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/user/customers');
        const data = await response.json();
        
        if (response.ok && data.customers) {
          setCustomers(data.customers);
        } else {
          throw new Error('Failed to fetch customers');
        }
      } catch (err) {
        setError('Error fetching customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setUpdatedCustomer({ ...customer }); // Pre-fill the form with customer data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomer(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!updatedCustomer) return;

    const token = localStorage.getItem('authToken');  // or sessionStorage depending on your setup
    updatedCustomer.token=token;
    //console.log(updatedCustomer)
    try {
      const response = await fetch(`http://localhost:8080/api/v1/user/updateprofile/${updatedCustomer._id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Add this header for authentication
        },
        body: JSON.stringify(updatedCustomer),
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.id === updatedData.id ? updatedData : customer
          )
        );
        setSelectedCustomer(null); // Close the edit form
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    }
  };

  const filteredCustomers = (customers || []).filter(customer => 
    (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="customers-container">
      <h2>Customer List</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="customers-list">
        {filteredCustomers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account Type</th>
              </tr>
            </thead>
            <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={customer.id || `${customer.name}-${index}`} onClick={() => isAdmin && handleEditClick(customer)}>
                <td>{customer.userName}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.accountType}</td>
              </tr>
            ))}

            </tbody>
          </table>
        )}
      </div>

      {selectedCustomer && isAdmin && (
        <div className="edit-profile-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedCustomer(null)}>×</button>
            <h3>Edit Profile</h3>
            <p>Update your profile details below.</p>
            <form id="edit-profile-form">
              <label htmlFor="userName">Full Name</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={updatedCustomer.userName || ''}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedCustomer.email || ''}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={updatedCustomer.phoneNumber || ''}
                onChange={handleInputChange}
                required
              />

              {isAdmin && (
                <>
                  <label htmlFor="accountType">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={updatedCustomer.accountType || ''}
                    onChange={handleInputChange}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </>
              )}

              <div className="button-group">
                <button type="button" onClick={handleUpdateProfile}>Save Changes</button>
                <button type="button" onClick={() => setSelectedCustomer(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
