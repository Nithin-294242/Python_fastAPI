import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'Low',
    created_by: ''
  });

  const fetchTickets = async (status = '') => {
    setLoading(true);
    setError('');
    try {
      const url = status ? `${API_URL}/tickets?status=${status}` : `${API_URL}/tickets`;
      const response = await fetch(url);
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch tickets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchTickets(status);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to create ticket');
      }
      setFormData({ title: '', category: '', priority: 'Low', created_by: '' });
      setShowForm(false);
      fetchTickets(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setError('');
    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to update ticket');
      }
      fetchTickets(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    setError('');
    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete ticket');
      fetchTickets(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  const getPriorityColor = (priority) => {
    return { High: '#d32f2f', Medium: '#f57c00', Low: '#388e3c' }[priority] || '#999';
  };

  return (
    <div className="container">
      <h1>Helpdesk Tickets</h1>

      {error && <div className="error-banner">{error}</div>}

      <div className="controls">
        <div className="filter-buttons">
          <button
            className={!statusFilter ? 'active' : ''}
            onClick={() => handleFilterChange('')}
          >
            All
          </button>
          <button
            className={statusFilter === 'Open' ? 'active' : ''}
            onClick={() => handleFilterChange('Open')}
          >
            Open
          </button>
          <button
            className={statusFilter === 'In Progress' ? 'active' : ''}
            onClick={() => handleFilterChange('In Progress')}
          >
            In Progress
          </button>
          <button
            className={statusFilter === 'Closed' ? 'active' : ''}
            onClick={() => handleFilterChange('Closed')}
          >
            Closed
          </button>
        </div>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Ticket'}
        </button>
      </div>

      {showForm && (
        <form className="ticket-form" onSubmit={handleCreateTicket}>
          <input
            type="text"
            placeholder="Title (min 5 characters)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="text"
            placeholder="Created by"
            value={formData.created_by}
            onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
            required
          />
          <button type="submit">Create Ticket</button>
        </form>
      )}

      {loading && <p className="loading">Loading tickets...</p>}

      {!loading && tickets.length === 0 && <p className="no-data">No tickets found</p>}

      {!loading && tickets.length > 0 && (
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="id-cell">{ticket.id.slice(0, 8)}</td>
                <td>{ticket.title}</td>
                <td>{ticket.category}</td>
                <td>
                  <span className="priority" style={{ backgroundColor: getPriorityColor(ticket.priority) }}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                    disabled={ticket.status === 'Closed'}
                    className="status-select"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>{ticket.created_by}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTicket(ticket.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
