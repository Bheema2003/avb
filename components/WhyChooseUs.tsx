import { ShieldCheck, Clock, Car, CreditCard, Headphones, CigaretteOff } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secured Booking',
    description: 'Do online payment with zero security risk',
  },
  {
    icon: Clock,
    title: 'Reliable Services',
    description: 'We are punctual and we take our customers as a first priority',
  },
  {
    icon: Car,
    title: 'Luxury Cars',
    description: 'We have wide variety of luxury cars available',
  },
  {
    icon: CreditCard,
    title: 'Credit Cards Accepted',
    description: 'We accept credit cards without any hassle via our online payment system',
  },
  {
    icon: Headphones,
    title: 'Customer Service',
    description: 'You can always reach us 24/7 for any query',
  },
  {
    icon: CigaretteOff,
    title: 'No Smoking',
    description: 'No smoking inside a car',
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-500 text-lg">Best services in the city</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
