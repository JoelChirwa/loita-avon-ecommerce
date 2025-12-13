import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FiArrowRight } from 'react-icons/fi';

const categories = [
  { name: 'Skin Care', icon: '🧴', slug: 'skin-care' },
  { name: 'Makeup', icon: '💄', slug: 'makeup' },
  { name: 'Fragrances', icon: '🌸', slug: 'fragrances' },
  { name: 'Bath & Body', icon: '🛁', slug: 'bath-body' },
  { name: 'Hair Care', icon: '💇', slug: 'hair-care' },
  { name: 'Accessories', icon: '👜', slug: 'accessories' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts({ sortBy: 'newest', limit: 8 }));
  }, [dispatch]);

  const featuredProducts = Array.isArray(products) ? products.slice(0, 8) : [];

  return (
    <div>
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden text-white py-5 min-h-150 flex items-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 hero-gradient-animation"></div>
        
        {/* Floating Circles Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow top-10 -left-20"></div>
          <div className="absolute w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float-medium top-40 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float-fast bottom-20 left-1/3"></div>
          <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow bottom-10 right-10"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="animate-fade-in-up lg:-mt-25">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Discover Beauty with{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-200 via-white to-pink-200 animate-shimmer bg-size-[200%_auto]">
                  Avon
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-lg">
                Authentic Avon products delivered across Malawi. Quality beauty and wellness for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all text-center shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transform duration-300"
                >
                  Shop Now
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/products?filter=new"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-all text-center hover:scale-105 transform duration-300 shadow-xl"
                >
                  New Arrivals
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="relative w-full max-w-lg">
                <img
                  src="/hero.jpg"
                  alt="Beautiful woman showcasing Avon products"
                  className="w-full h-auto object-contain drop-shadow-2xl animate-float-slow"
                />
                {/* Decorative Glow Behind Image */}
                <div className="absolute inset-0 bg-white/20 blur-3xl -z-10 scale-110"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent"></div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-linear-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our curated collection of premium Avon products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center overflow-hidden hover:scale-105 transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 group-hover:animate-bounce">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>

                {/* Decorative Circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl group-hover:bg-white/40 transition-all duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Delivery Across Malawi</h3>
              <p className="text-gray-600">
                Fast and reliable delivery to your doorstep
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Airtel Money, TNM Mpamba, and card payments
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                100% genuine Avon products guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">
            Subscribe to get special offers, beauty tips, and new product alerts
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-800 border-2 border-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
            />
            <button
              type="submit"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
