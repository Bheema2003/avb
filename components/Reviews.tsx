import { Star } from 'lucide-react';

const Reviews = () => {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Customer Reviews & Ratings</h2>
        
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl font-bold text-black">5.0</span>
            <div className="flex flex-col items-start">
              <div className="flex text-yellow-400 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-black font-medium text-sm">1 reviews</span>
            </div>
          </div>
          
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors mt-6">
            Write a Review
          </button>
        </div>

        <div className="max-w-md mx-auto text-left">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex text-yellow-400 gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Excellent service! Professional driver and clean car.
            </p>
            <p className="font-bold text-sm">- Test Reviewer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
