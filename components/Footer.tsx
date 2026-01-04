import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
                AVB
              </div>
              <span className="font-bold text-xl tracking-wide">CABS</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium rides with zero compromise. Your trusted partner for all your transportation needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#why-us" className="hover:text-white transition-colors">Why Choose Us</Link></li>
              <li><Link href="#reviews" className="hover:text-white transition-colors">Reviews</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold mb-6">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p>9591128048</p>
              <p>9380725515</p>
              <p>7338653351</p>
              <p>avbcabz@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; 2026 AVB CABS. All rights reserved. *Terms and conditions apply.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
