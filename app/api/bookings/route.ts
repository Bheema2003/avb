import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Optimization: Parallelize connection and JSON parsing
    const [body] = await Promise.all([
      request.json(),
      connectDB()
    ]);
    const cookieStore = await cookies();
    const userToken = cookieStore.get('user_token')?.value;
    const bookingBody = userToken ? { ...body, userId: userToken } : body;
    const booking = await Booking.create(bookingBody);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
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
