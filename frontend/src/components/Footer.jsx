import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-500">Loita Shop</h3>
            <p className="text-gray-400">
              Your trusted destination for authentic Avon products in Malawi. Quality beauty and wellness products delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-pink-500">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-pink-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pink-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-pink-500">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-pink-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-400 hover:text-pink-500">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=skincare" className="text-gray-400 hover:text-pink-500">
                  Skin Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=makeup" className="text-gray-400 hover:text-pink-500">
                  Makeup
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrances" className="text-gray-400 hover:text-pink-500">
                  Fragrances
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-gray-400 hover:text-pink-500">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <FiPhone className="w-5 h-5" />
                <span>+265 xxx xxx xxx</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <FiMail className="w-5 h-5" />
                <span>info@loitashop.mw</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-pink-500">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500">
                <FiInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500">
                <FiTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>&copy; {new Date().getFullYear()} Loita Shop. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <FiHeart className="text-pink-500" /> by Joel Chirwa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
