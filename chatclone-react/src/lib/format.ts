import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import type { Conversation, Contact } from '@/types';

/**
 * Extract display name from a contact.
 */
export function contactDisplayName(contact: Contact): string {
  return contact.profileName || contact.name || contact.phoneNumber;
}

/**
 * Extract initials from a name (max 2 chars).
 */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/**
 * Deterministic avatar color from a string (consistent per contact).
 */
const avatarColors = [
  'hsl(168, 100%, 33%)',
  'hsl(200, 60%, 50%)',
  'hsl(340, 65%, 55%)',
  'hsl(45, 85%, 55%)',
  'hsl(270, 50%, 55%)',
  'hsl(15, 75%, 55%)',
  'hsl(190, 70%, 45%)',
  'hsl(130, 50%, 45%)',
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/**
 * Format a timestamp for the sidebar list (relative display).
 */
export function formatSidebarTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  if (isThisWeek(d)) return format(d, 'EEEE'); // Monday, Tuesday…
  return format(d, 'MM/dd/yyyy');
}

/**
 * Format a message timestamp for the chat bubble.
 */
export function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return format(d, 'h:mm a');
}

/**
 * Format a date for the chat date separator.
 */
export function formatDateSeparator(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
}

/**
 * Get last message preview text from a conversation.
 */
export function lastMessagePreview(conv: Conversation): string {
  if (!conv.lastMessage) return '';
  return conv.lastMessage.text || '';
}
