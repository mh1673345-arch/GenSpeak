import {
  Bot,
  Briefcase,
  Clapperboard,
  Coins,
  Flame,
  Gamepad2,
  Globe,
  Heart,
  MessageCircle,
  MessagesSquare,
  Palette,
  Sparkles,
  Star,
  Terminal,
  Type,
  Users,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  MessageCircle,
  Sparkles,
  Bot,
  Gamepad2,
  Users,
  Coins,
  Heart,
  Briefcase,
  Globe,
  Terminal,
  Clapperboard,
  Star,
  Palette,
  Flame,
  MessagesSquare,
  Type,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
