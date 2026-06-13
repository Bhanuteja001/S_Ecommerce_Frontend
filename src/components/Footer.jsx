import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-chocolate-darker border-t border-caramel-gold/15 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-caramel-gold via-cream-light to-caramel-gold bg-clip-text text-transparent uppercase font-sans">
                ChocoLuxe
              </span>
            </Link>
            <p className="text-sm text-cream-medium/60 max-w-sm leading-relaxed">
              Crafting premium, single-origin organic chocolates. Indulge in our exquisite assortment of handpicked cocoa delights made with love and traditional craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-caramel-gold font-bold mb-4">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/" className="text-cream-medium/75 hover:text-caramel-gold transition-colors">
                  Home Screen
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-cream-medium/75 hover:text-caramel-gold transition-colors">
                  Shop Assortments
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-cream-medium/75 hover:text-caramel-gold transition-colors">
                  View Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-caramel-gold font-bold mb-4">
              La Maison
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-cream-medium/75">
              <li>100 E-Commerce Plaza, Hyderabad</li>
              <li>support@chocoluxe.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-caramel-gold/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-medium/45">
          <p>&copy; {new Date().getFullYear()} ChocoLuxe. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-caramel-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-caramel-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
