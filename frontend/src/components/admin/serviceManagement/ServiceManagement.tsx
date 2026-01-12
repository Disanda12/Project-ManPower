import React, { useState, useEffect } from 'react';
import { getAllServices, addService, updateService, deleteService } from '../../../api/serviceService';
import { notify } from '../../utils/notify';

interface Service {
    service_id: number;
    service_name: string;
    description?: string;
    daily_rate_lkr: number;
    advance_percentage: number;
    is_available: boolean;
    created_at?: string;
}

const ServiceManagement: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [newService, setNewService] = useState({
        service_name: '',
        description: '',
        daily_rate_lkr: '',
        advance_percentage: '25.00',
        is_available: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const serviceData = await getAllServices();
            setServices(serviceData);
            setCurrentPage(1);
        } catch (error) {
            notify.error('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!newService.service_name.trim()) {
            notify.error('Service name is required');
            return;
        }

        const dailyRate = parseFloat(newService.daily_rate_lkr);
        if (isNaN(dailyRate) || dailyRate <= 0) {
            notify.error('Please enter a valid daily rate');
            return;
        }

        const advancePercentage = parseFloat(newService.advance_percentage);
        if (isNaN(advancePercentage) || advancePercentage < 0 || advancePercentage > 100) {
            notify.error('Please enter a valid advance percentage (0-100)');
            return;
        }

        try {
            await addService({
                service_name: newService.service_name.trim(),
                description: newService.description.trim() || undefined,
                daily_rate_lkr: dailyRate,
                advance_percentage: advancePercentage,
                is_available: newService.is_available
            });
            notify.success('Service created successfully');
            setShowCreateForm(false);
            setNewService({
                service_name: '',
                description: '',
                daily_rate_lkr: '',
                advance_percentage: '25.00',
                is_available: true
            });
            fetchServices();
        } catch (error) {
            notify.error('Failed to create service');
        }
    };

    const handleUpdateService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        console.log('Updating service:', editingService.service_id);

        // Validation
        if (!newService.service_name.trim()) {
            notify.error('Service name is required');
            return;
        }

        const dailyRate = parseFloat(newService.daily_rate_lkr);
        if (isNaN(dailyRate) || dailyRate <= 0) {
            notify.error('Please enter a valid daily rate');
            return;
        }

        const advancePercentage = parseFloat(newService.advance_percentage);
        if (isNaN(advancePercentage) || advancePercentage < 0 || advancePercentage > 100) {
            notify.error('Please enter a valid advance percentage (0-100)');
            return;
        }

        try {
            const updateData = {
                service_name: newService.service_name.trim(),
                description: newService.description.trim() || undefined,
                daily_rate_lkr: dailyRate,
                advance_percentage: advancePercentage,
                is_available: newService.is_available
            };
            console.log('Update data:', updateData);

            await updateService(editingService.service_id, updateData);
            notify.success('Service updated successfully');
            setEditingService(null);
            setNewService({
                service_name: '',
                description: '',
                daily_rate_lkr: '',
                advance_percentage: '25.00',
                is_available: true
            });
            fetchServices();
        } catch (error: any) {
            console.error('Update error:', error);
            notify.error(error.response?.data?.message || 'Failed to update service');
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await deleteService(serviceId);
            notify.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            notify.error('Failed to delete service');
        }
    };

    const startEdit = (service: Service) => {
        console.log('Starting edit for service:', service);
        setEditingService(service);
        setShowCreateForm(false); // Ensure create form is hidden when editing
        setNewService({
            service_name: service.service_name,
            description: service.description || '',
            daily_rate_lkr: service.daily_rate_lkr.toString(),
            advance_percentage: service.advance_percentage.toString(),
            is_available: service.is_available
        });
        console.log('Form data set to:', {
            service_name: service.service_name,
            description: service.description || '',
            daily_rate_lkr: service.daily_rate_lkr.toString(),
            advance_percentage: service.advance_percentage.toString(),
            is_available: service.is_available
        });
    };

    const cancelEdit = () => {
        setEditingService(null);
        setNewService({
            service_name: '',
            description: '',
            daily_rate_lkr: '',
            advance_percentage: '25.00',
            is_available: true
        });
    };

    const handleViewServiceDetails = (service: Service) => {
        setSelectedService(service);
    };

    const handleCloseDetails = () => {
        setSelectedService(null);
    };

    const totalPages = Math.ceil(services.length / itemsPerPage);
    const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-base sm:text-lg">Loading services...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Service Management</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    disabled={editingService !== null}
                    className={`bg-[#00467f] hover:bg-[#003560] text-white font-bold py-2 px-4 rounded w-full lg:w-auto transition duration-200 ${
                        editingService !== null ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {showCreateForm ? 'Cancel' : 'Add New Service'}
                </button>
            </div>

            {/* Create/Edit Form */}
            {(showCreateForm || editingService) && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">
                        {editingService ? 'Edit Service' : 'Create New Service'}
                    </h2>
                    <form onSubmit={(e) => {
                        console.log('Form submitted, editingService:', editingService);
                        if (editingService) {
                            handleUpdateService(e);
                        } else {
                            handleCreateService(e);
                        }
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    value={newService.service_name}
                                    onChange={(e) => setNewService({...newService, service_name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Daily Rate (LKR) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newService.daily_rate_lkr}
                                    onChange={(e) => setNewService({...newService, daily_rate_lkr: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Advance Percentage (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={newService.advance_percentage}
                                    onChange={(e) => setNewService({...newService, advance_percentage: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Available
                                </label>
                                <select
                                    value={newService.is_available ? "true" : "false"}
                                    onChange={(e) => setNewService({...newService, is_available: e.target.value === 'true'})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={newService.description}
                                onChange={(e) => setNewService({...newService, description: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-2">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base"
                            >
                                {editingService ? 'Update Service' : 'Create Service'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (editingService) {
                                        cancelEdit();
                                    } else {
                                        setShowCreateForm(false);
                                    }
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Services List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">

                {/* Mobile Card Layout */}
                <div className="block md:hidden">
                    {paginatedServices.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            No services found. Create your first service above.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {paginatedServices.map((service) => (
                                <div key={service.service_id} onClick={() => handleViewServiceDetails(service)} className="p-4 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-base font-medium text-gray-900">
                                                {service.service_name}
                                            </h3>
                                            {service.description && (
                                                <p className="text-base text-gray-500 mt-1">
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                                            service.is_available
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {service.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-base text-gray-600 mb-3">
                                        <span>Daily Rate: <span className="font-medium">LKR {service.daily_rate_lkr.toLocaleString()}</span></span>
                                        <span>Advance: <span className="font-medium">{service.advance_percentage}%</span></span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log('Edit button clicked for service:', service);
                                                startEdit(service);
                                            }}
                                            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-base"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteService(service.service_id);
                                            }}
                                            className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-base"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Daily Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Advance %
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedServices.map((service) => (
                                <tr key={service.service_id} onClick={() => handleViewServiceDetails(service)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-base font-medium text-gray-900">
                                                {service.service_name}
                                            </div>
                                            {service.description && (
                                                <div className="text-base text-gray-500">
                                                    {service.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                                        LKR {service.daily_rate_lkr.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                                        {service.advance_percentage}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            service.is_available
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {service.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log('Edit button clicked for service:', service);
                                                startEdit(service);
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteService(service.service_id);
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {paginatedServices.length === 0 && (
                        <div className="px-6 py-4 text-center text-gray-500">
                            No services found. Create your first service above.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {services.length > itemsPerPage && (
                <div className="flex justify-between items-center px-6 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, services.length)} of {services.length} services
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

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#00467f]">Service Details</h2>
                                <button
                                    onClick={handleCloseDetails}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service Name</label>
                                    <p className="text-gray-900">{selectedService.service_name}</p>
                                </div>
                                {selectedService.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <p className="text-gray-900 whitespace-pre-wrap">{selectedService.description}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
                                    <p className="text-gray-900">LKR {selectedService.daily_rate_lkr.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Advance Percentage</label>
                                    <p className="text-gray-900">{selectedService.advance_percentage}%</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        selectedService.is_available
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedService.is_available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service ID</label>
                                    <p className="text-gray-900">{selectedService.service_id}</p>
                                </div>
                                {selectedService.created_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                                        <p className="text-gray-900">{new Date(selectedService.created_at).toLocaleDateString()}</p>
                                    </div>
                                )}
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

export default ServiceManagement;