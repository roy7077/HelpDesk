import React, { useState, useEffect } from 'react';
import '../styles/createticket.css'

const CreateTicket = () => {
  const [ticketData, setTicketData] = useState({
    title: '',
    status: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false); // To check if user is a customer

  useEffect(() => {
    // Simulate a check for the user's role (this could be fetched from localStorage or an API call)
    const userRole = localStorage.getItem('accountType'); // Assuming the role is stored in localStorage
    if (userRole !== 'Customer') {
      setIsCustomer(false); // If not customer, don't render the form
    } else {
      setIsCustomer(true); // If customer, render the form
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, status } = ticketData;

    // Validation
    if (!title || !status) {
      setMessage('All fields are required');
      return;
    }

    try {
      setLoading(true);

      // Make the POST request using fetch
      const token=localStorage.getItem('authToken');
      const response = await fetch('https://helpdesk-yyx0.onrender.com/api/v1/ticket/createnewticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming JWT token is in localStorage
        },
        body: JSON.stringify({ 
            title, 
            status,
            token }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Ticket created successfully!');
        setTicketData({ title: '', status: '' }); // Clear form
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isCustomer) {
    return <div>You must be a Customer to create a ticket.</div>;
  }

  return (
    <div className="create-ticket">
      <h2>Create a New Ticket</h2>

      {/* Show success/error messages */}
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Ticket Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={ticketData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Ticket Status</label>
          <select
            id="status"
            name="status"
            value={ticketData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
