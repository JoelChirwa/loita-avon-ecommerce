import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors"
          >
            {isInWishlist ? (
              <FaHeart className="w-5 h-5 text-pink-600" />
            ) : (
              <FiHeart className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.stock === 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                Low Stock
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-pink-600">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600">
                {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0})
              </span>
            </div>
            <span className="text-lg font-bold text-pink-600">
              MWK {product.price?.toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            <FiShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
