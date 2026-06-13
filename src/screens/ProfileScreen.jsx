import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, ClipboardList, Shield, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { updateProfile, clearAuthError } from '../slices/authSlice';
import { getMyOrders as fetchUserOrders } from '../slices/orderSlice';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { myOrders, myOrdersLoading, myOrdersError } = useSelector((state) => state.orders);

  // Profile details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Shipping Address Fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setPhone(userInfo.phone || '');
      setAddress(userInfo.shippingAddress?.address || '');
      setCity(userInfo.shippingAddress?.city || '');
      setPostalCode(userInfo.shippingAddress?.postalCode || '');
      setCountry(userInfo.shippingAddress?.country || '');
      
      dispatch(fetchUserOrders());
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [userInfo, navigate, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setValidationError('');
    setUpdateSuccess(false);

    if (password && password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const resultAction = await dispatch(
      updateProfile({
        name,
        email,
        phone,
        password: password || undefined,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    if (updateProfile.fulfilled.match(resultAction)) {
      setUpdateSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in flex flex-col gap-10">
      <h1 className="text-3xl font-extrabold text-cream-light uppercase tracking-wider border-b border-caramel-gold/15 pb-5">
        My Chocolate Account
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Profile Edit Form */}
        <div className="glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-5 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-3 flex items-center gap-2">
            <User className="w-4.5 h-4.5" />
            Profile Details
          </h3>

          {(authError || validationError) && (
            <Alert variant="danger">{validationError || authError}</Alert>
          )}
          {updateSuccess && <Alert variant="success">Profile updated successfully!</Alert>}

          <form onSubmit={submitHandler} className="flex flex-col gap-4 text-xs">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Full Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Email Address</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Phone Number</label>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none focus:border-caramel-gold"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Street Address</label>
              <input
                type="text"
                placeholder="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none"
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">City</label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none"
              />
            </div>

            {/* Postal Code */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Postal Code</label>
              <input
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Country</label>
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">
                New Password <span className="text-cream-medium/30 lowercase font-medium">(Optional)</span>
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-cream-light">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 text-cream-light focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3 rounded-xl transition-all mt-2"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Right column: User Orders History */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-caramel-gold/10 flex flex-col gap-5 shadow-xl min-h-[400px]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-gold border-b border-caramel-gold/10 pb-3 flex items-center gap-2">
            <ClipboardList className="w-4.5 h-4.5" />
            Order History
          </h3>

          {myOrdersLoading ? (
            <div className="my-auto"><Spinner /></div>
          ) : myOrdersError ? (
            <Alert variant="danger">{myOrdersError}</Alert>
          ) : myOrders.length === 0 ? (
            <div className="border border-dashed border-caramel-gold/15 rounded-2xl p-12 text-center text-xs text-cream-medium/40 my-auto bg-chocolate-dark/5">
              No orders placed yet. Indulge in some chocolates!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-caramel-gold/10 text-cream-medium/40 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2 text-center">Paid</th>
                    <th className="py-3 px-2 text-center">Delivered</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-caramel-gold/5 text-cream-medium/85 font-medium">
                  {myOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-caramel-gold/5 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-cream-light font-bold truncate max-w-[80px]">
                        #{ord._id.slice(-6)}
                      </td>
                      <td className="py-3.5 px-2">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-2 font-extrabold text-cream-light">
                        ${ord.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        {ord.isPaid ? (
                          <span className="text-emerald-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-400 font-bold">No</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        {ord.isDelivered ? (
                          <span className="text-emerald-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-amber-400 font-bold">No</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 border rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            {
                              Pending: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
                              Processing: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
                              Shipped: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
                              Delivered: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                              Cancelled: 'border-red-500/30 text-red-400 bg-red-500/5',
                            }[ord.status] || 'border-caramel-gold/20 text-cream-medium'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <Link
                          to={`/orders/${ord._id}`}
                          className="bg-transparent border border-caramel-gold/30 hover:bg-caramel-gold hover:text-chocolate-darker text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
