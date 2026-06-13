import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Star, StarHalf, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { fetchProductById, createProductReview, resetProductStatus, clearProductDetails } from '../slices/productSlice';
import { addToCartServer } from '../slices/cartSlice';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const ProductDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [addFeedback, setAddFeedback] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { product, loading, error, reviewLoading, reviewSuccess, reviewError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearProductDetails());
      dispatch(resetProductStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (reviewSuccess) {
      setRating(5);
      setComment('');
      dispatch(fetchProductById(id));
      const timer = setTimeout(() => {
        dispatch(resetProductStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, reviewSuccess, id]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    await dispatch(addToCartServer({ product, quantity: qty }));
    setAddFeedback(true);
    setTimeout(() => setAddFeedback(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating && comment.trim()) {
      dispatch(createProductReview({ productId: id, rating, comment: comment.trim() }));
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/placeholder-chocolate.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const renderStars = (ratingValue, iconSize = 'w-4 h-4') => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className={`${iconSize} fill-caramel-gold text-caramel-gold`} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className={`${iconSize} fill-caramel-gold text-caramel-gold`} />);
      } else {
        stars.push(<Star key={i} className={`${iconSize} text-cream-medium/20`} />);
      }
    }
    return stars;
  };

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><Alert variant="danger">{error}</Alert></div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in flex flex-col gap-12">
      {/* Back link */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cream-medium hover:text-caramel-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Chocolates
        </Link>
      </div>

      {/* Main product display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Product Image */}
        <div className="glass-panel p-3 rounded-3xl overflow-hidden aspect-square border border-caramel-gold/15 shadow-xl max-w-lg mx-auto w-full bg-chocolate-medium">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1549007994-cb92ca8a7a72?q=80&w=600&auto=format&fit=crop';
            }}
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-b border-caramel-gold/15 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-caramel-gold">
              {product.category?.name || 'Artisanal'}
            </span>
            <h1 className="text-3xl font-extrabold text-cream-light leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{renderStars(product.rating, 'w-4 h-4')}</div>
              <span className="text-xs text-cream-medium/50 font-medium">
                ({product.numReviews} customer {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Key Chocolate Specs (Cocoa %, Nut Free) */}
          <div className="flex flex-wrap gap-3">
            {product.cocoaPercentage && (
              <div className="glass-panel px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="text-caramel-gold font-extrabold">{product.cocoaPercentage}%</span>
                <span className="text-cream-medium/60">Cocoa Blend</span>
              </div>
            )}
            <div className="glass-panel px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="text-cream-medium/60">Allergen Safety:</span>
              <span className={product.isNutFree ? 'text-emerald-400' : 'text-amber-400'}>
                {product.isNutFree ? 'Nut Free' : 'May Contain Nuts'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase text-cream-medium/40 tracking-wider">
              About this recipe
            </h3>
            <p className="text-sm text-cream-medium/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Purchase Actions Card */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/15 flex flex-col gap-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase text-cream-medium/55">Price</span>
              <span className="text-2xl font-extrabold text-cream-light">${product.price.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-b border-caramel-gold/5">
              <span className="text-xs font-bold uppercase text-cream-medium/55">Status</span>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Sold Out'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-cream-medium/55">Quantity</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                >
                  {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all duration-300 ${addFeedback
                  ? 'bg-emerald-600 hover:bg-emerald-600 text-cream-light shadow-lg shadow-emerald-600/20'
                  : 'bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker'
                } disabled:opacity-40 disabled:pointer-events-none`}
            >
              {addFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  Added To Box
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        {/* Left Side of reviews: List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-cream-light">
            Chocolate Reviews
          </h2>

          {product.reviews.length === 0 ? (
            <div className="border border-dashed border-caramel-gold/15 rounded-2xl p-8 text-center text-sm text-cream-medium/50 bg-chocolate-dark/10">
              No reviews yet. Be the first to share your experience with this chocolate!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="glass-panel p-5 rounded-2xl border border-caramel-gold/5 flex flex-col gap-2 animate-fade-in"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-cream-light">{review.name}</span>
                    <span className="text-[10px] text-cream-medium/40">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex">{renderStars(review.rating, 'w-3 h-3')}</div>
                  <p className="text-xs text-cream-medium/70 leading-relaxed mt-1">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side of reviews: Form */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-cream-light">
            Write a Review
          </h2>

          {userInfo ? (
            <form
              onSubmit={handleReviewSubmit}
              className="glass-panel p-5 rounded-2xl border border-caramel-gold/10 flex flex-col gap-4"
            >
              {reviewError && <Alert variant="danger">{reviewError}</Alert>}
              {reviewSuccess && <Alert variant="success">Review submitted successfully!</Alert>}

              {/* Rating selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-cream-light">
                  Rating Selection
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                >
                  <option value={5}>5 - Excellent Recipe</option>
                  <option value={4}>4 - Good Quality</option>
                  <option value={3}>3 - Fair Taste</option>
                  <option value={2}>2 - Disappointed</option>
                  <option value={1}>1 - Awful Experience</option>
                </select>
              </div>

              {/* Comment text area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-cream-light">
                  Review Comment
                </label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts about the cocoa flavor, sweetness, texture, and aroma..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2 text-xs text-cream-light focus:outline-none focus:border-caramel-gold placeholder-cream-medium/30 leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3 rounded-xl transition-all"
              >
                {reviewLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="glass-panel p-5 rounded-2xl border border-caramel-gold/10 flex items-start gap-3 bg-amber-950/20 text-amber-200">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                Please{' '}
                <Link to="/login" className="underline hover:text-caramel-gold">
                  Sign In
                </Link>{' '}
                to leave a customer review.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
