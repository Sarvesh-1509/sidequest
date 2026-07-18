import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

function CreateChallenge() {
    const { goalId } = useParams(); // Grabs the ID from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalId: goalId,
        difficulty: 'MEDIUM',
        frequency: 'DAILY',
        startDate: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/challenges', formData);
            navigate('/dashboard'); // Go back to dashboard to see it due today!
        } catch {
            setError('Failed to create challenge.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 font-sans">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">

                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">New Challenge ⚔️</h2>
                    <button
                        onClick={() => navigate('/goals')}
                        className="text-gray-500 hover:text-emerald-600 font-medium transition"
                    >
                        Cancel
                    </button>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Run 5km"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Any specific rules for this challenge?"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition min-h-[80px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Leave blank for today)</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                                <option value="EPIC">Epic</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                            >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                                <option value="ONCE">Once</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg shadow-sm transition"
                    >
                        Save Challenge
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateChallenge;