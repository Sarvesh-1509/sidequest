import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function MyGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await api.get('/goals');
                setGoals(response.data);
                setLoading(false);
            } catch (error) {

                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this goal and all its challenges?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/goals/${id}`);
            // Instantly remove it from the UI without reloading the page
            setGoals(goals.filter(goal => goal.id !== id));
        } catch (error) {

            alert("Failed to delete goal. Check terminal for errors.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500 font-sans bg-gray-50">
                Loading Goals...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
                    {/* Logo (Clickable) */}
                    <div onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
                        <span className="text-2xl">⚔️</span>
                        <h1 className="text-xl font-bold text-indigo-900 tracking-tight">SideQuest</h1>
                    </div>
                    {/* Navigation Buttons (Moved to left) */}
                    <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-center">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium transition">Dashboard</button>
                        <button onClick={() => navigate('/goals')} className="text-indigo-600 font-semibold transition">My Goals</button>
                        <button onClick={() => navigate('/analytics')} className="text-gray-600 hover:text-indigo-600 font-medium transition">Analytics</button>
                    </div>
                </div>
                {/* User Info & Logout (Kept on right) */}
                <div className="flex items-center space-x-4 sm:space-x-6">
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition flex items-center space-x-1">
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto mt-10 px-6">

                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">My Goals</h2>
                        <p className="text-gray-500 mt-1">Manage your active quests and challenges.</p>
                    </div>
                    <button
                        onClick={() => navigate('/create-goal')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition w-full sm:w-auto"
                    >
                        + Create Goal
                    </button>
                </div>

                {goals.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm px-6">
                        <span className="text-4xl block mb-4">🏆</span>
                        <p className="text-lg font-semibold text-gray-700">You haven't set any goals yet.</p>
                        <p className="text-gray-500 mt-1 mb-6">Time to start your SideQuest!</p>
                        <button
                            onClick={() => navigate('/create-goal')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition inline-block"
                        >
                            Create Your First Goal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {goals.map(goal => {
                            // Style priority badge based on priority level
                            let priorityBadgeClass = "bg-gray-100 text-gray-800 border-gray-200";
                            if (goal.priority === "HIGH") {
                                priorityBadgeClass = "bg-rose-50 text-rose-700 border-rose-100";
                            } else if (goal.priority === "MEDIUM") {
                                priorityBadgeClass = "bg-amber-50 text-amber-700 border-amber-100";
                            } else if (goal.priority === "LOW") {
                                priorityBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
                            }

                            return (
                                <div key={goal.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <h3 className="font-bold text-lg text-gray-900 tracking-tight leading-snug">{goal.title}</h3>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityBadgeClass}`}>
                                                {goal.priority}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-4 min-h-[40px] line-clamp-3">
                                            {goal.description || "No description provided."}
                                        </p>

                                        <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-400">Category</span>
                                                <span className="bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded text-xs">
                                                    {goal.category?.name || "Uncategorized"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-400">Target Date</span>
                                                <span className="text-gray-700 font-medium">{goal.targetDate || "No date set"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 pt-2 space-y-2">
                                        <button
                                            onClick={() => navigate(`/create-challenge/${goal.id}`)}
                                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 px-4 py-2.5 rounded-lg font-medium transition text-sm flex items-center justify-center space-x-1"
                                        >
                                            <span>+ Add Challenge</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="w-full bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 hover:border-rose-100 px-4 py-2 rounded-lg font-medium transition text-xs"
                                        >
                                            Delete Goal
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyGoals;