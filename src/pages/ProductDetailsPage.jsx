import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, EmptyState } from '../components/LoadingStates';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productRes, relatedRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products?limit=4`),
        ]);
        setProduct(productRes.data.product);
        setRelatedProducts(relatedRes.data.products || []);
        
        // Set default size and color
        if (productRes.data.product?.sizes?.length > 0) {
          setSelectedSize(productRes.data.product.sizes[0]);
        }
        if (productRes.data.product?.colors?.length > 0) {
          setSelectedColor(productRes.data.product.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize, selectedColor);
      toast.success(`Added ${quantity} item(s) to cart!`);
      setQuantity(1);
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        toast.info('Removed from wishlist');
      } else {
        addToWishlist(product);
        toast.success('Added to wishlist!');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <Layout><EmptyState message="Product not found" /></Layout>;

  const inWishlist = isInWishlist(product._id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/400'}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.title} ${i}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Badge */}
            {discountPercent > 0 && (
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                -{discountPercent}% OFF
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>

            {/* Category & Brand */}
            <div className="flex gap-4 text-sm text-gray-600 mb-4">
              {product.category?.name && <span>Category: {product.category.name}</span>}
              {product.brand && <span>Brand: {product.brand}</span>}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(Math.round(product.rating))}
                </div>
                <span className="text-gray-600">({product.rating}/5)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                Rs. {product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  Rs. {product.price}
                </span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded transition ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Color</label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded transition ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-blue-600 transition"
                >
                  −
                </button>
                <span className="font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-blue-600 transition"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
                  product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Wishlist & Buy Now */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleWishlist}
                className={`flex-1 py-3 rounded-lg font-bold border-2 transition ${
                  inWishlist
                    ? 'border-red-600 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
              </button>
              <button className="flex-1 py-3 rounded-lg font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                Buy Now
              </button>
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>🚚 Free shipping on orders over Rs. 5000</span>
              </div>
              <div className="flex justify-between">
                <span>🔄 Easy 30-day returns</span>
              </div>
              <div className="flex justify-between">
                <span>✅ 100% authentic products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}