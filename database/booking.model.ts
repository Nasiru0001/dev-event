import mongoose, { Document, Model, Schema, Types } from 'mongoose';

/**
 * TypeScript interface for Booking document
 * Extends Document to include Mongoose document properties
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 compliant email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents orphaned bookings for non-existent events
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      // Import Event model to check if event exists
      const Event = mongoose.model('Event');
      const eventExists = await Event.exists({ _id: this.eventId });

      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Error validating event reference'));
    }
  }

  next();
});

// Create index on eventId for faster queries when fetching bookings by event
BookingSchema.index({ eventId: 1 });

// Create compound index for finding bookings by event and email
BookingSchema.index({ eventId: 1, email: 1 });

// Prevent model recompilation in development (Next.js hot reload)
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
