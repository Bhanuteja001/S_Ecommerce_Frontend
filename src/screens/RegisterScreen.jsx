import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, Mail, Lock, Phone, MapPin, RefreshCw } from 'lucide-react';
import { register, clearAuthError } from '../slices/authSlice';
import { mergeLocalCartWithServer } from '../slices/cartSlice';
import Alert from '../components/Alert';

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Basic Details
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

  // Custom validation error state
  const [validationError, setValidationError] = useState('');

  const redirect = searchParams.get('redirect') || '';

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(mergeLocalCartWithServer());
      navigate(`/${redirect}`);
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [userInfo, navigate, redirect, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    dispatch(
      register({
        name,
        email,
        password,
        phone,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
      })
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl border border-caramel-gold/15 shadow-2xl flex flex-col gap-6">
        {/* Title */}
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold uppercase tracking-widest text-cream-light">
            Create Account
          </h1>
          <p className="text-xs text-cream-medium/50">
            Join the ChocoLuxe circle to order organic chocolates.
          </p>
        </div>

        {(error || validationError) && (
          <Alert variant="danger">{validationError || error}</Alert>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          {/* Section: Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jean-Paul"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jp@chocoshop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Street Address
              </label>
              <input
                type="text"
                placeholder="100 Sweet Lane"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                City
              </label>
              <input
                type="text"
                placeholder="Hyderabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Postal Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="500001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Country
              </label>
              <input
                type="text"
                placeholder="India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 px-4 text-xs text-cream-light focus:outline-none focus:border-caramel-gold"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all mt-4"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-cream-medium/50 mt-2 border-t border-caramel-gold/10 pt-4">
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="text-caramel-gold font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
