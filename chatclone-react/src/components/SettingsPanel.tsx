import { useState } from "react";
import {
  Bell,
  Lock,
  Globe,
  Palette,
  MessageCircle,
  HardDrive,
  Keyboard,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { initials, avatarColor } from "@/lib/format";

interface SettingItem {
  icon: typeof Bell;
  label: string;
  description?: string;
  toggle?: boolean;
}

const settingSections: { title?: string; items: SettingItem[] }[] = [
  {
    items: [
      { icon: Bell, label: "Notifications", description: "Message, group & call tones" },
      { icon: Lock, label: "Privacy", description: "Block contacts, disappearing messages" },
      { icon: Lock, label: "Security", description: "Control your security notifications" },
    ],
  },
  {
    title: "General",
    items: [
      { icon: Palette, label: "Theme", description: "Dark mode" },
      { icon: Globe, label: "Language", description: "English" },
      { icon: MessageCircle, label: "Chat wallpaper", description: "Set a background for your chats" },
      { icon: Keyboard, label: "Keyboard shortcuts", description: "View available shortcuts" },
    ],
  },
  {
    title: "Storage & Data",
    items: [
      { icon: HardDrive, label: "Storage and data", description: "Network usage, auto-download" },
    ],
  },
  {
    title: "Help",
    items: [
      { icon: HelpCircle, label: "Help", description: "Help centre, contact us, privacy policy" },
    ],
  },
];

export default function SettingsPanel() {
  const { user, logout } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Notifications: true,
  });

  const handleToggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const color = user ? avatarColor(user.id) : "#54656f";
  const userInitial = user ? initials(user.name) : "?";

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex h-[60px] items-center gap-4 px-5">
        <h1 className="text-[22px] font-bold text-foreground">Settings</h1>
      </div>

      {/* Profile section */}
      <button className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-wa-hover">
        <div
          className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {userInitial}
        </div>
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className="truncate text-[17px] font-medium text-foreground">
            {user?.name ?? "User"}
          </span>
          <span className="truncate text-[13px] text-muted-foreground">
            {user?.email ?? ""}
          </span>
        </div>
        <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
      </button>

      {/* Scrollable settings list */}
      <div className="flex-1 overflow-y-auto wa-scrollbar">
        {settingSections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <div className="px-5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-primary">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-wa-hover"
                  onClick={() => item.toggle !== undefined ? handleToggle(item.label) : undefined}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Icon size={18} className="text-wa-icon" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[15px] text-foreground">{item.label}</span>
                    {item.description && (
                      <span className="truncate text-[12px] text-muted-foreground">{item.description}</span>
                    )}
                  </div>
                  {item.label === "Notifications" ? (
                    <div
                      role="switch"
                      aria-checked={toggles.Notifications}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle("Notifications");
                      }}
                      className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                        toggles.Notifications ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          toggles.Notifications ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Logout */}
        <div className="border-t border-border mt-2 pt-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-wa-hover"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <LogOut size={18} className="text-destructive" />
            </div>
            <span className="text-[15px] text-destructive">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
