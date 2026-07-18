import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function CreateGoal() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetDate: '',
        priority: 'MEDIUM',
        categoryId: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch categories when the page loads
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
                // Set default selected category to the first one in the list
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
                }
            } catch (err) {

            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/goals', formData);
            // On success, send them back to the dashboard
            navigate('/dashboard');
        } catch {
            setError('Failed to create goal. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 font-sans">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">

                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create a New Goal 🎯</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-500 hover:text-indigo-600 font-medium transition"
                    >
                        Back
                    </button>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Read 10 Books"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            name="description"
                            placeholder="Why is this important to you?"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                        <input
                            type="date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-sm transition"
                    >
                        Save Goal
                    </button>
                </form>
            </div>
        </div>
    );
}
export default CreateGoal;