import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Mail, Lock, RefreshCw, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { login, logout } from '../slices/authSlice';
import { mergeLocalCartWithServer } from '../slices/cartSlice';
import Alert from '../components/Alert';

const AdminLoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // If admin is already logged in, navigate straight to dashboard
    if (userInfo && userInfo.isAdmin) {
      navigate('/admin');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoginLoading(true);

    try {
      // Dispatch standard login
      const result = await dispatch(login({ email, password })).unwrap();
      
      // Validate that the logged in account is indeed an admin
      if (!result.isAdmin) {
        // If not, clear session instantly to block access
        dispatch(logout());
        setErrorMsg('Access Denied: Administrator privileges required.');
      } else {
        // If yes, load their settings and navigate
        dispatch(mergeLocalCartWithServer());
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 animate-fade-in flex flex-col gap-6">
      {/* Return to shop link */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xs text-cream-medium/40 hover:text-caramel-gold transition-colors self-start font-bold uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Boutique
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-caramel-gold/20 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-caramel-gold via-cream-light to-caramel-gold"></div>

        {/* Header Title with Admin Icon */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-caramel-gold/10 border border-caramel-gold/30 flex items-center justify-center text-caramel-gold">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <h1 className="text-xl font-extrabold uppercase tracking-widest text-cream-light">
              Maison Admin Portal
            </h1>
            <p className="text-[10px] text-caramel-gold uppercase tracking-wider font-bold">
              Secure Staff Authentication
            </p>
          </div>
        </div>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase text-cream-light tracking-wider">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@chocoluxe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 pl-10 pr-4 text-xs text-cream-light placeholder-cream-medium/30 focus:outline-none focus:border-caramel-gold font-medium"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-cream-medium/35" />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase text-cream-light tracking-wider">
              Portal Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-3 pl-10 pr-10 text-xs text-cream-light placeholder-cream-medium/30 focus:outline-none focus:border-caramel-gold font-medium"
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
            disabled={loginLoading}
            className="w-full flex items-center justify-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all mt-3 cursor-pointer"
          >
            {loginLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Authenticate Portal
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-cream-medium/30 border-t border-caramel-gold/10 pt-4 mt-2">
          Authorized personnel only. All access attempts are logged and monitored.
        </div>
      </div>
    </div>
  );
};

export default AdminLoginScreen;
