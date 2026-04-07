"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessPopupProps {
  show: boolean;
  message: string;
  onClose?: () => void;
}

export function SuccessPopup({ show, message, onClose }: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Popup */}
      <div 
        className={cn(
          "relative bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-6 w-6 text-green-500 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Sparkles className="h-6 w-6 text-green-500 animate-pulse" />
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Success!
          </h2>
          
          <p className="text-green-700 mb-6">
            {message}
          </p>
          
          <p className="text-sm text-green-600">
            Redirecting you to your profile...
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 h-1 bg-green-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-pulse" 
               style={{
                 animation: 'shrink 3s ease-out forwards'
               }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
