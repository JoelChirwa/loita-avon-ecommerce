import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import ProductReviews from '../components/ProductReviews';
import RecommendedProducts from '../components/RecommendedProducts';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const isInWishlist = wishlistItems.some((item) => item._id === id);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [id, dispatch]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleWishlistToggle = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-pink-600">Products</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage]?.url || product.images?.[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => {
                  const imgUrl = image?.url || image;
                  return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-pink-600' : 'border-transparent'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                );})}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.category}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-600">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-pink-600 mb-6">
              MWK {product.price?.toLocaleString()}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  In Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50"
              >
                {isInWishlist ? (
                  <FaHeart className="w-6 h-6" />
                ) : (
                  <FiHeart className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              {['description', 'ingredients', 'usage', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div>
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p>{product.fullDescription || product.description}</p>
                {product.benefits && (
                  <>
                    <h3>Benefits:</h3>
                    <ul>
                      {product.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="prose max-w-none">
                <p>{product.ingredients || 'Ingredients information not available.'}</p>
              </div>
            )}
            {activeTab === 'usage' && (
              <div className="prose max-w-none">
                <p>{product.usage || 'Usage instructions not available.'}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <ProductReviews productId={id} reviews={product.reviews || []} />
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts productId={id} currentCategory={product.category} />
    </div>
  );
};

export default ProductDetailPage;
