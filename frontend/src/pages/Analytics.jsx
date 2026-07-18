import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                setData(response.data);
                setLoading(false);
            } catch (err) {

                setError("Failed to load analytics data.");
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500 font-sans bg-gray-50">
                Loading Analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-500 font-sans bg-gray-50 px-4">
                <p className="text-lg font-semibold">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Prepare statistics calculation
    const totalCompleted = data.totalCompleted || 0;
    const totalXp = data.totalXpEarned || 0;
    
    // Sort completions by date descending for timeline display
    const sortedDates = Object.entries(data.completionsByDate || {})
        .sort((a, b) => b[0].localeCompare(a[0]));

    // Helper to calculate percentages for distributions
    const getPercent = (count) => {
        if (totalCompleted === 0) return 0;
        return Math.round((count / totalCompleted) * 100);
    };

    // Extract difficulties list
    const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EPIC'];
    const difficultyCounts = data.difficultyBreakdown || {};

    // Get color classes for difficulty badges
    const getDifficultyStyles = (diff) => {
        switch (diff) {
            case 'EASY': return { bar: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-100' };
            case 'MEDIUM': return { bar: 'bg-indigo-500', text: 'text-indigo-700', badge: 'bg-indigo-50 border-indigo-100' };
            case 'HARD': return { bar: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 border-amber-100' };
            case 'EPIC': return { bar: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 border-rose-100' };
            default: return { bar: 'bg-gray-500', text: 'text-gray-700', badge: 'bg-gray-50 border-gray-100' };
        }
    };

    // Format timestamps to human-readable format
    const formatCompletionTime = (dateTimeStr) => {
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateTimeStr;
        }
    };

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
                        <button onClick={() => navigate('/goals')} className="text-gray-600 hover:text-indigo-600 font-medium transition">My Goals</button>
                        <button onClick={() => navigate('/analytics')} className="text-indigo-600 font-semibold transition">Analytics</button>
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
            <main className="max-w-5xl mx-auto mt-10 px-6 pb-24">

                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Analytics & History</h2>
                    <p className="text-gray-500 mt-1">Review your completed milestones, experience earned, and quest statistics.</p>
                </div>

                {/* High-Level Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                        <span className="text-gray-500 text-sm font-medium">Completed Quests</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                            <span className="text-4xl font-extrabold text-gray-900">{totalCompleted}</span>
                            <span className="text-gray-500 font-medium">Challenges ✅</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                        <span className="text-gray-500 text-sm font-medium">Total Experience</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                            <span className="text-4xl font-extrabold text-indigo-700">{totalXp}</span>
                            <span className="text-gray-500 font-medium">XP Earned ⚡</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                        <span className="text-gray-500 text-sm font-medium">Avg Experience / Challenge</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                            <span className="text-4xl font-extrabold text-emerald-600">
                                {totalCompleted > 0 ? Math.round(totalXp / totalCompleted) : 0}
                            </span>
                            <span className="text-gray-500 font-medium">XP 📈</span>
                        </div>
                    </div>
                </div>

                {/* Distribution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    
                    {/* Difficulty Distribution Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-5">Completions by Difficulty</h3>
                        {totalCompleted === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                No completions recorded.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {difficulties.map(diff => {
                                    const count = difficultyCounts[diff] || 0;
                                    const percent = getPercent(count);
                                    const styles = getDifficultyStyles(diff);
                                    return (
                                        <div key={diff}>
                                            <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                                <span>{diff}</span>
                                                <span>{count} ({percent}%)</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${styles.bar} rounded-full transition-all duration-700 ease-out`}
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Category Distribution Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-5">Completions by Category</h3>
                        {totalCompleted === 0 || Object.keys(data.categoryBreakdown || {}).length === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                No completions recorded.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                                {Object.entries(data.categoryBreakdown || {}).map(([cat, count]) => {
                                    const percent = getPercent(count);
                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                                <span>{cat}</span>
                                                <span>{count} ({percent}%)</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline and History Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Timeframe Activity Timeline */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Completion Activity</h3>
                        {sortedDates.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                No activity recorded yet.
                            </div>
                        ) : (
                            <div className="relative border-l border-gray-200 ml-2 space-y-6 max-h-[350px] overflow-y-auto pr-1">
                                {sortedDates.map(([dateStr, count]) => (
                                    <div key={dateStr} className="mb-4 ml-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-50 rounded-full -left-3 ring-8 ring-white">
                                            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></span>
                                        </span>
                                        <time className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">{dateStr}</time>
                                        <p className="text-base font-semibold text-gray-800 mt-0.5">
                                            Completed <span className="text-indigo-600 font-bold">{count}</span> {count === 1 ? 'challenge' : 'challenges'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Completion History Log */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-semibold text-gray-800">Completion History Feed</h3>
                        </div>

                        <div className="p-6 flex-1 max-h-[350px] overflow-y-auto">
                            {data.recentCompletions?.length === 0 ? (
                                <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    No completions yet. Start finishing challenges on your dashboard!
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {data.recentCompletions?.map(item => {
                                        const styles = getDifficultyStyles(item.difficulty);
                                        return (
                                            <li key={item.id} className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition bg-white shadow-sm">
                                                <div>
                                                    <strong className="text-gray-900 text-base block">{item.title}</strong>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.goalTitle}</span>
                                                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${styles.badge} ${styles.text}`}>
                                                            {item.difficulty}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{formatCompletionTime(item.completedAt)}</span>
                                                    </div>
                                                </div>
                                                <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                                                    +{item.xpEarned} XP
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default Analytics;
