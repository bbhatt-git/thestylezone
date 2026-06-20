'use client'
import { useEffect, useState } from 'react';

export function useSessionToken(): string {
  const [token, setToken] = useState<string>('');
  
  useEffect(() => {
    let t = localStorage.getItem('tsz_session');
    if (!t) {
       t = crypto.randomUUID ? crypto.randomUUID() : generateFallbackUUID();
       localStorage.setItem('tsz_session', t);
    }
    const tokenVal = t;
    Promise.resolve().then(() => {
      setToken(tokenVal);
    });
  }, []);

  function generateFallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  return token;
}
