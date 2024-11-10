import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TicketCard from './TicketCard';
import TicketThread from './TicketThread';
import '../styles/tickets.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      setError('User information not available.');
      setLoading(false);
      return;
    }

    const fetchTickets = async () => {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        let response;
        if (user.accountType === 'Admin' || user.accountType === 'Service Agent') {
          response = await fetch('http://localhost:8080/api/v1/ticket/viewalltickets', {
            method: 'POST',
            headers: config.headers,
          });
        } else {
            response = await fetch('http://localhost:8080/api/v1/ticket/showtickets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Ensure this is set correctly
              'Authorization': `Bearer ${token}`, // If you're sending the token in Authorization header
            },
            body: JSON.stringify({ token }) // Send token as part of the request body
          });
        }

        if (response.ok) {
          const data = await response.json();
          setTickets(data.data);
        } else {
          setError('Failed to fetch tickets');
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Error fetching tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, token]);

  const handleOpenTicketThread = (ticketID) => {
    setSelectedTicket(ticketID);
  };

  const handleCloseThread = () => {
    setSelectedTicket(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tickets-container">
      <h2>Tickets</h2>

      <div className="tickets-list">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.ticketID}
            ticket={ticket}
            onOpenTicketThread={handleOpenTicketThread}
          />
        ))}
      </div>

      {selectedTicket && (
        <TicketThread
          ticketID={selectedTicket}
          token={token}
          onClose={handleCloseThread}
        />
      )}
    </div>
  );
};

export default Tickets;

