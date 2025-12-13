import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../redux/slices/orderSlice';
import { FiPackage, FiTruck, FiCheck, FiMapPin, FiPhone, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { currentOrder: order, isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
    dispatch(getOrderById(id));
    
    // Check if returning from payment gateway
    const status = searchParams.get('status');
    const txRef = searchParams.get('tx_ref');
    
    if (status && txRef) {
      verifyPaymentStatus(txRef, status);
    }
  }, [id, dispatch]);

  const verifyPaymentStatus = async (txRef, status) => {
    setVerifyingPayment(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      
      await axios.get(`${API_URL}/payments/verify/${txRef}`, config);
      
      if (status === 'successful' || status === 'success') {
        toast.success('Payment confirmed successfully! Your order is being processed.');
      } else if (status === 'failed') {
        toast.error('Payment was not successful. You can try again from the order details.');
      }
      
      // Refresh order data
      dispatch(getOrderById(id));
    } catch (error) {
      console.error('Payment verification error:', error);
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600 mx-auto"></div>
      </div>
    );
  }

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: FiPackage },
    { status: 'paid', label: 'Payment Confirmed', icon: FiCheck },
    { status: 'shipped', label: 'Shipped', icon: FiTruck },
    { status: 'delivered', label: 'Delivered', icon: FiCheck },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.status === order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-pink-600 hover:text-pink-700 mb-2 inline-block">
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-gray-600">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Order Status</h2>
        <div className="relative">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const StatusIcon = step.icon;

              return (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <p
                    className={`text-sm text-center ${
                      isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute top-6 h-0.5 ${
                        index < currentStepIndex ? 'bg-pink-600' : 'bg-gray-200'
                      }`}
                      style={{
                        left: `${(index + 1) * 25}%`,
                        width: '25%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <Link to={`/products/${item.product?._id || item.product}`}>
                    <img
                      src={item.image || item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.name || item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product?._id || item.product}`}
                      className="font-semibold hover:text-pink-600"
                    >
                      {item.name || item.product?.name}
                    </Link>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-pink-600 font-bold">
                      MWK {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>MWK {order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>MWK {order.shippingPrice?.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-pink-600">MWK {order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Payment Status */}
            <div className="mb-4 pt-4 border-t">
              <p className="text-gray-600 mb-2 text-sm">Payment Status</p>
              {verifyingPayment ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-600"></div>
                  <span className="text-sm">Verifying payment...</span>
                </div>
              ) : order.isPaid ? (
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheck className="w-5 h-5" />
                  <span className="font-medium">Paid</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600">
                  <FiAlertCircle className="w-5 h-5" />
                  <span className="font-medium">Pending Payment</span>
                </div>
              )}
              {order.paidAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="text-sm">
              <p className="text-gray-600 mb-1">Payment Method</p>
              <p className="font-medium capitalize">
                {order.paymentMethod === 'airtel-money' && '📱 Airtel Money'}
                {order.paymentMethod === 'mpamba' && '📱 TNM Mpamba'}
                {order.paymentMethod === 'card' && '💳 Credit/Debit Card'}
              </p>
            </div>

            {/* Pay Now Button if not paid */}
            {!order.isPaid && (
              <button
                onClick={() => navigate(`/payment/${order._id}`)}
                className="w-full mt-4 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold flex items-center justify-center gap-2"
              >
                <FiCreditCard />
                Pay Now
              </button>
            )}
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-medium">{order.shippingAddress?.address}</p>
                  {order.shippingAddress?.landmark && (
                    <p className="text-sm text-gray-600">Near: {order.shippingAddress.landmark}</p>
                  )}
                  <p className="font-medium">{order.shippingAddress?.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium">{order.shippingAddress?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                <strong>Payment Pending:</strong> Please complete your payment to confirm this order.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
