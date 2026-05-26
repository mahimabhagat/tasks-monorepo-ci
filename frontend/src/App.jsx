import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle } from 'lucide-react';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';

function App() {
  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <LayoutDashboard size={28} color="#818cf8" />
          <span>TaskFlow</span>
        </div>
        <nav>
          <Link to="/" className="btn btn-outline" style={{ marginRight: '0.5rem' }}>
            Tasks
          </Link>
          <Link to="/create" className="btn btn-primary">
            <PlusCircle size={18} />
            New Task
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/create" element={<CreateTask />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
