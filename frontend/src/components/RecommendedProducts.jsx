import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecommendations } from '../redux/slices/productSlice';
import ProductCard from './ProductCard';

const RecommendedProducts = ({ productId, currentCategory }) => {
  const dispatch = useDispatch();
  const { recommendations, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(getRecommendations(productId));
    }
  }, [productId, dispatch]);

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <span className="text-sm text-gray-600">AI-Powered Suggestions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;
