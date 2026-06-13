import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { fetchCart, addToCartServer, removeFromCartServer } from '../slices/cartSlice';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQuantityHandler = (item, newQty) => {
    if (newQty < 1 || newQty > item.product.stock) return;
    dispatch(addToCartServer({ product: item.product, quantity: newQty }));
  };

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCartServer(productId));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/placeholder-chocolate.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subTotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  if (loading && cartItems.length === 0) return <div className="py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-cream-light uppercase tracking-wider border-b border-caramel-gold/15 pb-5 mb-8">
        Your Chocolate Box
      </h1>

      {error && (
        <div className="mb-6">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border border-dashed border-caramel-gold/15 rounded-3xl bg-chocolate-dark/10 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-caramel-gold/5 border border-caramel-gold/20 rounded-full flex items-center justify-center text-caramel-gold">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-cream-light font-bold text-lg">Your Cart is Empty</p>
            <p className="text-sm text-cream-medium/60 max-w-sm">
              It looks like you haven't added any premium chocolates to your collection yet.
            </p>
          </div>
          <Link
            to="/shop"
            className="bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full transition-all"
          >
            Explore Chocolates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="glass-panel p-4 rounded-2xl border border-caramel-gold/10 flex items-center gap-4 hover:border-caramel-gold/25 transition-all duration-300 animate-fade-in"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-chocolate-medium rounded-xl overflow-hidden flex-shrink-0 border border-caramel-gold/10">
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1549007994-cb92ca8a7a72?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="font-bold text-sm sm:text-base text-cream-light hover:text-caramel-gold transition-colors block truncate"
                  >
                    {item.product.name}
                  </Link>

                  {item.product.cocoaPercentage && (
                    <span className="text-[10px] text-caramel-gold font-semibold uppercase tracking-wider block mt-0.5">
                      {item.product.cocoaPercentage}% Cocoa
                    </span>
                  )}

                  <div className="flex items-center justify-between sm:justify-start gap-6 mt-3">
                    {/* Quantity Selector +/- */}
                    <div className="flex items-center bg-chocolate-darker border border-caramel-gold/20 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantityHandler(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-lg text-cream-medium/60 hover:text-caramel-gold hover:bg-caramel-gold/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-cream-light">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantityHandler(item, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded-lg text-cream-medium/60 hover:text-caramel-gold hover:bg-caramel-gold/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-cream-light sm:hidden">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Desktop Price & Delete */}
                <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0 pl-4">
                  <span className="text-base font-extrabold text-cream-light">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-cream-medium/40 font-medium">
                    (${item.product.price.toFixed(2)} each)
                  </span>
                </div>

                <div className="flex-shrink-0 pl-2">
                  <button
                    onClick={() => removeFromCartHandler(item.product._id)}
                    className="p-2 rounded-xl text-cream-medium/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/15 flex flex-col gap-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-3">
              Order Summary
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-semibold text-cream-medium/70">
                <span>Total Items</span>
                <span>{itemsCount}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-caramel-gold/5">
                <span className="text-sm font-bold text-cream-light">Subtotal</span>
                <span className="text-xl font-extrabold text-cream-light">
                  ${subTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={checkoutHandler}
              className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-lg shadow-caramel-gold/10"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            {!userInfo && (
              <p className="text-[10px] text-cream-medium/40 text-center leading-relaxed">
                You will be asked to sign in or register before configuring shipping options.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
