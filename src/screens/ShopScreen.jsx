import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { fetchProducts } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const ShopScreen = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux state
  const { products, loading: prodLoading, error: prodError } = useSelector((state) => state.products);
  const { categories, loading: catLoading } = useSelector((state) => state.categories);

  // Local state for filters, initialized from SearchParams
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [isNutFree, setIsNutFree] = useState(searchParams.get('isNutFree') === 'true');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  
  // Mobile filter drawer toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if search params change (e.g., search from navbar)
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || '');
    setIsNutFree(searchParams.get('isNutFree') === 'true');
    setMinPrice(searchParams.get('minPrice') || '');
    maxPrice !== undefined && setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
  }, [searchParams]);

  // Load categories and initial products
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products when filters/params change
  useEffect(() => {
    const filters = {
      keyword: searchParams.get('keyword'),
      category: searchParams.get('category'),
      isNutFree: searchParams.get('isNutFree') === 'true',
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      sortBy: searchParams.get('sortBy'),
    };
    dispatch(fetchProducts(filters));
  }, [dispatch, searchParams]);

  const applyFilters = () => {
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (category) params.category = category;
    if (isNutFree) params.isNutFree = 'true';
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy) params.sortBy = sortBy;

    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setKeyword('');
    setCategory('');
    setIsNutFree(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-caramel-gold/15 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-cream-light uppercase tracking-wider">
            Chocolate Shop
          </h1>
          <p className="text-xs text-cream-medium/50 mt-1.5">
            Discover our premium, organic handcrafted collections.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border border-caramel-gold/30 rounded-xl text-xs font-semibold uppercase text-caramel-gold hover:bg-caramel-gold/5"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden md:flex flex-col gap-6 glass-panel p-6 rounded-2xl border border-caramel-gold/10 self-start">
          <div className="flex items-center justify-between border-b border-caramel-gold/10 pb-3">
            <h3 className="text-sm uppercase font-bold tracking-wider text-caramel-gold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Refine Search
            </h3>
            <button
              onClick={resetFilters}
              className="text-[10px] uppercase font-bold text-cream-medium/40 hover:text-caramel-gold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Keyword Search */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
              Keyword
            </label>
            <input
              type="text"
              placeholder="E.g. Dark, Truffle..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light text-center focus:outline-none focus:border-caramel-gold"
              />
              <span className="text-cream-medium/40 text-xs">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light text-center focus:outline-none focus:border-caramel-gold"
              />
            </div>
          </div>

          {/* Nut-Free Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="nutFreeCheck"
              checked={isNutFree}
              onChange={(e) => setIsNutFree(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-caramel-gold/20 bg-chocolate-darker text-caramel-gold focus:ring-transparent accent-caramel-gold"
            />
            <label htmlFor="nutFreeCheck" className="text-xs font-bold uppercase text-cream-light tracking-wide cursor-pointer select-none">
              Nut Free Only
            </label>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyFilters}
            className="w-full bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3 rounded-xl transition-all"
          >
            Apply Filters
          </button>
        </aside>

        {/* PRODUCTS LIST & SORT HEADER */}
        <main className="md:col-span-3 flex flex-col gap-6">
          {/* Sorting and result count */}
          <div className="flex items-center justify-between bg-chocolate-dark/50 border border-caramel-gold/5 px-4 py-3 rounded-xl">
            <span className="text-xs text-cream-medium/60 font-medium">
              Showing {products.length} {products.length === 1 ? 'chocolate' : 'chocolates'}
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[10px] uppercase font-bold text-cream-medium/55 tracking-wide">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const currentParams = Object.fromEntries([...searchParams]);
                  if (e.target.value) currentParams.sortBy = e.target.value;
                  else delete currentParams.sortBy;
                  setSearchParams(currentParams);
                }}
                className="bg-chocolate-darker border border-caramel-gold/15 rounded-lg px-2.5 py-1 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
              >
                <option value="newest">Newest Arrival</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product grid */}
          {prodLoading ? (
            <div className="py-20">
              <Spinner size="lg" />
            </div>
          ) : prodError ? (
            <Alert variant="danger">{prodError}</Alert>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-caramel-gold/15 rounded-3xl bg-chocolate-dark/20">
              <p className="text-cream-light font-bold text-lg">No Artisanal Chocolates Found</p>
              <p className="text-sm text-cream-medium/60 max-w-sm">
                We couldn't find any chocolates matching your criteria. Try adjusting your filters or resetting them.
              </p>
              <button
                onClick={resetFilters}
                className="bg-transparent border border-caramel-gold/40 text-caramel-gold hover:bg-caramel-gold hover:text-chocolate-darker text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER DRAWER OVERLAY */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-chocolate-darker/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs h-full bg-chocolate-darker border-l border-caramel-gold/25 p-6 flex flex-col gap-6 overflow-y-auto animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-caramel-gold/10 pb-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-caramel-gold">
                Filter Chocolates
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-cream-medium hover:text-caramel-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keyword Search */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Keyword
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-chocolate-dark border border-caramel-gold/20 rounded-xl px-3 py-2.5 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-chocolate-dark border border-caramel-gold/20 rounded-xl px-3 py-2.5 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-chocolate-dark border border-caramel-gold/20 rounded-xl px-3 py-2.5 text-xs text-cream-light text-center focus:outline-none"
                />
                <span className="text-cream-medium/40 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-chocolate-dark border border-caramel-gold/20 rounded-xl px-3 py-2.5 text-xs text-cream-light text-center focus:outline-none"
                />
              </div>
            </div>

            {/* Nut-Free Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="nutFreeCheckMobile"
                checked={isNutFree}
                onChange={(e) => setIsNutFree(e.target.checked)}
                className="w-5 h-5 rounded border-caramel-gold/20 bg-chocolate-dark text-caramel-gold focus:ring-transparent accent-caramel-gold"
              />
              <label htmlFor="nutFreeCheckMobile" className="text-xs font-bold uppercase text-cream-light tracking-wide cursor-pointer">
                Nut Free Only
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 mt-auto pt-6 border-t border-caramel-gold/10">
              <button
                onClick={applyFilters}
                className="w-full bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-transparent border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold hover:border-caramel-gold font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopScreen;
