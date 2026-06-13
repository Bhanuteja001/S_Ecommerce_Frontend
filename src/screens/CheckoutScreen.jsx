import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Truck, Receipt, CheckSquare, ShieldCheck, RefreshCw } from 'lucide-react';
import { createOrder, resetOrderStatus } from '../slices/orderSlice';
import { clearCartServer } from '../slices/cartSlice';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { order, success, loading, error } = useSelector((state) => state.orders);

  // Address Details - Initialize with userInfo values
  const [address, setAddress] = useState(userInfo?.shippingAddress?.address || '');
  const [city, setCity] = useState(userInfo?.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(userInfo?.shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(userInfo?.shippingAddress?.country || '');
  
  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate]);

  useEffect(() => {
    if (success && order) {
      // Clear cart from server and state
      dispatch(clearCartServer());
      // Redirect to the created order screen
      navigate(`/orders/${order._id}`);
      // Reset order status so next order starts clean
      dispatch(resetOrderStatus());
    }
  }, [success, order, navigate, dispatch]);

  // Pricing calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const taxPrice = itemsPrice * 0.08; // 8% sales tax
  const shippingPrice = itemsPrice > 150 ? 0 : 25; // Free shipping over $150
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const placeOrderHandler = (e) => {
    e.preventDefault();

    if (!address || !city || !postalCode || !country) {
      return;
    }

    dispatch(
      createOrder({
        orderItems: cartItems.map((item) => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.image,
          price: item.product.price,
          product: item.product._id,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-cream-light uppercase tracking-wider border-b border-caramel-gold/15 pb-5 mb-8">
        Checkout Shipping & Payment
      </h1>

      {error && (
        <div className="mb-6">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}

      <form onSubmit={placeOrderHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Shipping address & payment choice */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping Address Box */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold flex items-center gap-2 border-b border-caramel-gold/10 pb-3">
              <Truck className="w-4.5 h-4.5" />
              1. Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase text-cream-light">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="Address Line"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-cream-light">
                  City
                </label>
                <input
                  type="text"
                  placeholder="E.g. Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-cream-light">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="E.g. 500001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase text-cream-light">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="E.g. India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Choice */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold flex items-center gap-2 border-b border-caramel-gold/10 pb-3">
              <CreditCard className="w-4.5 h-4.5" />
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash On Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash On Delivery')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'Cash On Delivery'
                    ? 'border-caramel-gold bg-caramel-gold/5 text-caramel-gold'
                    : 'border-caramel-gold/15 bg-chocolate-dark/30 hover:border-caramel-gold/35'
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={() => {}}
                  className="w-4 h-4 mt-0.5 accent-caramel-gold"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-cream-light">
                    Cash On Delivery
                  </span>
                  <span className="text-[10px] text-cream-medium/40 leading-normal">
                    Pay with cash when your luxury chocolate box is delivered.
                  </span>
                </div>
              </button>

              {/* Card Payment Simulation */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-caramel-gold bg-caramel-gold/5 text-caramel-gold'
                    : 'border-caramel-gold/15 bg-chocolate-dark/30 hover:border-caramel-gold/35'
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === 'Card'}
                  onChange={() => {}}
                  className="w-4 h-4 mt-0.5 accent-caramel-gold"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-cream-light">
                    Credit / Debit Card
                  </span>
                  <span className="text-[10px] text-cream-medium/40 leading-normal">
                    Pay securely using card. Payment is simulated for verification.
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Box Summary & Pricing totals */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/15 flex flex-col gap-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-3 flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5" />
              Box Summary
            </h3>

            {/* List of items */}
            <div className="flex flex-col gap-4 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-chocolate-medium rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.product.image.startsWith('http')
                          ? item.product.image
                          : `http://localhost:5000${item.product.image}`
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549007994-cb92ca8a7a72?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-cream-light truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-cream-medium/55">
                      {item.quantity} x ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-cream-light">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="flex flex-col gap-3 border-t border-caramel-gold/10 pt-4 text-xs">
              <div className="flex justify-between text-cream-medium/60">
                <span>Items Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream-medium/60">
                <span>Est. Sales Tax (8%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream-medium/60">
                <span>Shipping Fee</span>
                <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-caramel-gold/10 text-sm font-extrabold text-cream-light">
                <span>Grand Total</span>
                <span className="text-lg text-caramel-gold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay buttons / Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-lg shadow-caramel-gold/10"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Place Order & pay
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutScreen;
