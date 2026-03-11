import mongoose, { Schema, Document, Types } from 'mongoose';

export type MessageDirection = 'inbound' | 'outbound';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType =
  | 'text' | 'image' | 'video' | 'audio' | 'document'
  | 'location' | 'contacts' | 'interactive' | 'template'
  | 'reaction' | 'sticker';

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  contact: Types.ObjectId;
  waMessageId?: string;
  direction: MessageDirection;
  type: MessageType;
  status: MessageStatus;
  text?: { body: string; previewUrl?: boolean };
  media?: {
    mediaId?: string;
    url?: string;
    mimeType?: string;
    filename?: string;
    caption?: string;
    sha256?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  interactive?: {
    type: string;
    header?: Record<string, unknown>;
    body?: Record<string, unknown>;
    footer?: Record<string, unknown>;
    action?: Record<string, unknown>;
    buttonReply?: { id: string; title: string };
    listReply?: { id: string; title: string; description?: string };
  };
  template?: {
    name: string;
    language: string;
    components?: Array<Record<string, unknown>>;
  };
  context?: { messageId: string };
  sentBy?: Types.ObjectId;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedReason?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    waMessageId: { type: String, sparse: true, index: true },
    direction: { type: String, enum: ['inbound', 'outbound'], required: true },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'contacts', 'interactive', 'template', 'reaction', 'sticker'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      default: 'pending',
    },
    text: { body: String, previewUrl: Boolean },
    media: {
      mediaId: String,
      url: String,
      mimeType: String,
      filename: String,
      caption: String,
      sha256: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
      name: String,
      address: String,
    },
    interactive: Schema.Types.Mixed,
    template: {
      name: String,
      language: String,
      components: [Schema.Types.Mixed],
    },
    context: { messageId: String },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date,
    failedReason: String,
    timestamp: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, timestamp: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
