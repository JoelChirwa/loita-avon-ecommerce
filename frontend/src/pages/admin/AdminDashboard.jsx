import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiPackage, 
  FiTrendingUp, 
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: 'MWK 2,450,000',
      change: '+12.5%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Orders',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: FiShoppingBag,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Products',
      value: '89',
      change: '+3.1%',
      trend: 'up',
      icon: FiPackage,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Customers',
      value: '234',
      change: '+15.3%',
      trend: 'up',
      icon: FiUsers,
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', email: 'john@example.com', total: 45000, status: 'pending', date: '2 hours ago' },
    { id: '2', customer: 'Jane Smith', email: 'jane@example.com', total: 78000, status: 'paid', date: '5 hours ago' },
    { id: '3', customer: 'Mike Johnson', email: 'mike@example.com', total: 32000, status: 'shipped', date: '1 day ago' },
    { id: '4', customer: 'Sarah Williams', email: 'sarah@example.com', total: 56000, status: 'delivered', date: '2 days ago' },
  ];

  const lowStockProducts = [
    { id: '1', name: 'Avon Anew Ultimate Cream', stock: 3, category: 'Skincare' },
    { id: '2', name: 'Avon True Color Lipstick', stock: 2, category: 'Makeup' },
    { id: '3', name: 'Far Away Perfume', stock: 4, category: 'Fragrance' },
  ];

  const topProducts = [
    { name: 'Avon Anew Ultimate', sales: 45, revenue: 450000 },
    { name: 'Far Away Perfume', sales: 38, revenue: 380000 },
    { name: 'True Color Lipstick', sales: 32, revenue: 320000 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-pink-100">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.lightColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <FiArrowUp size={16} /> : <FiArrowDown size={16} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1">
              View All <FiTrendingUp size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-pink-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="font-bold text-gray-900">MWK {order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
            <FiTrendingUp className="text-green-600" size={20} />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  'bg-orange-100 text-orange-700'
                } flex items-center justify-center font-bold text-sm`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <p className="font-bold text-sm text-gray-900">MWK {(product.revenue / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
          <Link
            to="/admin/products"
            className="block text-center mt-6 text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            View All Products →
          </Link>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-2 rounded-lg">
            <FiAlertCircle className="text-red-600" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>
            <p className="text-sm text-gray-500">Products that need restocking soon</p>
          </div>
          <span className="bg-red-100 text-red-700 text-sm px-3 py-1.5 rounded-full font-semibold">
            {lowStockProducts.length} items
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-red-600 font-medium">{product.category}</span>
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {product.stock} left
                </span>
              </div>
              <p className="font-semibold text-gray-900">{product.name}</p>
            </div>
          ))}
        </div>
        <Link
          to="/admin/products"
          className="block text-center mt-6 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-medium transition-colors"
        >
          Manage Inventory
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
