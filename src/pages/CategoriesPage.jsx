import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import api from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/LoadingStates';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">All Categories</h1>

        {loading ? (
          <LoadingSpinner />
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                className="relative h-40 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-br from-gray-300 to-gray-500 w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition">
                  🛍️
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition">
                  <span className="text-white font-bold text-lg text-center px-2">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No categories available yet" />
        )}
      </div>
    </Layout>
  );
}