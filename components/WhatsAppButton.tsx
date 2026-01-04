'use client';

const WHATSAPP_URL = 'https://chat.whatsapp.com/DvuQSmCGAm8LZa4G9TXOwf';

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our WhatsApp group"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green-500 shadow-xl flex items-center justify-center hover:bg-green-600 transition-colors"
    >
      <img src="/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
    </a>
  );
}

