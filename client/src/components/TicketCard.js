import React, { useState, useEffect } from 'react';
import '../styles/ticketcard.css';

const TicketCard = ({ ticket, onStatusChange, onOpenTicketThread }) => {
    const [status, setStatus] = useState(ticket.status); // Track the current status
    const [isAuthorized, setIsAuthorized] = useState(false); // For checking if user can update status

    // Fetch the current user's role to check if they are an Admin or Service Agent
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                
                const accountType=localStorage.getItem('accountType');

                //console.log(accountType);

                if (accountType && (accountType === 'Service Agent' || accountType === 'Admin')) {
                    setIsAuthorized(true); // If user is authorized, they can change status
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setIsAuthorized(false);
            }
        };

        fetchUserRole();
    }, []);

    // Handle status change (dropdown or button)
    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);

        // Make an API call to update the status if the user is authorized
        if (isAuthorized) {
            try {
                const response = await fetch('http://localhost:8080/api/v1/ticket/updateticketstatus', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticketId: ticket.ticketID,  // Send ticket ID in the request body
                        newStatus: newStatus,  // Send the new status
                    }),
                });
        
                const data = await response.json();  // Parse the JSON response
        
                if (response.ok) {
                    onStatusChange(ticket.ticketID, newStatus);  // Update status locally
                } else {
                    console.error('Error updating status:', data.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error updating status:', error.message);
            }
        }
    };

    return (
        <div className="ticket-card" onClick={() => onOpenTicketThread(ticket.ticketID)}>
            <div className="ticket-id">{ticket.ticketID}</div>
            <div className="ticket-title">{ticket.title}</div>
            <div className={`ticket-status ${status.toLowerCase()}`}>
                {/* Only render dropdown if the user is authorized */}
                {isAuthorized ? (
                    <div className="status-dropdown-container">
                        <select value={status} onChange={handleStatusChange} className="status-dropdown">
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                ) : (
                    <div className="status-info">Status: {status}</div>
                )}
            </div>
            <div className="ticket-customer">{ticket.customerName || 'N/A'}</div>
            <div className="ticket-date">
                {new Date(ticket.lastUpdatedOn).toLocaleDateString()}
            </div>
        </div>
    );
};

export default TicketCard;
