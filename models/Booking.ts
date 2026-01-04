import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  tripType: 'Airport' | 'Local' | 'One Way' | 'Round Trip';
  name: string;
  userId?: string;
  pickupLocation: string;
  dropLocation?: string;
  pickupDate: string;
  pickupTime: string;
  contactNumber: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  tripType: {
    type: String,
    enum: ['Airport', 'Local', 'One Way', 'Round Trip'],
    required: true,
  },
  name: { type: String, required: true },
  userId: { type: String },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
