import BookingForm from './BookingForm';

const Hero = () => {
  return (
    <section className="relative bg-gray-900 text-white min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
         {/* Replace with actual image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Car" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Premium <br />
            Rides. <br />
            Zero <br />
            Compromise.
          </h1>
          <p className="text-xl text-gray-300">
            Book now to avail discounts up to 10%
          </p>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-yellow-400 pt-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              24/7 Availability
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Professional Drivers
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Luxury Fleet
            </span>
          </div>

          <div className="pt-8 space-y-2">
            <h3 className="font-bold text-lg">Contact Us</h3>
            <p className="text-2xl font-bold">7338653351 | 9591128048 | 8073166031</p>
            <p className="text-gray-400">avbcabz@gmail.com</p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <BookingForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
