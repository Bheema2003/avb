'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const BookingForm = () => {
  const [activeTab, setActiveTab] = useState('Airport');
  const [formData, setFormData] = useState({
    name: '',
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; user_name=`);
      if (parts.length === 2) {
        const name = parts.pop()?.split(';').shift();
        if (name) {
          setFormData((prev) => ({ ...prev, name: decodeURIComponent(name) }));
        }
      }
    }
  }, []);

  const tabs = ['Airport', 'Local', 'One Way', 'Round Trip'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tripType: activeTab }),
      });
      
      if (response.ok) {
        alert('Booking request submitted successfully!');
        setFormData({
          name: '',
          pickupLocation: '',
          dropLocation: '',
          pickupDate: '',
          pickupTime: '',
          contactNumber: '',
        });
      } else {
        alert('Failed to submit booking request.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-gray-900">
      <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>
      
      {/* Tabs */}
      <div className="flex justify-between mb-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-2 -mb-2.5 transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-yellow-400 text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Drop Location</label>
          <input
            type="text"
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Date</label>
            <div className="relative">
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Time</label>
            <div className="relative">
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3 rounded-full mt-4 hover:bg-gray-800 transition-colors disabled:opacity-70"
        >
          {loading ? 'Submitting...' : 'FIND CAB NEAR ME'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
