import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  waId: string;
  phoneNumber: string;
  profileName?: string;
  name?: string;
  email?: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    waId: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: true },
    profileName: String,
    name: String,
    email: String,
    notes: String,
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
