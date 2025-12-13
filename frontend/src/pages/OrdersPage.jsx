import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../redux/slices/orderSlice';
import { FiPackage, FiTruck, FiCheck } from 'react-icons/fi';

const statusIcons = {
  pending: { icon: FiPackage, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  paid: { icon: FiCheck, color: 'text-green-600', bg: 'bg-green-100' },
  shipped: { icon: FiTruck, color: 'text-blue-600', bg: 'bg-blue-100' },
  delivered: { icon: FiCheck, color: 'text-green-600', bg: 'bg-green-100' },
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600 mx-auto"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            Start shopping to see your orders here!
          </p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status]?.icon || FiPackage;
          const statusColor = statusIcons[order.status]?.color || 'text-gray-600';
          const statusBg = statusIcons[order.status]?.bg || 'bg-gray-100';

          return (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusBg}`}>
                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                    <span className={`text-sm font-medium ${statusColor} capitalize`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.image || item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder-product.jpg'}
                        alt=""
                        className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-pink-600">
                      MWK {order.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Delivery to:</span> {order.shippingAddress?.city}
                  </p>
                  <span className="text-pink-600 text-sm font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
