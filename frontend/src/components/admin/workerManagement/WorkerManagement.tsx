import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, createUser } from '../../../api/userService';
import { getAllServices } from '../../../api/serviceService';
import { notify } from '../../utils/notify';

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    user_type: string;
    service_id?: number;
    service_name?: string;
}

const WorkerManagement: React.FC = () => {
    const [workers, setWorkers] = useState<User[]>([]);
    const [services, setServices] = useState<{service_id: number, service_name: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newWorker, setNewWorker] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        user_type: 'worker',
        service_id: '',
        experience_years: '',
        bio: '',
        profile_image: '',
        is_available: true
    });

    useEffect(() => {
        // Check if user is logged in as admin
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            notify.error('You must be logged in as an admin to access this page');
            setLoading(false);
            return;
        }
        
        fetchWorkers();
        fetchServices();
    }, []);

    const fetchWorkers = async () => {
        try {
            const userData = await getAllUsers();
            const workerData = userData.filter(user => user.user_type === 'worker');
            setWorkers(workerData);
        } catch (error: any) {
            if (error.includes('Access denied') || error.includes('Invalid token') || error.includes('Admin access required')) {
                notify.error('You must be logged in as an admin to access this page');
            } else {
                notify.error('Failed to fetch workers');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const servicesData = await getAllServices();
            setServices(servicesData);
        } catch (error) {
            // Services might not require admin access, so we'll just log the error
            console.error('Failed to fetch services:', error);
        }
    };

    const handleDeleteWorker = async (workerId: number) => {
        // Check if user is still logged in as admin
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            notify.error('You must be logged in as an admin to delete workers');
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this worker?')) {
            try {
                await deleteUser(workerId.toString());
                notify.success('Worker deleted successfully');
                fetchWorkers(); // Refresh the list
            } catch (error) {
                notify.error('Failed to delete worker');
            }
        }
    };

    const handleCreateWorker = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if user is still logged in as admin
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            notify.error('You must be logged in as an admin to create workers');
            return;
        }
        
        // Validate that service is selected
        if (!newWorker.service_id) {
            notify.error('Please select a service for the worker');
            return;
        }

        // Validate experience years if provided
        if (newWorker.experience_years && (isNaN(Number(newWorker.experience_years)) || Number(newWorker.experience_years) < 0)) {
            notify.error('Please enter a valid number of years for experience');
            return;
        }
        
        try {
            await createUser(newWorker);
            notify.success('Worker created successfully');
            setShowCreateForm(false);
            setNewWorker({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                user_type: 'worker',
                service_id: '',
                experience_years: '',
                bio: '',
                profile_image: '',
                is_available: true
            });
            fetchWorkers(); // Refresh the list
        } catch (error) {
            notify.error('Failed to create worker');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    // Check if user has admin access
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <div className="text-red-600 text-xl font-semibold mb-4">Access Denied</div>
                <div className="text-gray-600 text-center">
                    You must be logged in as an administrator to access this page.
                    <br />
                    Please log in with admin credentials to manage workers.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#00467f]">Worker Management</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-[#00467f] hover:bg-[#003560] text-white font-bold py-2 px-4 rounded"
                >
                    {showCreateForm ? 'Cancel' : 'Add New Worker'}
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Add New Worker</h2>
                    <form onSubmit={handleCreateWorker} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={newWorker.firstName}
                            onChange={(e) => setNewWorker({...newWorker, firstName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={newWorker.lastName}
                            onChange={(e) => setNewWorker({...newWorker, lastName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newWorker.email}
                            onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={newWorker.phone}
                            onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <textarea
                            placeholder="Address"
                            value={newWorker.address}
                            onChange={(e) => setNewWorker({...newWorker, address: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newWorker.password}
                            onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <select
                            value={newWorker.user_type}
                            onChange={(e) => setNewWorker({...newWorker, user_type: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="worker">Worker</option>
                        </select>
                        <select
                            value={newWorker.service_id}
                            onChange={(e) => setNewWorker({...newWorker, service_id: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Service</option>
                            {services.map((service) => (
                                <option key={service.service_id} value={service.service_id}>
                                    {service.service_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Years of Experience"
                            value={newWorker.experience_years}
                            onChange={(e) => setNewWorker({...newWorker, experience_years: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                            min="0"
                        />
                        <div className="md:col-span-2">
                            <textarea
                                placeholder="Bio (Optional)"
                                value={newWorker.bio}
                                onChange={(e) => setNewWorker({...newWorker, bio: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                rows={3}
                            />
                        </div>
                        <input
                            type="url"
                            placeholder="Profile Image URL (Optional)"
                            value={newWorker.profile_image}
                            onChange={(e) => setNewWorker({...newWorker, profile_image: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_available"
                                checked={newWorker.is_available}
                                onChange={(e) => setNewWorker({...newWorker, is_available: e.target.checked})}
                                className="mr-2"
                            />
                            <label htmlFor="is_available" className="text-sm">Available for work</label>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded md:col-span-2"
                        >
                            Add Worker
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {workers.map((worker) => (
                            <tr key={worker.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {worker.first_name} {worker.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {worker.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {worker.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {worker.service_name || 'Not Assigned'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDeleteWorker(worker.user_id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkerManagement;