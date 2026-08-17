import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, SkeletonLoader, EmptyState } from '../components/LoadingStates';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const filterMode = searchParams.get('filter'); // 'new' | 'deals' | null

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);
        params.append('minPrice', minPrice);
        params.append('maxPrice', maxPrice);
        params.append('sort', sortBy);
        if (filterMode === 'new') params.append('isNew', 'true');
        if (filterMode === 'deals') params.append('onSale', 'true');

        const response = await api.get(`/products?${params}`);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, filterMode]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shop</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-20 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-semibold mb-3">Price Range</label>
                <div className="space-y-2">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600 mt-1">Min: Rs. {minPrice}</p>
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600 mt-1">Max: Rs. {maxPrice}</p>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setMinPrice(0);
                  setMaxPrice(100000);
                  setSortBy('newest');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonLoader />
            ) : products.length > 0 ? (
              <>
                <p className="text-gray-600 mb-4">
                  Showing <span className="font-semibold">{products.length}</span> products
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState message="No products found matching your filters" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}