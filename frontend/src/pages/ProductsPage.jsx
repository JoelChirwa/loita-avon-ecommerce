import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { FiFilter } from "react-icons/fi";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, isLoading, filters, isError, message } = useSelector(
    (state) => state.products
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filterParams = {
      ...filters,
      ...(category && { category }),
      ...(search && { search }),
    };

    dispatch(getProducts(filterParams));
  }, [dispatch, searchParams, filters]);

  const handleApplyFilters = (newFilters) => {
    dispatch(getProducts(newFilters));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
          <p className="text-gray-600">
            {isLoading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters onApplyFilters={handleApplyFilters} />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg"
            >
              <FiFilter /> Filters
            </button>

            {isError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{message}</span>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse h-96 rounded-lg"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <ProductFilters
            showMobile={true}
            onCloseMobile={() => setShowMobileFilters(false)}
            onApplyFilters={handleApplyFilters}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
