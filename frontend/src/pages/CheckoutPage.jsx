import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';

const paymentMethods = [
  { id: 'airtel-money', name: 'Airtel Money', icon: '📱' },
  { id: 'mpamba', name: 'TNM Mpamba', icon: '📱' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('airtel-money');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const deliveryFee = 5000;
  const grandTotal = totalAmount + deliveryFee;

  const onSubmit = async (data) => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Create order with payment details
      const orderData = {
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: items.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0]?.url || item.images?.[0] || '',
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          district: data.district,
          notes: data.notes,
        },
        paymentMethod,
        paymentDetails: {
          // For mobile money
          ...(paymentMethod === 'airtel-money' || paymentMethod === 'mpamba' ? {
            phone: data.paymentPhone
          } : {}),
          // For card
          ...(paymentMethod === 'card' ? {
            cardNumber: data.cardNumber,
            cardExpiry: data.cardExpiry,
            cardCvv: data.cardCvv,
            cardName: data.cardName
          } : {})
        },
        itemsPrice: totalAmount,
        shippingPrice: deliveryFee,
        totalPrice: grandTotal,
      };

      try {
        const result = await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        toast.success('Order placed successfully! Proceed to payment.');
        navigate(`/payment/${result.order._id}`);
      } catch (error) {
        console.error('Order creation error:', error);
        toast.error(error || 'Failed to create order. Please try again.');
      }
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-24 h-1 ${
                    step < currentStep ? 'bg-pink-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2 gap-24">
          <span className={currentStep >= 1 ? 'text-pink-600' : 'text-gray-500'}>
            Delivery
          </span>
          <span className={currentStep >= 2 ? 'text-pink-600' : 'text-gray-500'}>
            Review
          </span>
          <span className={currentStep >= 3 ? 'text-pink-600' : 'text-gray-500'}>
            Payment
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Delivery Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Delivery Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName', { required: 'Full name is required' })}
                      defaultValue={user?.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="+265..."
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      {...register('street', { required: 'Street address is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="House/plot number, street name"
                    />
                    {errors.street && (
                      <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Area/Neighborhood
                    </label>
                    <input
                      type="text"
                      {...register('notes')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Area name, nearby landmark..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City *
                    </label>
                    <select
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select city</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Blantyre">Blantyre</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Zomba">Zomba</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      District *
                    </label>
                    <select
                      {...register('district', { required: 'District is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select district</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Blantyre">Blantyre</option>
                      <option value="Mzimba">Mzimba</option>
                      <option value="Zomba">Zomba</option>
                      <option value="Mangochi">Mangochi</option>
                      <option value="Mulanje">Mulanje</option>
                      <option value="Thyolo">Thyolo</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.district && (
                      <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 mt-6 font-semibold"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {/* Step 2: Review Order */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Review Your Order</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b">
                      <img
                        src={item.images?.[0]?.url || item.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-bold text-pink-600">
                          MWK {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-pink-600"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>

                {/* Payment Details Fields */}
                <div className="mb-6 space-y-4">
                  {(paymentMethod === 'airtel-money' || paymentMethod === 'mpamba') && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mobile Money Number *
                      </label>
                      <input
                        type="tel"
                        {...register('paymentPhone', { 
                          required: 'Phone number is required for mobile money payment',
                          pattern: {
                            value: /^(\+265|0)?[1879]\d{8}$/,
                            message: 'Enter a valid Malawian phone number'
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="+265888123456, 0888123456, or 0994123456"
                      />
                      {errors.paymentPhone && (
                        <p className="text-red-600 text-sm mt-1">{errors.paymentPhone.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the {paymentMethod === 'airtel-money' ? 'Airtel Money' : 'TNM Mpamba'} number you will use to complete the payment
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          {...register('cardNumber', { 
                            required: 'Card number is required',
                            pattern: {
                              value: /^\d{16}$/,
                              message: 'Enter a valid 16-digit card number'
                            }
                          })}
                          maxLength="16"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="1234567890123456"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-600 text-sm mt-1">{errors.cardNumber.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            {...register('cardExpiry', { 
                              required: 'Expiry date is required',
                              pattern: {
                                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                message: 'Format: MM/YY'
                              }
                            })}
                            maxLength="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="MM/YY"
                          />
                          {errors.cardExpiry && (
                            <p className="text-red-600 text-sm mt-1">{errors.cardExpiry.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            {...register('cardCvv', { 
                              required: 'CVV is required',
                              pattern: {
                                value: /^\d{3,4}$/,
                                message: '3 or 4 digits'
                              }
                            })}
                            maxLength="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="123"
                          />
                          {errors.cardCvv && (
                            <p className="text-red-600 text-sm mt-1">{errors.cardCvv.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          {...register('cardName', { required: 'Cardholder name is required' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Name as shown on card"
                        />
                        {errors.cardName && (
                          <p className="text-red-600 text-sm mt-1">{errors.cardName.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-lg">🔒</span>
                    <span>Your payment information is secure and encrypted. You will be redirected to complete the payment securely.</span>
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold"
                  >
                    Place Order & Pay
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({items.length})</span>
                <span className="font-semibold">MWK {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">MWK {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-pink-600 text-lg">
                  MWK {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
