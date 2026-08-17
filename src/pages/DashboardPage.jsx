import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/LoadingStates';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, navigate, activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📦 My Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'wishlist'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ❤️ Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-semibold"
                >
                  🚪 Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email Address</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.address || 'Not provided'}</p>
                  </div>
                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                {loading ? (
                  <LoadingSpinner />
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="font-semibold text-gray-900">{order._id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Items</p>
                            <p className="font-semibold">{order.products?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total</p>
                            <p className="font-semibold">Rs. {order.total?.toFixed(2)}</p>
                          </div>
                          <div>
                            <button className="text-blue-600 hover:text-blue-700 font-semibold">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No orders yet" />
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                <EmptyState message="Your wishlist is empty" />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <h2 className="text-2xl font-bold">Account Settings</h2>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                  <button className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg transition font-semibold">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}