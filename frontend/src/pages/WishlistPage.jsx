import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const handleRemoveItem = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Save your favorite products for later!
          </p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 font-semibold"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-gray-600">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/products/${item._id}`}>
              <div className="aspect-square bg-gray-100">
                <img
                  src={item.images?.[0]?.url || item.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link
                to={`/products/${item._id}`}
                className="font-semibold text-gray-800 hover:text-pink-600 mb-1 line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <p className="text-lg font-bold text-pink-600 mb-4">
                MWK {item.price?.toLocaleString()}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock === 0}
                  className="flex-1 flex items-center justify-center gap-1 bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 text-red-600"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              {item.stock === 0 && (
                <p className="text-red-600 text-xs mt-2 text-center">Out of Stock</p>
              )}
              {item.stock > 0 && item.stock <= 5 && (
                <p className="text-orange-600 text-xs mt-2 text-center">
                  Only {item.stock} left
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
