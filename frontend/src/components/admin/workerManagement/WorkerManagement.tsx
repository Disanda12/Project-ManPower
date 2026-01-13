import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getAllUsers, deleteUser, createUser, updateUser } from '../../../api/UserService';
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
    const navigate = useNavigate();
    const [workers, setWorkers] = useState<User[]>([]);
    const [services, setServices] = useState<{service_id: number, service_name: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingWorker, setEditingWorker] = useState<User | null>(null);
    const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
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
        is_available: true
    });

    useEffect(() => {
        // Check if user is logged in as admin
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            navigate('/login');
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
            setCurrentPage(1);
        } catch (error: any) {
            if (error.includes('Access denied') || error.includes('Invalid token') || error.includes('Admin access required')) {
                navigate('/login');
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

    const handleEditWorker = (worker: User) => {
        setEditingWorker(worker);
        setNewWorker({
            firstName: worker.first_name,
            lastName: worker.last_name,
            email: worker.email,
            phone: worker.phone,
            address: worker.address,
            password: '', // Don't populate password for security
            user_type: worker.user_type,
            service_id: worker.service_id?.toString() || '',
            experience_years: '', // Assuming not stored, or add if available
            bio: '', // Assuming not stored
            is_available: (worker as { is_available?: boolean }).is_available ?? true
        });
        setShowCreateForm(true);
    };

    const handleViewWorkerDetails = (worker: User) => {
        setSelectedWorker(worker);
    };

    const handleCloseDetails = () => {
        setSelectedWorker(null);
    };

    const handleDeleteWorker = async (workerId: number) => {
        // Check if user is still logged in as admin
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            navigate('/login');
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

    const handleSubmitWorker = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if user is still logged in as admin
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            navigate('/login');
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
            if (editingWorker) {
                // Update existing worker - exclude password if empty
                const updateData = { ...newWorker };
                if (!updateData.password) {
                    delete updateData.password;
                }
                await updateUser(editingWorker.user_id.toString(), updateData);
                notify.success('Worker updated successfully');
            } else {
                // Create new worker
                await createUser(newWorker);
                notify.success('Worker created successfully');
            }
            setShowCreateForm(false);
            setEditingWorker(null);
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
                is_available: true
            });
            fetchWorkers(); // Refresh the list
        } catch (error) {
            notify.error(editingWorker ? 'Failed to update worker' : 'Failed to create worker');
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

    const totalPages = Math.ceil(workers.length / itemsPerPage);
    const paginatedWorkers = workers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
            
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Dashboard</span>
                </button>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Worker Management</h1>
                <button
                    onClick={() => {
                        if (showCreateForm && editingWorker) {
                            setEditingWorker(null);
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
                                is_available: true
                            });
                        }
                        setShowCreateForm(!showCreateForm);
                    }}
                    className="bg-[#00467f] hover:bg-[#003560] text-white font-bold py-2 px-4 rounded w-full lg:w-auto"
                >
                    {showCreateForm ? 'Cancel' : 'Add New Worker'}
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-8">
                    <h2 className="text-lg lg:text-xl font-bold mb-4">{editingWorker ? 'Edit Worker' : 'Add New Worker'}</h2>
                    <form onSubmit={handleSubmitWorker} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={newWorker.firstName}
                            onChange={(e) => setNewWorker({...newWorker, firstName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={newWorker.lastName}
                            onChange={(e) => setNewWorker({...newWorker, lastName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newWorker.email}
                            onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={newWorker.phone}
                            onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <textarea
                            placeholder="Address"
                            value={newWorker.address}
                            onChange={(e) => setNewWorker({...newWorker, address: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full col-span-1 lg:col-span-2"
                            rows={3}
                            required
                        />
                        <input
                            type="password"
                            placeholder={editingWorker ? "Password (leave blank to keep current)" : "Password"}
                            value={newWorker.password}
                            onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required={!editingWorker}
                        />
                        <select
                            value={newWorker.user_type}
                            onChange={(e) => setNewWorker({...newWorker, user_type: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        >
                            <option value="worker">Worker</option>
                        </select>
                        <select
                            value={newWorker.service_id}
                            onChange={(e) => setNewWorker({...newWorker, service_id: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
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
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            min="0"
                        />
                        <div className="lg:col-span-2">
                            <textarea
                                placeholder="Bio (Optional)"
                                value={newWorker.bio}
                                onChange={(e) => setNewWorker({...newWorker, bio: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center col-span-1 lg:col-span-2">
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
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full col-span-1 lg:col-span-2"
                        >
                            {editingWorker ? 'Update Worker' : 'Add Worker'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Desktop Table */}
                <table className="hidden lg:table min-w-full divide-y divide-gray-200">
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
                        {paginatedWorkers.map((worker) => (
                            <tr key={worker.user_id} onClick={() => handleViewWorkerDetails(worker)} className="cursor-pointer hover:bg-gray-50">
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
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click
                                                handleEditWorker(worker);
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click
                                                handleDeleteWorker(worker.user_id);
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="lg:hidden">
                    {paginatedWorkers.map((worker) => (
                        <div key={worker.user_id} onClick={() => handleViewWorkerDetails(worker)} className="p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {worker.first_name} {worker.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{worker.email}</p>
                                    <p className="text-sm text-gray-600">{worker.phone}</p>
                                    <span className="inline-block mt-2 px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {worker.service_name || 'Not Assigned'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click
                                        handleEditWorker(worker);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click
                                        handleDeleteWorker(worker.user_id);
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {workers.length > itemsPerPage && (
                <div className="flex justify-between items-center px-6 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, workers.length)} of {workers.length} workers
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Worker Details Modal */}
            {selectedWorker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#00467f]">Worker Details</h2>
                                <button
                                    onClick={handleCloseDetails}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <p className="text-gray-900">{selectedWorker.first_name} {selectedWorker.last_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-gray-900">{selectedWorker.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <p className="text-gray-900">{selectedWorker.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedWorker.address}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                                    <p className="text-gray-900 capitalize">{selectedWorker.user_type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service</label>
                                    <p className="text-gray-900">{selectedWorker.service_name || 'Not Assigned'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Worker ID</label>
                                    <p className="text-gray-900">{selectedWorker.user_id}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleCloseDetails}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerManagement;