import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiX, FiArrowRight, FiSmartphone, FiGift } from 'react-icons/fi';

interface AppPromoProps {
  onClose: () => void;
}

export default function AppPromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show after 3 seconds, only once per session
    const hasShown = sessionStorage.getItem('appPromoShown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('appPromoShown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-10"
        >
          <FiX size={20} />
        </button>

        {/* Top Gradient Header */}
        <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 p-8 flex items-end relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
             <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
             
             <div className="flex items-center space-x-4 relative z-10">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                 <FiSmartphone className="text-primary-600 w-10 h-10" />
               </div>
               <div className="text-white">
                 <h2 className="text-2xl font-display font-bold">Get the App</h2>
                 <p className="text-primary-100 text-sm italic">Unlock the full Blue Crate experience</p>
               </div>
             </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
           <div className="space-y-6">
             <div className="flex items-start space-x-4">
               <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiGift className="text-primary-600" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900">Faster Ordering</h3>
                  <p className="text-gray-500 text-sm">Save your preferences and checkout in under 30 seconds.</p>
               </div>
             </div>

             <div className="flex items-start space-x-4">
               <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiSmartphone className="text-amber-600" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900">Real-time Tracking</h3>
                  <p className="text-gray-500 text-sm">Know exactly when your fresh ingredients will arrive.</p>
               </div>
             </div>
           </div>

           <div className="mt-10">
              <a 
                href="https://app.bluecratefoods.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold flex items-center justify-center group shadow-xl hover:shadow-primary-200 transition-all transform hover:-translate-y-1"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">Launch Web App</span>
                <FiArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </a>
              <p className="text-center text-gray-400 text-xs mt-4 mt-6">
                 No download required. Works on any browser.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
