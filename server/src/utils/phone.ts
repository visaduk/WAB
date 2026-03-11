/**
 * Normalize phone number to E.164 format (without +).
 * WhatsApp uses E.164 without the + prefix for waId.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Format phone for display.
 */
export function formatPhone(phone: string): string {
  const digits = normalizePhone(phone);
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  return `+${digits}`;
}
