import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Star, StarHalf } from 'lucide-react';
import { addToCartServer } from '../slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);

  // Helper to format image URL correctly if it's uploaded locally
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/placeholder-chocolate.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Stop navigation to details screen
    if (product.stock === 0) return;

    setAdding(true);
    await dispatch(addToCartServer({ product, quantity: 1 }));
    setTimeout(() => setAdding(false), 800);
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-caramel-gold text-caramel-gold" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 fill-caramel-gold text-caramel-gold" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-cream-medium/20" />);
      }
    }
    return stars;
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col h-full bg-chocolate-dark border border-caramel-gold/10 hover:border-caramel-gold/40 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-caramel-gold/5 animate-fade-in"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-chocolate-medium">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://elavegan.com/wp-content/uploads/2023/01/homemade-chocolate-bars.jpg';
          }}
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNutFree && (
            <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
              Nut Free
            </span>
          )}
          {product.cocoaPercentage && (
            <span className="bg-chocolate-darker/80 border border-caramel-gold/20 text-caramel-gold text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full backdrop-blur-sm">
              {product.cocoaPercentage}% Cocoa
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-chocolate-darker/85 flex items-center justify-center backdrop-blur-sm">
            <span className="text-red-400 font-extrabold uppercase tracking-widest text-xs px-3 py-1 border border-red-500/25 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info container */}
      <div className="flex flex-col flex-grow p-4">
        {/* Category */}
        <span className="text-[10px] uppercase tracking-widest font-semibold text-caramel-gold/60 mb-1">
          {product.category?.name || 'Artisanal'}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-cream-light group-hover:text-caramel-gold transition-colors line-clamp-2 leading-snug mb-1">
          {product.name}
        </h3>

        {/* Review rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-[10px] text-cream-medium/40 font-medium">
            ({product.numReviews})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-caramel-gold/5">
          <div className="flex flex-col">
            <span className="text-xs text-cream-medium/55 font-medium leading-none">Price</span>
            <span className="text-base font-extrabold text-cream-light mt-1">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`p-2.5 rounded-xl border border-caramel-gold/25 text-caramel-gold hover:text-chocolate-darker hover:bg-caramel-gold disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 relative overflow-hidden flex items-center justify-center ${adding ? 'bg-caramel-gold text-chocolate-darker scale-95' : 'bg-transparent'
              }`}
            aria-label="Add to cart"
          >
            {adding ? (
              <span className="text-xs font-bold px-1 animate-pulse">Added!</span>
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
