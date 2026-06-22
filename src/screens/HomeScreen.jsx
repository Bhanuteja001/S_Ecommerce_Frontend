import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Heart, HelpCircle, Leaf, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCategories } from '../slices/categorySlice';
import { fetchProducts } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

// Import chocolate assets for sliding banners
import darkChocolateBanner from '../assets/Dark Chocolates/DarkChocolate2.png';
import milkChocolateBanner from '../assets/Milk Chocolates/1781617773.png';
import trufflesBanner from '../assets/Truffles & Pralines/1781620022.png';
import whiteChocolateBanner from '../assets/White Chocolates/1781618553.png';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading: catLoading, error: catError } = useSelector((state) => state.categories);
  const { products, loading: prodLoading, error: prodError } = useSelector((state) => state.products);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: darkChocolateBanner,
      tag: 'Dark Chocolates',
      title: 'Exquisite Dark Selection',
      subtitle: 'Experience the intense depth of our single-origin dark chocolates conched to perfection.',
      buttonText: 'Shop Dark Collection',
      searchCategory: 'Dark Chocolates',
    },
    {
      image: milkChocolateBanner,
      tag: 'Milk Chocolates',
      title: 'Silky Smooth Milk Chocolates',
      subtitle: 'Indulge in the rich, creamy texture of our handcrafted Belgian-style milk chocolates.',
      buttonText: 'Shop Milk Collection',
      searchCategory: 'Milk Chocolates',
    },
    {
      image: trufflesBanner,
      tag: 'Truffles & Pralines',
      title: 'Artisanal Truffles & Pralines',
      subtitle: 'Handcrafted masterworks filled with decadent ganache, caramel, and roasted nuts.',
      buttonText: 'Shop Truffles',
      searchCategory: 'Truffles & Pralines',
    },
    {
      image: whiteChocolateBanner,
      tag: 'White Chocolates',
      title: 'Velvety White Selection',
      subtitle: 'Delicate and aromatic white chocolate bars, blended with organic bourbon vanilla.',
      buttonText: 'Shop White Collection',
      searchCategory: 'White Chocolates',
    },
  ];

  // Auto-scroll logic for banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Scroll every 6 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle category card click
  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  // Handle slide button click to redirect to shop category dynamically
  const handleSlideClick = (categoryName) => {
    const found = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (found) {
      navigate(`/shop?category=${found._id}`);
    } else {
      navigate('/shop');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getCategoryImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/placeholder-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* 1. Interactive Luxury Sliding Banners */}
      <section className="relative overflow-hidden border-b border-caramel-gold/15 bg-chocolate-darker h-[450px] sm:h-[550px] md:h-[600px] w-full">
        {/* Slides list */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image with zoom effect */}
            <img
              src={slide.image}
              alt={slide.title}
              className={`absolute inset-0 w-full h-full object-cover select-none transition-transform duration-[6000ms] ease-out ${
                index === currentSlide ? 'scale-100' : 'scale-105'
              }`}
            />
            {/* Warm dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-chocolate-darker via-chocolate-darker/60 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-chocolate-darker/20 z-10"></div>

            {/* Slide text details */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start z-20">
              <div className="max-w-xl text-left flex flex-col items-start gap-4 sm:gap-5 animate-fade-in">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-caramel-gold/30 bg-chocolate-darker/70 text-caramel-gold text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.tag}
                </span>
                
                <h1 className="text-3xl sm:text-5xl font-extrabold text-cream-light uppercase tracking-tight leading-tight font-sans">
                  {slide.title}
                </h1>
                
                <p className="text-xs sm:text-sm text-cream-medium/80 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>
                
                <button
                  onClick={() => handleSlideClick(slide.searchCategory)}
                  className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] sm:text-xs text-chocolate-darker bg-caramel-gold hover:bg-caramel-hover px-6 py-3.5 sm:px-7 sm:py-4 rounded-full transition-all duration-300 shadow-lg shadow-caramel-gold/15 hover:shadow-caramel-gold/25 group cursor-pointer"
                >
                  {slide.buttonText}
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Left Arrow Control */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-caramel-gold/20 bg-chocolate-darker/60 hover:bg-caramel-gold hover:text-chocolate-darker text-caramel-gold transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Control */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-caramel-gold/20 bg-chocolate-darker/60 hover:bg-caramel-gold hover:text-chocolate-darker text-caramel-gold transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                index === currentSlide ? 'w-6 bg-caramel-gold' : 'w-2 bg-cream-light/30 hover:bg-cream-light/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
