import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowLeft } from 'lucide-react';

const NotFoundScreen = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="max-w-md w-full text-center glass-panel-heavy p-8 sm:p-12 rounded-3xl border border-caramel-gold/20 shadow-2xl relative overflow-hidden">
        {/* Background visual accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-caramel-gold/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-chocolate-medium/40 rounded-full blur-2xl"></div>
        
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-caramel-gold/10 rounded-full flex items-center justify-center text-caramel-gold border border-caramel-gold/20 mb-6">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        {/* Brand Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-caramel-gold/30 bg-caramel-gold/5 text-caramel-gold text-[10px] font-bold tracking-widest uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          ChocoLuxe Maison
        </div>

        {/* 404 text */}
        <h1 className="text-7xl font-extrabold text-caramel-gold tracking-tighter mb-2 font-sans gold-text-glow">
          404
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-lg font-bold text-cream-light uppercase tracking-wider mb-4">
          Lost in the Cocoa Realm
        </h2>

        {/* Description */}
        <p className="text-xs text-cream-medium/60 leading-relaxed mb-8">
          This delicate confection could not be located in our boutique selection. It might have been a seasonal limited batch or has moved to another drawer.
        </p>

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs text-chocolate-darker bg-caramel-gold hover:bg-caramel-hover px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-caramel-gold/15 w-full cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to the Boutique
        </Link>
      </div>
    </div>
  );
};

export default NotFoundScreen;
