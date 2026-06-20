import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F0]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#121212]/20 border-t-[#FE5733]" />
      </div>
    </div>
  );
}
