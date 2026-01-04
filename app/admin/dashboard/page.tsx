'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Booking {
  _id: string;
  tripType: string;
  name: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  contactNumber: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // 1. Optimistic Update
    const previousBookings = [...bookings];
    setBookings(bookings.map(b => 
      b._id === id ? { ...b, status: newStatus as any } : b
    ));

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert on failure
        setBookings(previousBookings);
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error
      setBookings(previousBookings);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    // 1. Optimistic Update
    const previousBookings = [...bookings];
    setBookings((prev) => prev.filter((b) => b._id !== id));

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert on failure
        setBookings(previousBookings);
        alert('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      // Revert on error
      setBookings(previousBookings);
      alert('Error deleting booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
            AVB
          </div>
          <span className="font-bold text-xl tracking-wide">CABS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-black">Services</Link>
          <Link href="/" className="hover:text-black">Why Us</Link>
          <Link href="/" className="hover:text-black">Reviews</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-gray-500">Manage all bookings</p>
          </div>
          <button 
            onClick={() => {
              document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              router.push('/');
            }}
            className="px-6 py-2 border rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">All Bookings</h2>
            <span className="text-sm font-medium text-gray-500">Total: {bookings.length}</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading bookings...</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium mb-3 lowercase">
                        {booking.tripType}
                      </span>
                      <h3 className="text-lg font-bold">{booking.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">User ID: {booking._id.substring(0, 8)}...</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status || 'pending')}`}>
                        {booking.status || 'pending'}
                      </span>
                      
                      <div className="relative inline-block text-left group">
                        <button className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm hover:bg-gray-50">
                          {booking.status === 'pending' ? 'Pending' : 
                           booking.status === 'confirmed' ? 'Confirmed' : 
                           booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block z-10">
                          <div className="py-1">
                            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(booking._id, status)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 capitalize"
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDelete(booking._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Booking"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Pickup:</p>
                      <p className="font-medium text-gray-900">{booking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Drop:</p>
                      <p className="font-medium text-gray-900">{booking.dropLocation || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Date & Time:</p>
                      <p className="font-medium text-gray-900">{booking.pickupDate} at {booking.pickupTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Contact:</p>
                      <p className="font-medium text-gray-900">{booking.contactNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {bookings.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  No bookings found yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
