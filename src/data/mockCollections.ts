export interface CuratedCollection {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerGradient: string;
  wordSlugs: string[];
  articles: { title: string; readTime: string; link: string }[];
}

export const mockCollections: CuratedCollection[] = [
  {
    id: "c1",
    title: "Top TikTok Slang",
    slug: "top-tiktok-slang",
    description: "The absolute essential terms defining the TikTok comments, audio trends, and reaction formats.",
    bannerGradient: "from-primary-purple to-primary-pink",
    wordSlugs: ["rizz", "gyatt", "skibidi"],
    articles: [
      { title: "The Anatomy of a TikTok Sound: How Slang Goes Viral", readTime: "4 min read", link: "#" },
      { title: "Understanding the TikTok Comment Section Hierarchy", readTime: "5 min read", link: "#" }
    ]
  },
  {
    id: "c2",
    title: "Most Popular Gaming Terms",
    slug: "popular-gaming-terms",
    description: "Lobby chatter, voice-chat callouts, and competitive ranking terms used in Fortnite, Roblox, and Valorant.",
    bannerGradient: "from-accent-cyan to-primary-purple",
    wordSlugs: ["sigma", "rizz"],
    articles: [
      { title: "Fortnite Callouts: Communicating with your Squad", readTime: "6 min read", link: "#" }
    ]
  },
  {
    id: "c3",
    title: "Internet Slang Every Parent Should Know",
    slug: "parent-slang-guide",
    description: "A friendly, educational translation deck designed to bridge communication gaps with teens.",
    bannerGradient: "from-accent-orange to-primary-pink",
    wordSlugs: ["delulu", "rizz"],
    articles: [
      { title: "Bridging the Gap: Decoupling Teenage Text Jargon", readTime: "8 min read", link: "#" }
    ]
  },
  {
    id: "c4",
    title: "Gen Alpha Dictionary",
    slug: "gen-alpha-dictionary",
    description: "The newer emerging lexical vocabulary originating from YouTube Shorts channels and Roblox subcultures.",
    bannerGradient: "from-accent-mint to-accent-cyan",
    wordSlugs: ["skibidi", "gyatt", "sigma"],
    articles: [
      { title: "Gen Alpha vs Gen Z: The Rapid Evolution of Internet Vocabulary", readTime: "5 min read", link: "#" }
    ]
  }
];
