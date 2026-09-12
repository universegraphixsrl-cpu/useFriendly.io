import React from 'react';
import { CheckCircle2Icon, AlertTriangleIcon } from 'lucide-react';

interface ToastProps {
  message: string;
  variant?: 'success' | 'warning';
}

export function Toast({ message, variant = 'success' }: ToastProps) {
  const success = variant === 'success';
  const Icon = success ? CheckCircle2Icon : AlertTriangleIcon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-toast-in">
      
      <p
        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold shadow-lg ${
        success ?
        'border-emerald-200 bg-emerald-50 text-emerald-800' :
        'border-amber-200 bg-amber-50 text-amber-800'}`
        }>
        
        <Icon className="h-4 w-4" aria-hidden="true" />
        {message}
      </p>
    </div>);

}