import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Heart, HelpCircle, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { fetchCategories } from '../slices/categorySlice';
import { fetchProducts } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading: catLoading, error: catError } = useSelector((state) => state.categories);
  const { products, loading: prodLoading, error: prodError } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle category card click
  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  const getCategoryImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/placeholder-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-chocolate-dark via-chocolate-medium to-chocolate-darker border-b border-caramel-gold/15 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-caramel-gold/30 bg-caramel-gold/5 text-caramel-gold text-xs font-semibold tracking-wider uppercase animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Artisanal & Handcrafted
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-cream-light tracking-tight leading-none uppercase font-sans">
            Indulge in Pure <br />
            <span className="bg-gradient-to-r from-caramel-gold via-cream-light to-caramel-gold bg-clip-text text-transparent">
              Cocoa Perfection
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-cream-medium/75 max-w-2xl leading-relaxed">
            Experience the velvety smoothness of single-origin luxury chocolates, crafted by master chocolatiers with premium ingredients and direct-trade cocoa beans.
          </p>
          
          <div className="flex gap-4 mt-4">
            <Link
              to="/shop"
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-chocolate-darker bg-caramel-gold hover:bg-caramel-hover px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-caramel-gold/25"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 bg-caramel-gold/10 rounded-full flex items-center justify-center text-caramel-gold border border-caramel-gold/20">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-cream-light">100% Organic</h3>
            <p className="text-sm text-cream-medium/60 leading-relaxed">
              Every bar is hand-selected and crafted from certified organic cocoa beans and natural additions.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 bg-caramel-gold/10 rounded-full flex items-center justify-center text-caramel-gold border border-caramel-gold/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-cream-light">Artisanal Quality</h3>
            <p className="text-sm text-cream-medium/60 leading-relaxed">
              Made in small batches using traditional French conching techniques to maximize natural aromatic complexity.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 bg-caramel-gold/10 rounded-full flex items-center justify-center text-caramel-gold border border-caramel-gold/20">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-cream-light">Sustainably Sourced</h3>
            <p className="text-sm text-cream-medium/60 leading-relaxed">
              We pay fair direct premiums to farm co-ops in Ecuador and Madagascar, ensuring ethical cultivation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Browse Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-cream-light">
            Browse Our Categories
          </h2>
          <div className="w-16 h-0.5 bg-caramel-gold mt-3"></div>
        </div>

        {catLoading ? (
          <Spinner />
        ) : catError ? (
          <Alert variant="danger">{catError}</Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="group relative h-48 rounded-2xl overflow-hidden border border-caramel-gold/15 focus:outline-none hover:border-caramel-gold/50 transition-all text-left"
              >
                <div className="absolute inset-0 bg-chocolate-darker/60 group-hover:bg-chocolate-darker/40 transition-colors z-10"></div>
                <img
                  src={getCategoryImageUrl(category.image)}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1548907040-4d42b52125bb?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                  <h3 className="text-lg font-bold text-cream-light uppercase tracking-wide group-hover:text-caramel-gold transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-cream-medium/70 line-clamp-2 mt-1">
                    {category.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Chocolates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-10 border-b border-caramel-gold/10 pb-4">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-cream-light">
              Featured Chocolates
            </h2>
            <div className="w-16 h-0.5 bg-caramel-gold mt-2"></div>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-semibold text-caramel-gold hover:text-caramel-hover transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {prodLoading ? (
          <Spinner />
        ) : prodError ? (
          <Alert variant="danger">{prodError}</Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Luxury Newsletter Sign Up */}
      <section className="bg-chocolate-dark border-t border-b border-caramel-gold/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-cream-light">
            Join The ChocoLuxe Circle
          </h2>
          <p className="text-sm text-cream-medium/70 max-w-md leading-relaxed">
            Subscribe to receive exclusive access to small-batch seasonal releases, masterclass workshops, and special connoisseur collections.
          </p>
          <form className="flex flex-col sm:flex-row w-full max-w-md gap-2 mt-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-4 py-3 text-sm text-cream-light placeholder-cream-medium/30 focus:outline-none focus:border-caramel-gold focus:ring-1 focus:ring-caramel-gold"
            />
            <button
              type="submit"
              className="bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
