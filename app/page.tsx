"use client";

import { useState, useEffect } from 'react';
import { LoginView } from '@/components/LoginView';
import { DashboardView } from '@/components/DashboardView';
import { User } from '@/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (res.ok) {
          const sessionUser = await res.json();
          setUser(sessionUser);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialized(true);
      }
    };

    initSession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };

  if (!isInitialized) return null;

  return (
    <main className="min-h-screen">
      {!user ? (
        <LoginView onLogin={handleLogin} />
      ) : (
        <DashboardView user={user} onLogout={handleLogout} />
      )}
    </main>
  );
}
