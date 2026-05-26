import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Clock, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/tasks`);
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting task');
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const { data } = await axios.put(`${API_URL}/tasks/${task._id}`, {
        ...task,
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? data : t)));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="loading" style={{ color: 'var(--danger)' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Your Tasks</h2>
      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', opacity: 0.7 }}>
          No tasks found. Create one above!
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="card">
            <div className="task-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleStatus(task)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.status === 'completed' ? 'var(--success)' : 'var(--text-muted)' }}
                  title="Toggle Status"
                >
                  {task.status === 'completed' ? <CheckCircle size={24} /> : <Clock size={24} />}
                </button>
                <div>
                  <h3 className="task-title" style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                    {task.title}
                  </h3>
                  <span className={`badge ${task.status}`}>{task.status}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(task._id)}
                className="btn-danger"
                style={{ border: 'none', cursor: 'pointer' }}
                title="Delete task"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <p className="task-desc" style={{ marginTop: '1rem', paddingLeft: '2.25rem' }}>{task.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
