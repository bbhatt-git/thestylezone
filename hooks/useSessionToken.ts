'use client'
import { useEffect, useState } from 'react';

export function useSessionToken(): string {
  const [token, setToken] = useState<string>('');
  
  useEffect(() => {
    let t = localStorage.getItem('tsz_session');
    if (!t) {
       t = crypto.randomUUID();
       localStorage.setItem('tsz_session', t);
    }
    const tokenVal = t;
    Promise.resolve().then(() => {
      setToken(tokenVal);
    });
  }, []);
  
  return token;
}
