import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, updateOrderStatus } from '../../redux/slices/orderSlice';
import {
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft
} from 'react-icons/fi';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order, isLoading } = useSelector((state) => state.orders);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'paid': return 'bg-green-100 text-green-700 border-green-300';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'delivered': return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-5 h-5" />;
      case 'paid': return <FiCheckCircle className="w-5 h-5" />;
      case 'processing': return <FiPackage className="w-5 h-5" />;
      case 'shipped': return <FiTruck className="w-5 h-5" />;
      case 'delivered': return <FiCheckCircle className="w-5 h-5" />;
      case 'cancelled': return <FiXCircle className="w-5 h-5" />;
      default: return <FiClock className="w-5 h-5" />;
    }
  };

  const handleStatusUpdate = () => {
    if (selectedStatus !== order.status) {
      dispatch(updateOrderStatus({ id, status: selectedStatus, note }));
      setNote('');
    }
  };

  if (isLoading || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <button
        onClick={() => navigate('/admin/orders')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6"
      >
        <FiArrowLeft /> Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiPackage className="text-pink-600" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">MWK {(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">MWK {item.price.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>MWK {order.itemsPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>MWK {order.shippingPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>MWK {order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Status History</h2>
              <div className="space-y-3">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getStatusColor(history.status)}`}>
                      {getStatusIcon(history.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold capitalize">{history.status}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(history.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {history.note && (
                        <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Add a note about this status update..."
                />
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={selectedStatus === order.status}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiUser className="text-pink-600" />
              Customer
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{order.user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiMapPin className="text-pink-600" />
              Shipping Address
            </h2>
            <div className="space-y-1 text-gray-700">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}</p>
              <p>{order.shippingAddress?.district}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && (
                <p className="mt-2">
                  <span className="text-gray-600">Phone: </span>
                  {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiCreditCard className="text-pink-600" />
              Payment
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Method</p>
                <p className="font-semibold capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {order.isPaid ? (
                    <>
                      <FiCheckCircle className="text-green-600" />
                      <span className="font-semibold text-green-600">Paid</span>
                    </>
                  ) : (
                    <>
                      <FiXCircle className="text-red-600" />
                      <span className="font-semibold text-red-600">Not Paid</span>
                    </>
                  )}
                </div>
              </div>
              {order.isPaid && order.paidAt && (
                <div>
                  <p className="text-sm text-gray-600">Paid At</p>
                  <p className="font-semibold text-sm">
                    {new Date(order.paidAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
