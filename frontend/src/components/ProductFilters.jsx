import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '../redux/slices/productSlice';
import { FiX } from 'react-icons/fi';

const categories = [
  'All',
  'Skin Care',
  'Makeup',
  'Fragrances',
  'Bath & Body',
  'Hair Care',
  'Accessories',
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

const ProductFilters = ({ onApplyFilters, showMobile, onCloseMobile }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategory !== 'All' ? selectedCategory.toLowerCase().replace(' ', '-') : '',
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
    };
    
    dispatch(setFilters(filters));
    if (onApplyFilters) onApplyFilters(filters);
    if (onCloseMobile) onCloseMobile();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 100000]);
    setSortBy('newest');
    dispatch(setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 100000,
      sortBy: 'newest',
    }));
    if (onApplyFilters) onApplyFilters({});
  };

  const content = (
    <div className="bg-white p-6 rounded-lg">
      {/* Mobile Header */}
      {showMobile && (
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onCloseMobile}>
            <FiX className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-4 h-4 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range (MWK)</h4>
        <div className="space-y-3">
          <div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-pink-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleApplyFilters}
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  if (showMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
        <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default ProductFilters;
