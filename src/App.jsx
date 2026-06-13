import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Screen Components
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen bg-chocolate-darker text-cream-medium font-sans">
          {/* Header Navigation */}
          <Navbar />
          
          {/* Main page content area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/shop" element={<ShopScreen />} />
              <Route path="/products/:id" element={<ProductDetailScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              
              {/* Guest Authentication Routes */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              
              {/* Authenticated Customer Routes */}
              <Route path="/checkout" element={<CheckoutScreen />} />
              <Route path="/orders/:id" element={<OrderScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              
              {/* Admin Panel Route */}
              <Route path="/admin" element={<AdminScreen />} />

              {/* Redirect anything else to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer branding */}
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
