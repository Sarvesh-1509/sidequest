import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGoal from './pages/CreateGoal';
import MyGoals from './pages/MyGoals';             // <-- NEW
import CreateChallenge from './pages/CreateChallenge'; // <-- NEW
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-goal" element={<CreateGoal />} />

        {/* NEW ROUTES */}
        <Route path="/goals" element={<MyGoals />} />
        <Route path="/create-challenge/:goalId" element={<CreateChallenge />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;