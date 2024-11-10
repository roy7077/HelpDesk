import React, { useEffect, useState } from 'react';
import '../styles/ticketthread.css';

const TicketThread = ({ ticketID, token, onClose }) => {
  const [threadEntries, setThreadEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [error, setError] = useState(null);

  // Fetch thread entries when component mounts
  useEffect(() => {
    const fetchThreadEntries = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/v1/note/getthread/${ticketID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          //console.log("thread ", data.data);
          setThreadEntries(data.data || []); // Ensure data.entries is an array
        } else {
          setError('Failed to load thread entries');
        }
      } catch (err) {
        console.error('Error fetching thread entries:', err);
        setError('Error fetching thread entries');
      }
    };

    fetchThreadEntries();
  }, [ticketID, token]);

  // Add a new entry to the thread
  const handleAddEntry = async () => {
    if (!newEntry) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/note/addnewnote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newEntry, ticketId: ticketID }),
      });

      if (response.ok) {
        const data = await response.json();
        //console.log('API Response:', data); // Log the entire response to check its structure

        if (data && data.data.content) {
          setThreadEntries((prevEntries) => [...prevEntries, data.data]);
          setNewEntry(''); // Clear the textarea after adding the entry
        } else {
          setError('Failed to add entry: Missing newEntry in response');
        }
      } else {
        setError('Failed to add new entry: Server error');
      }
    } catch (err) {
      console.error('Error adding new entry:', err);
      setError('Error adding new entry');
    }
  };

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Formats date to a human-readable string
  };

  return (
    <div className="ticket-thread">
      <button onClick={onClose}>&times; Close</button>
      <h3>Thread for Ticket ID: {ticketID}</h3>

      <div className="thread-entries">
        {Array.isArray(threadEntries) && threadEntries.length > 0 ? (
          threadEntries.map((entry, index) => {
            if (!entry || !entry.content) {
              return null; // Skip rendering invalid entries
            }

            return (
              <div key={index} className="thread-entry">
                <p>{entry.content}</p>
                <small>{formatTimestamp(entry.timestamp)}</small> {/* Display timestamp */}
              </div>
            );
          })
        ) : (
          <div>No thread entries found.</div>
        )}
      </div>

      <div className="add-entry">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Add a new update..."
        />
        <button onClick={handleAddEntry}>Add Entry</button>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default TicketThread;
