import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const deliveryFee = 5000; // MWK 5,000

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some beautiful Avon products to get started!
          </p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-6 flex gap-6"
            >
              {/* Image */}
              <Link to={`/products/${item._id}`} className="flex-shrink-0">
                <img
                  src={item.images?.[0]?.url || item.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>

              {/* Details */}
              <div className="flex-1">
                <Link
                  to={`/products/${item._id}`}
                  className="font-semibold text-lg hover:text-pink-600 mb-1"
                >
                  {item.name}
                </Link>
                <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                <p className="text-pink-600 font-bold text-lg">
                  MWK {item.price?.toLocaleString()}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                </div>

                <p className="font-bold">
                  MWK {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">MWK {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">MWK {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-pink-600">
                  MWK {(totalAmount + deliveryFee).toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg hover:bg-pink-700 font-semibold mb-3"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="block w-full text-center py-3 text-pink-600 hover:text-pink-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
