// ─── Domain types aligned with the WAB backend ──────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
  isOnline?: boolean;
  avatar?: string;
  activeConversations?: number;
}

export interface Contact {
  _id: string;
  waId: string;
  phoneNumber: string;
  profileName?: string;
  name?: string;
  email?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  contact: Contact;
  assignedTo?: User | null;
  status: 'open' | 'closed' | 'pending';
  lastMessage?: {
    text: string;
    timestamp: string;
    direction: 'inbound' | 'outbound';
  };
  unreadCount: number;
  lastInboundAt?: string;
  windowExpiresAt?: string;
  isWithinWindow: boolean;
  pinned?: boolean;
  muted?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  contact: Contact | string;
  waMessageId?: string;
  direction: 'inbound' | 'outbound';
  type: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  text?: { body: string; previewUrl?: boolean };
  media?: {
    mediaId?: string;
    url?: string;
    mimeType?: string;
    filename?: string;
    caption?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  interactive?: {
    type: string;
    body?: { text: string };
    action?: unknown;
    buttonReply?: { id: string; title: string };
    listReply?: { id: string; title: string; description?: string };
  };
  template?: {
    name: string;
    language: string;
    components?: Array<Record<string, unknown>>;
  };
  context?: { messageId: string };
  sentBy?: { _id: string; name: string; avatar?: string };
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedReason?: string;
  timestamp: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
