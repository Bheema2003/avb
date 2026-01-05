import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('user_token')?.value;
    if (!userToken) {
      return NextResponse.json(
        { success: false, error: 'Please login to book a ride' },
        { status: 401 }
      );
    }

    const [body] = await Promise.all([
      request.json(),
      connectDB()
    ]);

    const bookingBody = { ...body, userId: userToken };
    const booking = await Booking.create(bookingBody);

    const localBase = process.env.NEXT_PUBLIC_EMAIL_GATEWAY_URL || 'http://localhost:4000';
    const renderBase = process.env.EMAIL_GATEWAY_URL || 'https://avb-email-backend.onrender.com';
    const localHealth = `${localBase}/health`;
    const localGateway = `${localBase}/api/bookings`;
    const renderGateway = `${renderBase}/api/bookings`;
    let emailQueued = false;
    try {
      emailQueued = true;
      const payload = {
        name: body.name,
        contactNumber: body.contactNumber,
        pickupLocation: body.pickupLocation,
        dropLocation: body.dropLocation,
        pickupDate: body.pickupDate,
        pickupTime: body.pickupTime,
        tripType: body.tripType,
      };
      // Fire-and-forget with local-first fallback
      // @ts-ignore
      (async () => {
        try {
          const ping = await fetch(localHealth, { method: 'GET' });
          if (ping.ok) {
            const resp = await fetch(localGateway, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (resp.ok) {
              return;
            }
            throw new Error('Local email gateway responded with non-2xx');
          }
        } catch {}
        try {
          await fetch(renderGateway, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {}
      })();
    } catch {}

    return NextResponse.json({ success: true, data: booking, emailQueued }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking', detail: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const userToken = cookieStore.get('user_token')?.value;

    if (adminToken) {
      const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: bookings });
    }

    if (userToken) {
      const bookings = await Booking.find({ userId: userToken }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, data: bookings });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
