import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    const count = reviews.length;
    const avg = count ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10) / 10 : 0;
    return NextResponse.json({ success: true, data: reviews, averageRating: avg, total: count });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_token')?.value;
    const userName = cookieStore.get('user_name')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Please login to write a review' }, { status: 401 });
    }
    const [body] = await Promise.all([request.json(), connectDB()]);
    const { rating, comment } = body;
    if (!rating || !comment) {
      return NextResponse.json({ success: false, error: 'Please provide rating and comment' }, { status: 400 });
    }
    const review = await Review.create({
      userId,
      name: userName || 'User',
      rating: Math.max(1, Math.min(5, Number(rating))),
      comment: String(comment),
    });
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
