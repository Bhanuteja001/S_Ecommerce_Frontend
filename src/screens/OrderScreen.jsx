import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Truck, Calendar, ShoppingBag, Landmark, User, Mail, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { getOrderDetails, payOrder, updateOrderStatus, resetOrderStatus } from '../slices/orderSlice';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const {
    order,
    loading,
    error,
    payLoading,
    paySuccess,
    payError,
    statusLoading,
    statusSuccess,
    statusError,
  } = useSelector((state) => state.orders);

  const [adminStatus, setAdminStatus] = useState('');

  useEffect(() => {
    dispatch(getOrderDetails(id));
    return () => {
      dispatch(resetOrderStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (paySuccess || statusSuccess) {
      dispatch(getOrderDetails(id));
      dispatch(resetOrderStatus());
    }
  }, [dispatch, id, paySuccess, statusSuccess]);

  // Set default status selector for Admin
  useEffect(() => {
    if (order) {
      setAdminStatus(order.status);
    }
  }, [order]);

  const handlePayOrder = () => {
    dispatch(payOrder({ orderId: id }));
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    if (adminStatus) {
      dispatch(updateOrderStatus({ orderId: id, status: adminStatus }));
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/placeholder-chocolate.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><Alert variant="danger">{error}</Alert></div>;
  if (!order) return null;

  // Status highlights
  const statusStyles = {
    Pending: 'bg-amber-950/40 border-amber-500/35 text-amber-300',
    Processing: 'bg-blue-950/40 border-blue-500/35 text-blue-300',
    Shipped: 'bg-purple-950/40 border-purple-500/35 text-purple-300',
    Delivered: 'bg-emerald-950/40 border-emerald-500/35 text-emerald-300',
    Cancelled: 'bg-red-950/40 border-red-500/35 text-red-300',
  }[order.status] || 'bg-chocolate-medium border-caramel-gold/10 text-cream-medium';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-caramel-gold/15 pb-5 gap-4">
        <div>
          <span className="text-[10px] text-caramel-gold uppercase tracking-widest font-bold">
            Order Reference
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-cream-light mt-0.5 truncate max-w-lg">
            ID: #{order._id}
          </h1>
        </div>

        {/* Global status badge */}
        <div className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider text-center ${statusStyles}`}>
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Order details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Client profile */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-2.5 flex items-center gap-2">
              <User className="w-4.5 h-4.5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="flex flex-col gap-1">
                <span className="text-cream-medium/40 uppercase text-[10px] font-bold">Name</span>
                <span className="text-cream-light">{order.user?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-cream-medium/40 uppercase text-[10px] font-bold">Email Address</span>
                <span className="text-cream-light">{order.user?.email}</span>
              </div>
            </div>
          </div>

          {/* Delivery tracking status */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-2.5 flex items-center gap-2">
              <Truck className="w-4.5 h-4.5" />
              Delivery Details
            </h3>

            <div className="flex flex-col gap-3 text-xs leading-relaxed">
              <div className="flex flex-col">
                <span className="text-cream-medium/40 uppercase text-[10px] font-bold mb-1">
                  Destination Address
                </span>
                <span className="text-cream-light">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
              </div>

              {order.isDelivered ? (
                <div className="mt-2 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </div>
              ) : (
                <div className="mt-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-amber-400 font-semibold">
                  Awaiting Delivery / Processing
                </div>
              )}
            </div>
          </div>

          {/* Payment tracking status */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-2.5 flex items-center gap-2">
              <Landmark className="w-4.5 h-4.5" />
              Payment Status
            </h3>

            <div className="flex flex-col gap-3 text-xs leading-relaxed">
              <div className="flex justify-between items-center">
                <span className="text-cream-medium/40 uppercase text-[10px] font-bold">
                  Payment Method Selected
                </span>
                <span className="text-cream-light font-bold">{order.paymentMethod}</span>
              </div>

              {order.isPaid ? (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Paid on {new Date(order.paidAt).toLocaleString()}
                </div>
              ) : (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 font-semibold">
                  Unpaid
                </div>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-2.5 flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5" />
              Order Items Assortment
            </h3>

            <div className="flex flex-col gap-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center animate-fade-in">
                  <div className="w-12 h-12 bg-chocolate-medium rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549007994-cb92ca8a7a72?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-bold text-xs text-cream-light hover:text-caramel-gold transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[10px] text-cream-medium/40 mt-0.5 block">
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-cream-medium/60 block">{item.qty} items</span>
                    <span className="text-xs font-bold text-cream-light mt-0.5 block">
                      ${(item.qty * item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Totals Summary & Admin controls */}
        <div className="flex flex-col gap-6">
          {/* Price details card */}
          <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/15 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-3 flex items-center gap-2">
              <Landmark className="w-4.5 h-4.5" />
              Totals Breakdown
            </h3>

            <div className="flex flex-col gap-3 text-xs leading-relaxed">
              <div className="flex justify-between text-cream-medium/60">
                <span>Items Subtotal</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream-medium/60">
                <span>Sales Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream-medium/60">
                <span>Shipping Fee</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-caramel-gold/10 text-sm font-extrabold text-cream-light">
                <span>Total Paid</span>
                <span className="text-lg text-caramel-gold">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Simulate payment for credit card orders */}
            {!order.isPaid && (
              <div className="mt-2 border-t border-caramel-gold/5 pt-4">
                {payError && <Alert variant="danger">{payError}</Alert>}
                <button
                  onClick={handlePayOrder}
                  disabled={payLoading}
                  className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all shadow-md"
                >
                  {payLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Simulate Card Payment
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ADMIN ONLY CONTROLS */}
          {userInfo && userInfo.isAdmin && (
            <div className="glass-panel p-6 rounded-2xl border border-red-500/20 flex flex-col gap-4 shadow-xl bg-red-950/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 border-b border-red-500/10 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5" />
                Admin Controls
              </h3>

              {statusError && <Alert variant="danger">{statusError}</Alert>}
              {statusSuccess && <Alert variant="success">Status updated successfully!</Alert>}

              <form onSubmit={handleStatusUpdate} className="flex flex-col gap-3.5 text-xs">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-cream-light uppercase tracking-wide text-[10px]">
                    Manage Order Status
                  </label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl px-3 py-2.5 text-xs text-cream-light focus:outline-none focus:border-caramel-gold w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={statusLoading}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-cream-light font-bold uppercase tracking-wider text-[11px] py-3 rounded-xl transition-all"
                >
                  {statusLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Update Order Status'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
