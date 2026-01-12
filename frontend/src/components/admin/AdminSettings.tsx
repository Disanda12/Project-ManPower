import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Mail,
  Phone,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { notify } from '../utils/notify';

interface AdminSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bookingAlerts: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  system: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
  };
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AdminSettings>({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      bookingAlerts: true,
      systemUpdates: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    system: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC+5:30',
      dateFormat: 'DD/MM/YYYY'
    }
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'system'>('profile');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    loadSettings();
  }, []);

  const loadSettings = () => {
    // In a real app, this would fetch from API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to API
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      notify.success('Settings saved successfully!');
    } catch {
      notify.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: keyof AdminSettings['profile'], value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const updateNotifications = (field: keyof AdminSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  const updateSecurity = (field: keyof AdminSettings['security'], value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  const updateSystem = (field: keyof AdminSettings['system'], value: string) => {
    setSettings(prev => ({
      ...prev,
      system: { ...prev.system, [field]: value }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-10 md:pb-20 px-4 md:px-8">
      <div className="max-w-7xl px-4 md:px-10 mx-auto">
        
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
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Manage your account and platform preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'profile' | 'notifications' | 'security' | 'system')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm"
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.firstName}
                          onChange={(e) => updateProfile('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.lastName}
                          onChange={(e) => updateProfile('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => updateProfile('email', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={settings.profile.phone}
                            onChange={(e) => updateProfile('phone', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={settings.profile.address}
                            onChange={(e) => updateProfile('address', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                        { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'Get notified about new bookings' },
                        { key: 'systemUpdates', label: 'System Updates', desc: 'Receive system maintenance notifications' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.label}</h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key as keyof AdminSettings['notifications']] as boolean}
                              onChange={(e) => updateNotifications(item.key as keyof AdminSettings['notifications'], e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => updateSecurity('twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (days)
                        </label>
                        <select
                          value={settings.security.passwordExpiry}
                          onChange={(e) => updateSecurity('passwordExpiry', parseInt(e.target.value))}
                          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={30}>30 days</option>
                          <option value={60}>60 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>180 days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">System Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={settings.system.theme}
                          onChange={(e) => updateSystem('theme', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.system.language}
                          onChange={(e) => updateSystem('language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="si">Sinhala</option>
                          <option value="ta">Tamil</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.system.timezone}
                          onChange={(e) => updateSystem('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="UTC+5:30">Sri Lanka (UTC+5:30)</option>
                          <option value="UTC+0">GMT (UTC+0)</option>
                          <option value="UTC+1">CET (UTC+1)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Format
                        </label>
                        <select
                          value={settings.system.dateFormat}
                          onChange={(e) => updateSystem('dateFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;