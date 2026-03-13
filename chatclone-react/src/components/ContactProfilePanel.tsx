import { X, Star, Bell, BellOff, Lock, ChevronRight, Trash2, Ban, ThumbsDown } from "lucide-react";
import { contactDisplayName, initials, avatarColor } from "@/lib/format";
import { format } from "date-fns";
import type { Conversation } from "@/types";

interface ContactProfilePanelProps {
  conversation: Conversation;
  onClose: () => void;
}

export default function ContactProfilePanel({ conversation, onClose }: ContactProfilePanelProps) {
  const contact = conversation.contact;
  const name = contactDisplayName(contact);
  const avatar = initials(name);
  const color = avatarColor(contact._id);

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center gap-4 bg-wa-header px-4">
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-wa-hover">
          <X size={20} className="text-wa-icon" />
        </button>
        <span className="text-base font-medium text-foreground">Contact info</span>
      </div>

      {/* Scrollable content */}
      <div className="wa-scrollbar flex-1 overflow-y-auto">
        {/* Avatar & name section */}
        <div className="flex flex-col items-center py-7 bg-card">
          <div
            className="flex h-[200px] w-[200px] items-center justify-center rounded-full text-[64px] font-semibold"
            style={{ backgroundColor: color, color: "white" }}
          >
            {avatar}
          </div>
          <h2 className="mt-4 text-2xl font-normal text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>
        </div>

        <div className="h-2 bg-background" />

        {/* About / Notes section */}
        <div className="px-7 py-4 bg-card">
          <p className="mb-1 text-sm text-wa-green">
            {contact.email ? "Email" : "About"}
          </p>
          <p className="text-sm text-foreground">
            {contact.email || contact.notes || "Hey there! I am using WhatsApp."}
          </p>
        </div>

        <div className="h-2 bg-background" />

        {/* Media, links, docs placeholder */}
        <button className="flex w-full items-center justify-between px-7 py-4 bg-card hover:bg-wa-hover transition-colors">
          <span className="text-sm text-foreground">Media, links and docs</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-sm">0</span>
            <ChevronRight size={16} />
          </div>
        </button>

        <div className="h-2 bg-background" />

        {/* Starred messages */}
        <button className="flex w-full items-center justify-between px-7 py-4 bg-card hover:bg-wa-hover transition-colors">
          <div className="flex items-center gap-6">
            <Star size={18} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Starred messages</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>

        <div className="h-2 bg-background" />

        {/* Notification toggle */}
        <button className="flex w-full items-center gap-6 px-7 py-4 bg-card hover:bg-wa-hover transition-colors">
          {conversation.muted ? (
            <BellOff size={18} className="text-muted-foreground" />
          ) : (
            <Bell size={18} className="text-muted-foreground" />
          )}
          <span className="text-sm text-foreground">
            {conversation.muted ? "Unmute notifications" : "Mute notifications"}
          </span>
        </button>

        {/* Encryption info */}
        <button className="flex w-full items-center gap-6 px-7 py-4 bg-card hover:bg-wa-hover transition-colors">
          <Lock size={18} className="text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm text-foreground">Encryption</p>
            <p className="text-xs text-muted-foreground">Messages are end-to-end encrypted.</p>
          </div>
        </button>

        <div className="h-2 bg-background" />

        {/* Tags */}
        {contact.tags.length > 0 && (
          <>
            <div className="px-7 py-4 bg-card">
              <p className="mb-2 text-sm text-wa-green">Tags</p>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-2 bg-background" />
          </>
        )}

        {/* Contact details */}
        <div className="px-7 py-4 bg-card">
          <p className="mb-2 text-sm text-wa-green">Contact details</p>
          <div className="space-y-2 text-sm text-foreground">
            <p><span className="text-muted-foreground">WhatsApp ID:</span> {contact.waId}</p>
            <p><span className="text-muted-foreground">Phone:</span> {contact.phoneNumber}</p>
            {contact.profileName && (
              <p><span className="text-muted-foreground">Profile name:</span> {contact.profileName}</p>
            )}
            {contact.name && (
              <p><span className="text-muted-foreground">Name:</span> {contact.name}</p>
            )}
            <p>
              <span className="text-muted-foreground">Joined:</span>{" "}
              {format(new Date(contact.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Conversation info */}
        <div className="px-7 py-4 bg-card">
          <p className="mb-2 text-sm text-wa-green">Conversation</p>
          <div className="space-y-2 text-sm text-foreground">
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span className={
                conversation.status === "open"
                  ? "text-green-500"
                  : conversation.status === "pending"
                    ? "text-yellow-500"
                    : "text-muted-foreground"
              }>
                {conversation.status}
              </span>
            </p>
            {conversation.assignedTo && (
              <p><span className="text-muted-foreground">Assigned to:</span> {conversation.assignedTo.name}</p>
            )}
            <p>
              <span className="text-muted-foreground">24h window:</span>{" "}
              <span className={conversation.isWithinWindow ? "text-green-500" : "text-red-400"}>
                {conversation.isWithinWindow ? "Active" : "Expired"}
              </span>
            </p>
          </div>
        </div>

        <div className="h-2 bg-background" />

        {/* Danger zone */}
        <div className="py-2 bg-card">
          <button className="flex w-full items-center gap-6 px-7 py-3 hover:bg-wa-hover transition-colors">
            <Ban size={18} className="text-destructive" />
            <span className="text-sm text-destructive">Block {name}</span>
          </button>
          <button className="flex w-full items-center gap-6 px-7 py-3 hover:bg-wa-hover transition-colors">
            <ThumbsDown size={18} className="text-destructive" />
            <span className="text-sm text-destructive">Report {name}</span>
          </button>
          <button className="flex w-full items-center gap-6 px-7 py-3 hover:bg-wa-hover transition-colors">
            <Trash2 size={18} className="text-destructive" />
            <span className="text-sm text-destructive">Delete chat</span>
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
