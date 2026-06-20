'use client';

import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // Simplest and most robust approach: no artificial overlay.
  // We rely on Next.js App Router for navigation and native transitions where applicable.
  return <>{children}</>;
}
