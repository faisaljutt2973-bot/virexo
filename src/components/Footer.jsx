import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <img src="/logo.png" alt="Virexo" className="w-7 h-7 rounded-full" />
              VIREXO
            </h3>
            <p className="text-sm mb-4">Everything you need, all in one place. Premium products across fashion, electronics, home and more.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition">📘</a>
              <a href="#" className="hover:text-blue-400 transition">𝕏</a>
              <a href="#" className="hover:text-blue-400 transition">📷</a>
              <a href="#" className="hover:text-blue-400 transition">🎥</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-blue-400 transition">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-blue-400 transition">Categories</Link></li>
              <li><Link to="/shop" className="hover:text-blue-400 transition">New Arrivals</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition">Sale</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Shipping Info</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Return Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="text-white font-semibold mb-4">Subscribe to Our Newsletter</h4>
          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition font-medium">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2024 VIREXO. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <p>We Accept: 💳 💰 📱</p>
          </div>
        </div>
      </div>
    </footer>
  );
}