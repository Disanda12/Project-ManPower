import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../../api/userService';
import { registerUser } from '../../../api/authService';
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
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        user_type: 'customer'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userData = await getAllUsers();
            setUsers(userData.filter(user => user.user_type !== 'worker'));
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
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId.toString());
                notify.success('User deleted successfully');
                fetchUsers(); // Refresh the list
            } catch (error) {
                notify.error('Failed to delete user');
            }
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(newUser);
            notify.success('User created successfully');
            setShowCreateForm(false);
            setNewUser({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                user_type: 'customer'
            });
            fetchUsers(); // Refresh the list
        } catch (error) {
            notify.error('Failed to create user');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">User Management</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-[#00467f] hover:bg-[#003560] text-white font-bold py-2 px-4 rounded w-full lg:w-auto"
                >
                    {showCreateForm ? 'Cancel' : 'Create New User'}
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-8">
                    <h2 className="text-lg lg:text-xl font-bold mb-4">Create New User</h2>
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <textarea
                            placeholder="Address"
                            value={newUser.address}
                            onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full col-span-1 lg:col-span-2"
                            rows={3}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                        />
                        <select
                            value={newUser.user_type}
                            onChange={(e) => setNewUser({...newUser, user_type: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full col-span-1 lg:col-span-2"
                        >
                            Create User
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
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
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
                    {users.map((user) => (
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
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleDeleteUser(user.user_id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;