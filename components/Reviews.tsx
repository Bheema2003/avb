'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

const Reviews = () => {
  const router = useRouter();
  type Review = { _id: string; name: string; rating: number; comment: string };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.data || []);
          setAvg(data.averageRating || 0);
          setCount(data.total || 0);
        }
      } catch {}
    };
    load();
  }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const handleWrite = () => {
    router.push('/reviews/new');
  };

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
      if (res.ok && data.success) {
        setReviews((prev) => [data.data, ...prev]);
        setCount((c) => c + 1);
        setAvg(Math.round(((avg * count + rating) / (count + 1)) * 10) / 10);
        setOpen(false);
        setRating(5);
        setComment('');
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
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Customer Reviews & Ratings</h2>
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl font-bold text-black">{avg.toFixed(1)}</span>
            <div className="flex flex-col items-start">
              <div className="flex text-yellow-400 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-black font-medium text-sm">{count} reviews</span>
            </div>
          </div>
          <button onClick={handleWrite} className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors mt-6">
            Write a Review
          </button>
        </div>
        <div className="max-w-2xl mx-auto text-left space-y-4">
          {reviews.length === 0 && (
            <div className="text-gray-500 text-sm">No reviews yet</div>
          )}
          {reviews.map((r) => (
            <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex text-yellow-400 gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
              <p className="text-gray-600 mb-2 text-sm leading-relaxed">{r.comment}</p>
              <p className="font-bold text-sm">- {r.name}</p>
            </div>
          ))}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4 text-black">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i)}
                    className={`p-1 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6" />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
                placeholder="Share your experience"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 bg-gray-100 text-black py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
