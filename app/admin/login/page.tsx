'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">Welcome Back</h1>
          <p className="text-gray-500">Login to manage your bookings</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email</label>
              <input
                type="text"
                placeholder="your@email.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-3.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              Login
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link href="/signup" className="font-bold text-black hover:underline">Sign up</Link>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-500 hover:text-black text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
