import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/LoadingStates';
import { toast } from 'react-toastify';
import { AdminNav } from './AdminDashboard';

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/all');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Order Management</h1>
        <AdminNav />

        {loading ? (
          <LoadingSpinner />
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-3 font-mono text-xs">{order._id?.slice(-6)}</td>
                          <td className="px-6 py-3">{order.shippingAddress?.name || 'N/A'}</td>
                          <td className="px-6 py-3 font-semibold">Rs. {order.total?.toFixed(2)}</td>
                          <td className="px-6 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {selectedOrder && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20 space-y-6">
                  <h2 className="text-xl font-bold">Order Details</h2>

                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm">{selectedOrder._id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold">{selectedOrder.shippingAddress?.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress?.address}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province} {selectedOrder.shippingAddress?.postalCode}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">Order Status</p>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">Rs. {selectedOrder.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">Rs. {selectedOrder.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-semibold text-green-600">-Rs. {selectedOrder.discount?.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">Rs. {selectedOrder.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState message="No orders found" />
        )}
      </div>
    </Layout>
  );
}