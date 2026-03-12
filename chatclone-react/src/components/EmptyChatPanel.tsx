import { FileText, UserPlus, Sparkles, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const actions = [
  { icon: FileText, label: "Send document" },
  { icon: UserPlus, label: "Add contact" },
  { icon: Sparkles, label: "Ask Meta AI" },
];

export default function EmptyChatPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background">
      {/* Action cards */}
      <div className="flex items-center gap-4">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => toast({ description: `${label} — coming soon` })}
            className="flex h-[120px] w-[140px] flex-col items-center justify-center gap-3 rounded-2xl bg-secondary transition-colors hover:bg-wa-hover"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wa-header">
              <Icon size={20} className="text-wa-icon" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* Encryption footer */}
      <div className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground/50">
        <Lock size={11} />
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
}
