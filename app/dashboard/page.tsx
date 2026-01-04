'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple cookie parser to get user name
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    
    const userMarker = getCookie('user_name');
    if (!userMarker) {
      router.push('/login');
      return;
    }

    setUserName(decodeURIComponent(userMarker));

    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data);
        }
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
            AVB
          </div>
          <span className="font-bold text-xl tracking-wide">CABS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Hello, {userName}</span>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-500">Manage your bookings and profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Book a Ride</h2>
            <p className="text-gray-500 mb-6">Need a cab? Book a new ride now.</p>
            <Link href="/" className="inline-block bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Book Now
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">My Bookings</h2>
            <p className="text-gray-500 mb-6">View your past and upcoming trips.</p>
            {loading ? (
              <div className="text-gray-400">Loading your bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center gap-4">
                <div className="text-gray-400">No bookings yet</div>
                <Link href="/" className="inline-block bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Book Your First Ride
                </Link>
              </div>
            ) : (
              <div className="text-left space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{b.tripType}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{b.status || 'pending'}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <div>Pickup: <span className="font-medium">{b.pickupLocation}</span></div>
                      <div>Drop: <span className="font-medium">{b.dropLocation || '-'}</span></div>
                      <div>Date & Time: <span className="font-medium">{b.pickupDate} at {b.pickupTime}</span></div>
                      <div>Contact: <span className="font-medium">{b.contactNumber}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
