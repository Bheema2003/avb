// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SMTP health check
app.get('/health/smtp', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({ status: 'ok', smtp: 'verified', email: process.env.SMTP_EMAIL });
  } catch (err) {
    console.error('SMTP verify error:', err);
    res.status(500).json({ status: 'error', smtp: 'failed', message: err?.message || String(err) });
  }
});
// Normalize incoming booking payload to a consistent shape
function normalizeBooking(body) {
  return {
    name: body.name,
    phone: body.phone || body.contactNumber,
    pickup: body.pickup || body.pickupLocation,
    drop: body.drop || body.dropLocation,
    date: body.date || body.pickupDate,
    time: body.time || body.pickupTime,
    serviceType: body.serviceType || body.tripType || 'Cab',
  };
}

// Email transporter (Gmail SMTP with App Password)
function createTransporter() {
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Missing SMTP_EMAIL or SMTP_APP_PASSWORD in environment');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

// Endpoint: send booking email
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = normalizeBooking(req.body || {});
    const required = ['name', 'phone', 'pickup', 'drop', 'date', 'time'];
    const missing = required.filter((k) => !booking[k]);
    if (missing.length) {
      return res.status(400).json({ success: false, error: `Missing fields: ${missing.join(', ')}` });
    }

    const transporter = createTransporter();
    const to = 'avbcabz@gmail.com';
    const subject = 'New Cab Booking Received';

    const bookingTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const text = [
      'AVB Cabs - New Booking Notification',
      `Customer Name: ${booking.name}`,
      `Service Type: ${booking.serviceType}`,
      `Pickup From: ${booking.pickup}`,
      `Destination: ${booking.drop}`,
      `Pickup Date: ${booking.date}`,
      `Pickup Time: ${booking.time}`,
      `Contact Number: ${booking.phone}`,
      `Booking Time: ${bookingTime}`,
      'Contact Numbers:',
      '9591128048',
      '8073166031',
      '7338653351',
    ].join('\\n');

    const html = `
      <div style="background:#0f172a;padding:24px;font-family:Inter,Arial,sans-serif;color:#e5e7eb">
        <div style="max-width:640px;margin:0 auto;background:#111827;border-radius:12px;overflow:hidden;border:1px solid #1f2937">
          <div style="background:#6366f1;color:#fff;padding:20px 24px">
            <div style="font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px">
              <span>🚕</span> <span>AVB Cabs</span>
            </div>
            <div style="font-size:13px;margin-top:6px">New Booking Notification</div>
          </div>
          <div style="padding:24px">
            <div style="font-size:18px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
              <span>📋</span> <span>Booking Details</span>
            </div>
            <div style="border-top:1px solid #374151"></div>
            <table style="width:100%;margin-top:12px;color:#e5e7eb;font-size:14px">
              <tbody>
                <tr><td style="padding:10px 0;color:#93c5fd">Customer Name:</td><td style="padding:10px 0">${booking.name}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Service Type:</td><td style="padding:10px 0">${booking.serviceType}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Pickup From:</td><td style="padding:10px 0">${booking.pickup}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Destination:</td><td style="padding:10px 0">${booking.drop}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Pickup Date:</td><td style="padding:10px 0">${booking.date}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Pickup Time:</td><td style="padding:10px 0">${booking.time}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Contact Number:</td><td style="padding:10px 0">${booking.phone}</td></tr>
                <tr><td style="padding:10px 0;color:#93c5fd">Booking Time:</td><td style="padding:10px 0">${bookingTime}</td></tr>
              </tbody>
            </table>
            <div style="margin-top:20px;padding:16px;background:#1f2937;border-radius:10px;color:#e5e7eb">
              <div style="font-weight:600;margin-bottom:8px">☎ Contact Numbers:</div>
              <div>• 9591128048</div>
              <div>• 8073166031</div>
              <div>• 7338653351</div>
            </div>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
      html,
    });

    return res.json({ success: true, message: 'Booking email sent' });
  } catch (err) {
    console.error('Email send error:', err);
    const message = err?.message || String(err);
    return res.status(500).json({ success: false, error: 'Failed to send booking email', detail: message });
  }
});

app.listen(PORT, () => {
  console.log(`Email backend running on http://localhost:${PORT}`);
});
