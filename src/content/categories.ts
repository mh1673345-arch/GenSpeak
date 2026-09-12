export type CategorySlug =
  | "slang"
  | "meme"
  | "ai"
  | "gaming"
  | "social"
  | "web3"
  | "fandom"
  | "work"
  | "oldweb"
  | "tech"
  | "stream"
  | "anime"
  | "aesthetic"
  | "dating"
  | "discourse"
  | "text";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  /** lucide-react icon name, mapped in components/category-icon.tsx */
  icon: string;
  /** Signature hue used for gradients, chips and rings. */
  hue: number;
};

export const categories: Category[] = [
  {
    slug: "slang",
    name: "Internet Slang",
    tagline: "The everyday vocabulary of being online",
    description:
      "Words that started in group chats, comment sections and replies, then leaked into how everyone talks. Fast-moving, often ironic, and usually older than people assume.",
    icon: "MessageCircle",
    hue: 258,
  },
  {
    slug: "meme",
    name: "Meme Culture",
    tagline: "Formats, in-jokes and viral artifacts",
    description:
      "The grammar of internet humour: templates, copypasta, reaction images and the unwritten rules that decide whether a joke lands or dies.",
    icon: "Sparkles",
    hue: 330,
  },
  {
    slug: "ai",
    name: "AI & Machine Learning",
    tagline: "The language of the model era",
    description:
      "Terminology from labs, papers and product launches that escaped into everyday speech. Precise definitions for words people now use loosely.",
    icon: "Bot",
    hue: 190,
  },
  {
    slug: "gaming",
    name: "Gaming",
    tagline: "From lobbies to leaderboards",
    description:
      "Competitive shorthand, design vocabulary and lobby etiquette. Much of modern internet slang was play-tested in a voice chat first.",
    icon: "Gamepad2",
    hue: 145,
  },
  {
    slug: "social",
    name: "Social & Creator",
    tagline: "Platform-native language",
    description:
      "How feeds, algorithms and the creator economy reshaped vocabulary, including the coded words people invented to get around moderation.",
    icon: "Users",
    hue: 22,
  },
  {
    slug: "web3",
    name: "Crypto & Web3",
    tagline: "Markets, mania and the words in between",
    description:
      "A dense dialect built from trading floors, forums and typos. Defined plainly, without the hype and without the sneering.",
    icon: "Coins",
    hue: 45,
  },
  {
    slug: "fandom",
    name: "Fandom & Stan Culture",
    tagline: "Devotion, canon and community",
    description:
      "The vocabulary of organised enthusiasm across pop, sport, film and everything with a fanbase big enough to build its own language.",
    icon: "Heart",
    hue: 300,
  },
  {
    slug: "work",
    name: "Work & Money",
    tagline: "Where internet culture met the payslip",
    description:
      "Labour and personal-finance terms that went viral. Most describe something workers always felt but never had a name for.",
    icon: "Briefcase",
    hue: 210,
  },
  {
    slug: "oldweb",
    name: "Old Web & Forums",
    tagline: "Before the feed, there were boards",
    description:
      "Usenet, BBSes, IRC, phpBB and the early web. Half of what people think TikTok invented was settled etiquette on a mailing list in 1994.",
    icon: "Globe",
    hue: 165,
  },
  {
    slug: "tech",
    name: "Tech & Developer",
    tagline: "Shop talk that escaped the shop",
    description:
      "Engineering jargon, startup vocabulary and hacker culture, including the many terms that now mean something different outside the industry.",
    icon: "Terminal",
    hue: 235,
  },
  {
    slug: "stream",
    name: "Streaming & Twitch",
    tagline: "Live, and permanently in chat",
    description:
      "Emote language, chat rituals and the economics of watching someone play. Twitch chat is arguably the fastest dialect generator online.",
    icon: "Clapperboard",
    hue: 278,
  },
  {
    slug: "anime",
    name: "Anime & Weeb",
    tagline: "Loanwords, tropes and fan shorthand",
    description:
      "Japanese loanwords and fan-scene vocabulary that travelled through fansubs and imageboards into general internet English.",
    icon: "Star",
    hue: 350,
  },
  {
    slug: "aesthetic",
    name: "Aesthetics & Cores",
    tagline: "Identity as a mood board",
    description:
      "The suffix-driven visual subcultures of Tumblr, Pinterest and TikTok, where a name, a palette and a playlist make a whole way of being.",
    icon: "Palette",
    hue: 175,
  },
  {
    slug: "dating",
    name: "Dating & Relationships",
    tagline: "Modern romance, named",
    description:
      "The vocabulary that appeared once courtship moved onto apps: new words for old behaviours, and a few genuinely new behaviours.",
    icon: "Flame",
    hue: 8,
  },
  {
    slug: "discourse",
    name: "Discourse & Moderation",
    tagline: "How arguments work here",
    description:
      "The mechanics of online argument, from moderation policy to the named fallacies and rhetorical moves that recur in every comment section.",
    icon: "MessagesSquare",
    hue: 95,
  },
  {
    slug: "text",
    name: "Text & Typography",
    tagline: "Tone of voice, in plain characters",
    description:
      "Acronyms, emoji conventions, casing and punctuation. The internet rebuilt prosody out of lowercase letters and full stops.",
    icon: "Type",
    hue: 52,
  },
];

export const categoryMap = new Map<CategorySlug, Category>(
  categories.map((category) => [category.slug, category]),
);

export function getCategory(slug: string): Category | undefined {
  return categoryMap.get(slug as CategorySlug);
}
