'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F0] px-4 text-center">
      <div className="bg-white border border-black/10 p-8 md:p-12 rounded-lg shadow-sm max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-[#FE5733]/10 text-[#FE5733] rounded-full flex items-center justify-center mx-auto border border-[#FE5733]/20">
          <AlertTriangle className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-2">Oops</p>
          <h2 className="text-2xl font-bold text-black">Something went wrong</h2>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          We encountered an unexpected issue. Please try again or contact support if the problem persists.
        </p>
        <button
          onClick={() => reset()}
          className="w-full h-11 btn btn-primary flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
