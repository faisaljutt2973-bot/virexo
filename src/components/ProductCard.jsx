import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success('Product added to cart!');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-64 md:h-80">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 left-2 p-2 rounded-full transition ${
            inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 text-sm md:text-base transition">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 mt-1">
          {product.category?.name || ''}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400">
              {'⭐'.repeat(Math.round(product.rating))}
            </div>
            <span className="text-xs text-gray-600">({product.rating}/5)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-3 mb-4">
          <span className="font-bold text-lg text-gray-900">
            Rs. {product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              Rs. {product.price}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded font-medium text-sm transition ${
            product.stock > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}