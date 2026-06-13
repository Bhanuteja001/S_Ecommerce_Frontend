import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Alert = ({ variant = 'danger', children, onClose }) => {
  const bgStyles = {
    danger: 'bg-red-950/40 border-red-500/30 text-red-300',
    success: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
    info: 'bg-blue-950/40 border-blue-500/30 text-blue-300',
    warning: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
  };

  const Icon = {
    danger: AlertCircle,
    success: CheckCircle2,
    info: AlertCircle,
    warning: AlertCircle,
  }[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl animate-fade-in ${bgStyles[variant]} backdrop-blur-sm shadow-md`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-grow text-sm font-medium leading-relaxed">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
