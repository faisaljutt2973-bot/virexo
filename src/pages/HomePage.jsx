import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, SkeletonLoader, EmptyState } from '../components/LoadingStates';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featuredRes, newRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/products?isNew=true&limit=4'),
        ]);
        setFeatured(featuredRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Everything You Need
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Discover premium products across fashion, footwear, electronics, watches and accessories — everything you need in one place.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="border border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Explore Collection
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex justify-center">
            <div className="relative w-96 h-96">
              {/* Soft glow background */}
              <div className="absolute inset-8 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-2xl" />

              {[0, 1, 2, 3].map((i) => {
                const img = featured[i]?.images?.[0];
                const positions = [
                  'top-2 left-8 w-40 h-40 hero-float-1',
                  'top-0 right-0 w-32 h-32 hero-float-2',
                  'bottom-4 left-0 w-32 h-32 hero-float-3',
                  'bottom-0 right-6 w-36 h-36 hero-float-4',
                ];
                return (
                  <div
                    key={i}
                    className={`absolute ${positions[i]} rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-gray-800`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt="Featured product"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-500 to-purple-600">
                        🛍️
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <style>{`
              @keyframes heroFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-16px); }
              }
              .hero-float-1 { animation: heroFloat 4.5s ease-in-out infinite; }
              .hero-float-2 { animation: heroFloat 5.5s ease-in-out infinite; animation-delay: 0.4s; }
              .hero-float-3 { animation: heroFloat 5s ease-in-out infinite; animation-delay: 0.8s; }
              .hero-float-4 { animation: heroFloat 6s ease-in-out infinite; animation-delay: 1.2s; }
            `}</style>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          {loading ? (
            <SkeletonLoader />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState message="No featured products available" />
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
          {loading ? (
            <SkeletonLoader />
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState message="No new arrivals yet" />
          )}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat._id}`}
                  className="relative h-40 rounded-lg overflow-hidden group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-gray-300 to-gray-500 w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition">
                    🛍️
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition">
                    <span className="text-white font-bold text-lg">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No categories available yet</p>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Limited Time Offer</h2>
          <p className="text-lg mb-8">Get up to 40% off on selected items. Use code: VIREXO40</p>
          <Link
            to="/shop"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold inline-block transition"
          >
            Shop Sale
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8">Get exclusive deals and new product announcements directly to your inbox</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}