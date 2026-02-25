"use client";

import { useState, useEffect } from 'react';
import { LoginView } from '@/components/LoginView';
import { DashboardView } from '@/components/DashboardView';
import { User } from '@/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('presensi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('presensi_user');
      }
    }
    setIsInitialized(true);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('presensi_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('presensi_user');
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
