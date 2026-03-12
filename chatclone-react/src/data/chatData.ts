export interface Message {
  id: string;
  text: string;
  time: string;
  incoming: boolean;
  read?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  pinned?: boolean;
  muted?: boolean;
  online?: boolean;
  lastSeen?: string;
  messages: Message[];
}

const avatarColors = [
  "hsl(168, 100%, 33%)",
  "hsl(200, 60%, 50%)",
  "hsl(340, 65%, 55%)",
  "hsl(45, 85%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(15, 75%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(130, 50%, 45%)",
];

export function getAvatarColor(index: number) {
  return avatarColors[index % avatarColors.length];
}

export const chats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "AJ",
    lastMessage: "Sure, let me check and get back to you!",
    time: "10:42 AM",
    unread: 2,
    online: true,
    messages: [
      { id: "1a", text: "Hey! How's the project going?", time: "10:30 AM", incoming: true },
      { id: "1b", text: "Going well! Almost done with the frontend", time: "10:32 AM", incoming: false, read: true },
      { id: "1c", text: "That's great! Can you share the latest build?", time: "10:35 AM", incoming: true },
      { id: "1d", text: "Sure, I'll push it to staging in a few minutes", time: "10:36 AM", incoming: false, read: true },
      { id: "1e", text: "Do you have the API docs for the new endpoints?", time: "10:38 AM", incoming: true },
      { id: "1f", text: "Sure, let me check and get back to you!", time: "10:42 AM", incoming: true },
    ],
  },
  {
    id: "2",
    name: "Work Group 🏢",
    avatar: "WG",
    lastMessage: "Bob: Meeting moved to 3 PM",
    time: "10:15 AM",
    unread: 5,
    pinned: true,
    messages: [
      { id: "2a", text: "Good morning everyone!", time: "9:00 AM", incoming: true },
      { id: "2b", text: "Morning! Ready for the standup?", time: "9:01 AM", incoming: false, read: true },
      { id: "2c", text: "Let's push it to 9:30, need to finish something", time: "9:05 AM", incoming: true },
      { id: "2d", text: "Works for me", time: "9:06 AM", incoming: false, read: true },
      { id: "2e", text: "Meeting moved to 3 PM", time: "10:15 AM", incoming: true },
    ],
  },
  {
    id: "3",
    name: "David Chen",
    avatar: "DC",
    lastMessage: "Thanks for the recommendation! 📚",
    time: "9:30 AM",
    unread: 0,
    lastSeen: "today at 9:45 AM",
    messages: [
      { id: "3a", text: "Have you read any good books lately?", time: "9:15 AM", incoming: false, read: true },
      { id: "3b", text: "Yes! I just finished Project Hail Mary", time: "9:20 AM", incoming: true },
      { id: "3c", text: "Oh I loved that one! Try The Martian next", time: "9:25 AM", incoming: false, read: true },
      { id: "3d", text: "Thanks for the recommendation! 📚", time: "9:30 AM", incoming: true },
    ],
  },
  {
    id: "4",
    name: "Sarah Miller",
    avatar: "SM",
    lastMessage: "See you at the café at 5! ☕",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      { id: "4a", text: "Want to grab coffee later?", time: "Yesterday", incoming: true },
      { id: "4b", text: "Yes! What time works for you?", time: "Yesterday", incoming: false, read: true },
      { id: "4c", text: "How about 5 PM?", time: "Yesterday", incoming: true },
      { id: "4d", text: "Perfect, where?", time: "Yesterday", incoming: false, read: true },
      { id: "4e", text: "See you at the café at 5! ☕", time: "Yesterday", incoming: true },
    ],
  },
  {
    id: "5",
    name: "Family Group ❤️",
    avatar: "FG",
    lastMessage: "Mom: Don't forget dinner on Sunday!",
    time: "Yesterday",
    unread: 0,
    pinned: true,
    muted: true,
    messages: [
      { id: "5a", text: "Happy birthday Dad! 🎂🎉", time: "Yesterday", incoming: false, read: true },
      { id: "5b", text: "Thank you sweetheart! ❤️", time: "Yesterday", incoming: true },
      { id: "5c", text: "Don't forget dinner on Sunday!", time: "Yesterday", incoming: true },
    ],
  },
  {
    id: "6",
    name: "Mike Thompson",
    avatar: "MT",
    lastMessage: "The game was incredible last night!",
    time: "Tuesday",
    unread: 0,
    lastSeen: "Tuesday at 11:30 PM",
    messages: [
      { id: "6a", text: "Did you watch the game?", time: "Tuesday", incoming: true },
      { id: "6b", text: "Yes!! What a finish!", time: "Tuesday", incoming: false, read: true },
      { id: "6c", text: "The game was incredible last night!", time: "Tuesday", incoming: true },
    ],
  },
  {
    id: "7",
    name: "Emma Wilson",
    avatar: "EW",
    lastMessage: "I'll send you the photos tomorrow",
    time: "Monday",
    unread: 0,
    lastSeen: "today at 8:00 AM",
    messages: [
      { id: "7a", text: "The trip was amazing!", time: "Monday", incoming: true },
      { id: "7b", text: "Right?! Best vacation ever", time: "Monday", incoming: false, read: true },
      { id: "7c", text: "I'll send you the photos tomorrow", time: "Monday", incoming: true },
    ],
  },
  {
    id: "8",
    name: "Tech Updates 💻",
    avatar: "TU",
    lastMessage: "New React 19 features are out!",
    time: "Monday",
    unread: 12,
    muted: true,
    messages: [
      { id: "8a", text: "TypeScript 5.4 released!", time: "Monday", incoming: true },
      { id: "8b", text: "New React 19 features are out!", time: "Monday", incoming: true },
    ],
  },
];
