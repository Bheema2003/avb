'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

export default function NewReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.status === 401) {
        alert('Please login to write a review');
        router.push('/login');
        return;
      }
      if (res.ok && data.success) {
        alert('Review submitted successfully');
        router.push('/#reviews');
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Write a Review</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRating(i)}
                  className={`p-1 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-7 h-7" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={6}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="Share your experience with AVB Cabs..."
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.push('/')} className="flex-1 bg-gray-100 text-black py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
