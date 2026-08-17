import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { EmptyState } from '../components/LoadingStates';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <EmptyState message="Your wishlist is empty" />
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-block transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
