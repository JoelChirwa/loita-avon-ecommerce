import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiCreditCard, FiSmartphone, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const response = await axios.get(`${API_URL}/orders/${orderId}`, config);
      setOrder(response.data.order);
      
      // Pre-fill phone from order payment details
      if (response.data.order.paymentDetails?.phone) {
        setPhone(response.data.order.paymentDetails.phone);
      }
      
      // If already paid, redirect to order detail
      if (response.data.order.isPaid) {
        toast.success('This order has already been paid');
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    }
  };

  const handlePayment = async () => {
    // Use phone from order details or entered phone
    const paymentPhone = phone || order?.paymentDetails?.phone;
    
    if (!paymentPhone || paymentPhone.trim() === '') {
      toast.error('Please enter your phone number');
      return;
    }

    setIsProcessing(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/payments/initiate`,
        { orderId, phone: paymentPhone },
        config
      );

      if (response.data.success) {
        toast.success('Redirecting to payment gateway...');
        // Redirect to PayChangu checkout
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Items</span>
              <span className="font-semibold">{order.items?.length} item(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Items Total</span>
              <span className="font-semibold">MWK {order.itemsPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">MWK {order.shippingPrice?.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-pink-600">
                MWK {order.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 border-2 border-pink-600 rounded-lg bg-pink-50">
              {order.paymentMethod === 'airtel-money' && (
                <>
                  <FiSmartphone className="text-2xl text-pink-600" />
                  <div>
                    <p className="font-semibold">Airtel Money</p>
                    <p className="text-sm text-gray-600">Pay with your Airtel Money account</p>
                  </div>
                </>
              )}
              {order.paymentMethod === 'mpamba' && (
                <>
                  <FiSmartphone className="text-2xl text-pink-600" />
                  <div>
                    <p className="font-semibold">TNM Mpamba</p>
                    <p className="text-sm text-gray-600">Pay with your Mpamba account</p>
                  </div>
                </>
              )}
              {order.paymentMethod === 'card' && (
                <>
                  <FiCreditCard className="text-2xl text-pink-600" />
                  <div>
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Pay with your card</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Phone Number Input */}
          {(order.paymentMethod === 'airtel-money' || order.paymentMethod === 'mpamba') && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+265888123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the phone number linked to your mobile money account
              </p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <FiCheckCircle />
                Pay MWK {order.totalPrice?.toLocaleString()}
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Secure Payment:</strong> Your payment is processed securely through PayChangu. 
            We never store your payment details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
