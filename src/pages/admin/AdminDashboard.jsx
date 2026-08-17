import { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingStates';
import { toast } from 'react-toastify';

export function AdminNav() {
  const location = useLocation();
  const tabs = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
  ];
  return (
    <div className="flex gap-2 mb-8 border-b border-gray-200">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
            location.pathname === tab.to
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders/all'),
          api.get('/products'),
          api.get('/users'),
        ]);

        const orders = ordersRes.data.orders || [];
        const products = productsRes.data.products || [];
        const users = usersRes.data.users || [];

        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      setRecentOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
        <AdminNav />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">Rs. {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{order._id?.slice(-6)}</td>
                      <td className="px-4 py-3">{order.shippingAddress?.name || 'N/A'}</td>
                      <td className="px-4 py-3 font-semibold">Rs. {order.total?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No orders yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
}