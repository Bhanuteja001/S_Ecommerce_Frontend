import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, Mail, Lock, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { login, clearAuthError } from '../slices/authSlice';
import { mergeLocalCartWithServer } from '../slices/cartSlice';
import Alert from '../components/Alert';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get('redirect') || '';

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already logged in, navigate
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
    if (email && password) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl border border-caramel-gold/15 shadow-2xl flex flex-col gap-6">
        {/* Title */}
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold uppercase tracking-widest text-cream-light">
            Welcome Back
          </h1>
          <p className="text-xs text-cream-medium/50">
            Sign in to access your artisanal chocolates collection.
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="connoisseur@chocoluxe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 pl-10 pr-4 text-xs text-cream-light placeholder-cream-medium/30 focus:outline-none focus:border-caramel-gold"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-cream-medium/35" />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-cream-light tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 pl-10 pr-10 text-xs text-cream-light placeholder-cream-medium/30 focus:outline-none focus:border-caramel-gold"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-cream-medium/35" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-cream-medium/40 hover:text-caramel-gold"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all mt-3"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-cream-medium/50 mt-2 border-t border-caramel-gold/10 pt-4">
          New to ChocoLuxe?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-caramel-gold font-bold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
