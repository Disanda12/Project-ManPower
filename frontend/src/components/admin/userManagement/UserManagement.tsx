import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getAllUsers, updateUserRole, deleteUser } from '../../../api/userService';
import { notify } from '../../utils/notify';

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    user_type: string;
}

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userData = await getAllUsers();
            setUsers(userData.filter(user => user.user_type !== 'worker'));
            setCurrentPage(1);
        } catch (error) {
            notify.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await updateUserRole(userId.toString(), newRole);
            notify.success('User role updated successfully');
            fetchUsers(); // Refresh the list
        } catch (error) {
            notify.error('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        setUserToDelete(userId);
        try {
            await deleteUser(userId.toString());
            notify.success('User deleted successfully');
            fetchUsers(); // Refresh the list
            setUserToDelete(null);
        } catch (error: any) {
            setDeleteError('This customer cannot be deleted because there are workers currently assigned to their bookings. Please complete or cancel the bookings first.');
            setShowDeletePopup(true);
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirmDelete(false);
        if (userToDelete) {
            await handleDeleteUser(userToDelete);
        }
    };

    const handleForceDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.toString());
                notify.success('User deleted successfully');
                fetchUsers(); // Refresh the list
                setShowDeletePopup(false);
                setUserToDelete(null);
                setDeleteError('');
            } catch (error: any) {
                notify.error('Force delete failed: ' + error.message);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-10 pt-28">
            
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">User Management</h1>
            </div>

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
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.first_name} {user.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.user_type}
                                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDeleteUser(user.user_id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="lg:hidden">
                    {paginatedUsers.map((user) => (
                        <div key={user.user_id} className="p-4 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-600">{user.phone}</p>
                                </div>
                                <select
                                    value={user.user_type}
                                    onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    key={`desktop-role-${user.user_id}`}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setUserToDelete(user.user_id);
                                        setShowConfirmDelete(true);
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
            {users.length > itemsPerPage && (
                <div className="flex justify-between items-center px-6 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
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
            
            {/* Confirm Delete Popup */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowConfirmDelete(false);
                                    setUserToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Delete Error Popup */}
            {showDeletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Cannot Delete User</h3>
                        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                            <p className="text-red-700">{deleteError}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowDeletePopup(false);
                                    setDeleteError('');
                                    setUserToDelete(null);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;