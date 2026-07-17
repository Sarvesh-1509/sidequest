import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
            setLoading(false);
        } catch (error) {

            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCompleteChallenge = async (id) => {
        try {
            await api.post(`/challenges/${id}/complete`);
            fetchDashboardData();
        } catch (error) {

        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading Dashboard...</div>;

    const xpNeeded = (dashboardData?.currentLevel || 1) * 100;
    const progressPercent = Math.min(((dashboardData?.currentXp || 0) / xpNeeded) * 100, 100);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-8">
                    {/* Logo (Clickable) */}
                    <div onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
                        <span className="text-2xl">⚔️</span>
                        <h1 className="text-xl font-bold text-indigo-900 tracking-tight">SideQuest</h1>
                    </div>
                    {/* Navigation Buttons (Moved to left) */}
                    <div className="flex items-center space-x-6">
                        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 font-semibold transition">Dashboard</button>
                        <button onClick={() => navigate('/goals')} className="text-gray-600 hover:text-indigo-600 font-medium transition">My Goals</button>
                        <button onClick={() => navigate('/analytics')} className="text-gray-600 hover:text-indigo-600 font-medium transition">Analytics</button>
                    </div>
                </div>
                {/* User Info & Logout (Kept on right) */}
                <div className="flex items-center space-x-6">
                    <span className="text-gray-700">Hello, <span className="font-semibold text-indigo-700">{dashboardData?.name}</span></span>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition flex items-center space-x-1">
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto mt-10 px-6">

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-500 mt-1">Track your progress and complete today's challenges.</p>
                    </div>
                    <button
                        onClick={() => navigate('/create-goal')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
                    >
                        + Create Goal
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                    {/* Level Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-gray-500 font-medium">Current Level</h3>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
                                Lvl {dashboardData?.currentLevel}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
                            <span>XP Progress</span>
                            <span>{dashboardData?.currentXp} / {xpNeeded} XP</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                        <h3 className="text-gray-500 font-medium mb-1">Current Streak</h3>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-extrabold text-gray-900">{dashboardData?.currentStreak}</span>
                            <span className="text-gray-500 font-medium">Days 🔥</span>
                        </div>
                    </div>
                </div>

                {/* Challenges Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-800">Today's Challenges</h3>
                    </div>

                    <div className="p-6">
                        {dashboardData?.todaysChallenges?.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                No challenges due today. Enjoy your rest, or create a new goal!
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {dashboardData?.todaysChallenges?.map(challenge => (
                                    <li key={challenge.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:border-indigo-100 hover:shadow-sm transition bg-white">
                                        <div>
                                            <strong className="text-gray-900 text-lg block">{challenge.title}</strong>
                                            <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{challenge.goalTitle}</span>
                                                <span className="text-emerald-600 font-medium">+{challenge.xpReward} XP</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCompleteChallenge(challenge.id)}
                                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-md font-medium transition"
                                        >
                                            Complete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;