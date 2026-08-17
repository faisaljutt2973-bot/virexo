import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/LoadingStates';
import { toast } from 'react-toastify';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 200;
  const discount = Math.floor(subtotal * 0.1); // 10% discount
  const total = subtotal + shipping - discount;

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <EmptyState message="Your cart is empty" />
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-block transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border-b border-gray-200 flex gap-4 hover:bg-gray-50 transition"
                >
                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded hover:opacity-80 transition"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.size && <span>Size: {item.size} | </span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      Rs. {item.price}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1, item.size, item.color)}
                      className="hover:text-blue-600 transition text-lg"
                    >
                      −
                    </button>
                    <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1, item.size, item.color)}
                      className="hover:text-blue-600 transition text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="font-bold text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        removeFromCart(item._id, item.size, item.color);
                        toast.info('Item removed from cart');
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block transition"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-20 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount (10%)</span>
                  <span className="font-semibold text-green-600">-Rs. {discount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>

              {subtotal <= 5000 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
                  <p className="font-semibold mb-1">Free Shipping Available!</p>
                  <p>Add Rs. {(5000 - subtotal).toFixed(2)} more to get free shipping</p>
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition block text-center"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={() => {
                  if (window.confirm('Clear entire cart?')) {
                    clearCart();
                    toast.info('Cart cleared');
                  }
                }}
                className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition"
              >
                Clear Cart
              </button>

              <div className="text-xs text-gray-600 space-y-1 pt-4">
                <p>✓ Free returns within 30 days</p>
                <p>✓ Secure checkout</p>
                <p>✓ Order tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}