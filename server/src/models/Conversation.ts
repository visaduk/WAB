import mongoose, { Schema, Document, Types } from 'mongoose';

export type ConversationStatus = 'open' | 'closed' | 'pending';

export interface IConversation extends Document {
  contact: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  status: ConversationStatus;
  lastMessage?: {
    text: string;
    timestamp: Date;
    direction: 'inbound' | 'outbound';
  };
  unreadCount: number;
  lastInboundAt?: Date;
  windowExpiresAt?: Date;
  isWithinWindow: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'pending'],
      default: 'open',
      index: true,
    },
    lastMessage: {
      text: String,
      timestamp: Date,
      direction: { type: String, enum: ['inbound', 'outbound'] },
    },
    unreadCount: { type: Number, default: 0 },
    lastInboundAt: Date,
    windowExpiresAt: Date,
    isWithinWindow: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ConversationSchema.index({ status: 1, updatedAt: -1 });
ConversationSchema.index({ assignedTo: 1, status: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
