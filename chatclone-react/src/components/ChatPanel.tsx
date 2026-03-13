import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, Lock,
  ChevronDown, Check, CheckCheck, Loader2, FileText, AlertCircle,
} from "lucide-react";
import { useMessages, useMessageUpdaters } from "@/hooks/useMessages";
import { sendMessage, uploadMedia } from "@/api/messages";
import { markConversationRead } from "@/api/conversations";
import { contactDisplayName, initials, avatarColor, formatMessageTime, formatDateSeparator } from "@/lib/format";
import type { Conversation, Message } from "@/types";

interface ChatPanelProps {
  conversation: Conversation;
  onToggleProfile?: () => void;
  isProfileOpen?: boolean;
}

/** Check whether two timestamps fall on different calendar days */
function isDifferentDay(a: string, b: string) {
  return new Date(a).toDateString() !== new Date(b).toDateString();
}

export default function ChatPanel({ conversation, onToggleProfile, isProfileOpen }: ChatPanelProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMessages(conversation._id);
  const { appendMessage } = useMessageUpdaters(conversation._id);

  const messages = data?.messages ?? [];

  const name = contactDisplayName(conversation.contact);
  const avatar = initials(name);
  const color = avatarColor(conversation.contact._id);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Reset input when conversation changes
  useEffect(() => {
    setText("");
  }, [conversation._id]);

  // Mark as read when conversation opens
  useEffect(() => {
    if (conversation.unreadCount > 0) {
      markConversationRead(conversation._id).catch(() => {});
    }
  }, [conversation._id, conversation.unreadCount]);

  // ─── Send text message ────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage({
        conversationId: conversation._id,
        type: "text",
        text: body,
      });
      appendMessage(msg);
      setText("");
    } catch {
      // Could integrate toast here
    } finally {
      setSending(false);
    }
  }, [text, sending, conversation._id, appendMessage]);

  // ─── File upload handler ──────────────────────────────────────────────────────
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const { mediaId, mimeType, filename } = await uploadMedia(file);
        const type = mimeType.startsWith("image/")
          ? "image"
          : mimeType.startsWith("video/")
            ? "video"
            : mimeType.startsWith("audio/")
              ? "audio"
              : "document";
        const msg = await sendMessage({
          conversationId: conversation._id,
          type,
          mediaId,
          mimeType,
          filename,
        });
        appendMessage(msg);
      } catch {
        // Could integrate toast here
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [conversation._id, appendMessage],
  );

  // ─── Render message status checkmarks ─────────────────────────────────────────
  const StatusIcon = useCallback(({ status }: { status: Message["status"] }) => {
    switch (status) {
      case "read":
        return <CheckCheck size={16} className="text-wa-read-check" />;
      case "delivered":
        return <CheckCheck size={16} className="text-muted-foreground/50" />;
      case "sent":
        return <Check size={16} className="text-muted-foreground/50" />;
      case "failed":
        return <AlertCircle size={14} className="text-destructive" />;
      default: // pending
        return <Loader2 size={14} className="animate-spin text-muted-foreground/40" />;
    }
  }, []);

  // ─── Extract display text from a message ──────────────────────────────────────
  const messageBody = useCallback((msg: Message): string => {
    if (msg.text?.body) return msg.text.body;
    if (msg.media?.caption) return msg.media.caption;
    if (msg.media?.filename) return `📎 ${msg.media.filename}`;
    if (msg.location) return `📍 ${msg.location.name || "Location"}`;
    if (msg.interactive?.body?.text) return msg.interactive.body.text;
    if (msg.interactive?.buttonReply?.title) return msg.interactive.buttonReply.title;
    if (msg.interactive?.listReply?.title) return msg.interactive.listReply.title;
    if (msg.template) return `📋 Template: ${msg.template.name}`;
    return "";
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-wa-header px-4">
        <button className="flex items-center gap-3 rounded-lg px-1 -ml-1 hover:bg-wa-hover transition-colors" onClick={onToggleProfile}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
            style={{ backgroundColor: color, color: "white" }}
          >
            {avatar}
          </div>
          <div className="text-left">
            <p className="text-base font-normal text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{conversation.contact.phoneNumber}</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-wa-hover"><Video size={20} className="text-wa-icon" /></button>
          <button className="rounded-full p-2 hover:bg-wa-hover"><Phone size={20} className="text-wa-icon" /></button>
          <button className="rounded-full p-2 hover:bg-wa-hover"><Search size={20} className="text-wa-icon" /></button>
          <button className="rounded-full p-2 hover:bg-wa-hover"><MoreVertical size={20} className="text-wa-icon" /></button>
        </div>
      </div>

      {/* Messages area */}
      <div className="wa-wallpaper wa-scrollbar flex-1 overflow-y-auto px-[5%] py-4 lg:px-[10%]">
        {/* Encryption notice */}
        <div className="mx-auto mb-4 flex max-w-md items-center justify-center gap-1 rounded-lg bg-wa-date-chip px-3 py-2 text-center">
          <Lock size={12} className="shrink-0 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">
            Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        )}

        {/* Messages with date separators */}
        {messages.map((msg, i) => {
          const isInbound = msg.direction === "inbound";
          const showTail = i === 0 || messages[i - 1].direction !== msg.direction;
          const showDateSep = i === 0 || isDifferentDay(messages[i - 1].timestamp, msg.timestamp);
          const body = messageBody(msg);

          return (
            <div key={msg._id}>
              {showDateSep && (
                <div className="mb-4 mt-2 flex justify-center">
                  <span className="rounded-lg bg-wa-date-chip px-3 py-1 text-[12px] text-muted-foreground shadow-sm">
                    {formatDateSeparator(msg.timestamp)}
                  </span>
                </div>
              )}

              <div className={`mb-1 flex ${isInbound ? "justify-start" : "justify-end"}`}>
                <div
                  className={`group relative max-w-[65%] rounded-lg px-2.5 pb-1 pt-1.5 shadow-sm ${
                    isInbound
                      ? `bg-wa-incoming ${showTail ? "bubble-tail-in ml-2" : ""}`
                      : `bg-wa-outgoing ${showTail ? "bubble-tail-out mr-2" : ""}`
                  }`}
                >
                  <button className="absolute right-1 top-1 hidden rounded-full p-0.5 group-hover:block">
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </button>

                  {/* Media preview */}
                  {msg.media?.url && msg.type === "image" && (
                    <img
                      src={msg.media.url}
                      alt={msg.media.filename || "image"}
                      className="mb-1 max-h-60 rounded object-contain"
                    />
                  )}
                  {msg.media?.url && msg.type === "document" && (
                    <a
                      href={msg.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-1 flex items-center gap-2 rounded bg-muted/50 px-2 py-1.5 text-xs text-primary hover:underline"
                    >
                      <FileText size={16} />
                      {msg.media.filename || "Document"}
                    </a>
                  )}

                  {body && <p className="text-[14.2px] leading-[19px] text-foreground">{body}</p>}

                  <div className="flex items-center justify-end gap-1 -mb-0.5">
                    <span className="text-[11px] text-muted-foreground/70">
                      {formatMessageTime(msg.timestamp)}
                    </span>
                    {!isInbound && <StatusIcon status={msg.status} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose area */}
      <div className="flex h-[62px] shrink-0 items-center gap-2 bg-wa-header px-4">
        <button className="rounded-full p-2 hover:bg-wa-hover">
          <Smile size={24} className="text-wa-icon" />
        </button>
        <button className="rounded-full p-2 hover:bg-wa-hover" onClick={() => fileInputRef.current?.click()}>
          <Paperclip size={24} className="text-wa-icon" />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
        <div className="flex flex-1 items-center rounded-lg bg-wa-compose px-3 py-2">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={sending}
          />
        </div>
        <button
          className="rounded-full p-2 hover:bg-wa-hover"
          onClick={text.trim() ? handleSend : undefined}
          disabled={sending}
        >
          {text.trim() ? (
            sending ? <Loader2 size={24} className="animate-spin text-wa-icon" /> : <Send size={24} className="text-wa-icon" />
          ) : (
            <Mic size={24} className="text-wa-icon" />
          )}
        </button>
      </div>
    </div>
  );
}
