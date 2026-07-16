export interface CultureCategory {
  slug: string;
  title: string;
  iconName: string;
  description: string;
  wordCount: number;
  articleCount: number;
  introduction: string;
  historyText: string;
  popularWordSlugs: string[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
}

export interface CultureGuide {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  author: string;
  publishedDate: string;
  sections: GuideSection[];
  suggestedWordSlugs: string[];
}

export const cultureCategories: CultureCategory[] = [
  {
    slug: "basics",
    title: "Internet Basics",
    iconName: "Globe",
    description: "The core foundations of online speak, foundational acronyms, and netiquette guidelines.",
    wordCount: 150,
    articleCount: 12,
    introduction: "Internet Basics covers the foundation of online communication. From early BBS boards and email abbreviations to universal modern acronyms, this is the grammar that runs the internet.",
    historyText: "Modern web dialect evolved from early Unix terminals, IRC (Internet Relay Chat), and SMS character limitations. These constraints birthed shortcuts like LOL, BRB, and ASAP that remain universal.",
    popularWordSlugs: ["rizz"]
  },
  {
    slug: "gen-alpha",
    title: "Gen Alpha",
    iconName: "Baby",
    description: "Emerging lexical vocabulary originating from YouTube Shorts, Roblox, and iPad subcultures.",
    wordCount: 45,
    articleCount: 8,
    introduction: "Gen Alpha (born 2013-2025) has created a highly distinct linguistic playground heavily influenced by algorithmic video curation, gaming streamers, and virtual environments.",
    historyText: "Fueled by Twitch streams, Minecraft subcultures, and TikTok feeds, Gen Alpha terms shift at hyper-speed. A word can originate from a single viral sound and become standard vocabulary in weeks.",
    popularWordSlugs: ["skibidi", "gyatt", "sigma"]
  },
  {
    slug: "gen-z",
    title: "Gen Z",
    iconName: "Smile",
    description: "The primary dialect of modern internet culture—expressive, satirical, and hyper-referential.",
    wordCount: 220,
    articleCount: 19,
    introduction: "Gen Z slang bridges the gap between text communication and cultural identity, heavily utilizing self-deprecation, high irony, and emotional hyperbole.",
    historyText: "Developed through Vine, Twitter, and TikTok, Gen Z communication is visual-first. It relies on recontextualizing text overlays, memes, and sounds to express complex moods.",
    popularWordSlugs: ["rizz", "delulu"]
  },
  {
    slug: "memes",
    title: "Meme Culture",
    iconName: "Laugh",
    description: "The evolution of viral inside jokes, visual macros, and shared digital folklore.",
    wordCount: 450,
    articleCount: 32,
    introduction: "Memes are the units of internet currency. They are self-replicating chunks of media that carry cultural ideas, symbols, or practices across online communities.",
    historyText: "Meme history ranges from early 2000s image macros (Lolcats) to deep-fried surrealism on Reddit, and finally to modern dynamic video templates on TikTok.",
    popularWordSlugs: ["skibidi", "rizz"]
  },
  {
    slug: "brainrot",
    title: "Brainrot Culture",
    iconName: "Brain",
    description: "Absurdist, hyper-repetitive phrases birthed from algorithmically-saturated social media feeds.",
    wordCount: 30,
    articleCount: 6,
    introduction: "Brainrot describes terms that are repeated so frequently by algorithm feeds that they detach from initial meaning, forming a surrealist, self-referential sub-language.",
    historyText: "This phenomenon accelerated in 2023 with the dominance of short-form vertical video loops, where repeating phrases like 'skibidi gyatt fanum tax' became a badge of hyper-online participation.",
    popularWordSlugs: ["skibidi", "gyatt", "sigma"]
  },
  {
    slug: "tiktok",
    title: "TikTok Culture",
    iconName: "Video",
    description: "Short-form video trends, comment hierarchy templates, and audio-first slang.",
    wordCount: 180,
    articleCount: 25,
    introduction: "TikTok has democratized slang creation. Its sound-sharing system enables a single slang term, pronunciation, or voiceover to scale globally in days.",
    historyText: "Evolving from Musical.ly in 2018, TikTok's recommendation engine feeds niche slang directly to the mainstream, bypassing traditional cultural gatekeepers.",
    popularWordSlugs: ["rizz", "gyatt", "delulu"]
  },
  {
    slug: "gaming",
    title: "Gaming Culture",
    iconName: "Gamepad",
    description: "Voice-chat callouts, competitive terminology, and lobby chatter from major multiplayer games.",
    wordCount: 310,
    articleCount: 15,
    introduction: "Gaming culture has contributed some of the most enduring words in the internet lexicon. Voice chats and multiplayer speed requirements demand concise, high-impact jargon.",
    historyText: "From early LAN parties and Counter-Strike lobbies to modern Discord-coordinated battle royales, gaming terms like 'noob', 'clutch', and 'GG' paved the way for modern slang.",
    popularWordSlugs: ["sigma", "rizz"]
  },
  {
    slug: "discord",
    title: "Discord Culture",
    iconName: "MessageSquare",
    description: "Server role hierarchies, moderation slang, bot commands, and gaming community sub-cultures.",
    wordCount: 95,
    articleCount: 9,
    introduction: "Discord serves as the town square for specialized internet communities, birthing unique moderation styles, role-play jargon, and gaming lobby shortcuts.",
    historyText: "Launched in 2015 as a gaming voice client, Discord evolved into a community platform, hosting millions of servers where custom bots and server-specific memes shape user slang.",
    popularWordSlugs: ["rizz"]
  },
  {
    slug: "instagram",
    title: "Instagram Culture",
    iconName: "Instagram",
    description: "Influencer speech patterns, aesthetic trends, caption slang, and comment-section meta-jokes.",
    wordCount: 110,
    articleCount: 11,
    introduction: "Instagram culture revolves around polished aesthetics, curate feeds, and lifestyle commentary, creating a subset of aspirational and descriptive social slang.",
    historyText: "Initially a photo-sharing app in 2010, Instagram's pivot to Stories and Reels created the 'influencer' dialect, featuring terms like 'aesthetic', 'fit check', and 'link in bio'.",
    popularWordSlugs: ["rizz", "delulu"]
  },
  {
    slug: "youtube",
    title: "YouTube Culture",
    iconName: "Tv",
    description: "Content creator catchphrases, video essay topics, clickbait slang, and community tab lore.",
    wordCount: 240,
    articleCount: 18,
    introduction: "YouTube has shaped how visual media is structured and discussed, creating an entire vocabulary around subscriber callouts, creator dramas, and long-form commentary.",
    historyText: "From 2005's home videos to high-production challenge formats and commentary essays, YouTube slang has evolved alongside the platform's changing algorithm rules.",
    popularWordSlugs: ["skibidi"]
  },
  {
    slug: "ai",
    title: "AI Culture",
    iconName: "Cpu",
    description: "Prompt engineering terminology, machine learning memes, and technology acceleration jargon.",
    wordCount: 85,
    articleCount: 14,
    introduction: "AI culture represents the collision of computer science and online discussion, charting terms around artificial intelligence, model training, and alignment.",
    historyText: "Following the release of ChatGPT in late 2022, terms like 'hallucination', 'RLHF', and 'doomer' transitioned from academic papers into daily developer and corporate lexicon.",
    popularWordSlugs: ["sigma"]
  },
  {
    slug: "business",
    title: "Business Internet",
    iconName: "Briefcase",
    description: "Corporate speak, tech startup jargon, LinkedIn hustle culture memes, and remote-work terms.",
    wordCount: 130,
    articleCount: 10,
    introduction: "Business Internet terms analyze the sub-dialect of corporate office spaces, LinkedIn networks, venture capitalist channels, and remote engineering teams.",
    historyText: "Accelerated by the remote-work pivot of 2020, traditional business jargon merged with internet culture to create concepts like 'quiet quitting' and 'hustle culture'.",
    popularWordSlugs: ["rizz"]
  },
  {
    slug: "crypto",
    title: "Crypto Culture",
    iconName: "Coins",
    description: "Web3 terminology, blockchain inside jokes, trading slang, and NFT subcultures.",
    wordCount: 195,
    articleCount: 13,
    introduction: "Crypto culture is famous for its highly distinct, insular vocabulary, combining financial jargon with speculative memes and gaming-inspired forums.",
    historyText: "Birthed on Bitcoin forums in 2009 and accelerated by Reddit and Twitter traders, crypto terms like 'HODL', 'moon', and 'FUD' serve as social identifiers.",
    popularWordSlugs: ["sigma"]
  },
  {
    slug: "music",
    title: "Music Culture",
    iconName: "Music",
    description: "Fandom vocabularies, concert etiquette, soundboard samples, and TikTok audio trends.",
    wordCount: 140,
    articleCount: 9,
    introduction: "Internet music culture charts the language surrounding online fandoms (Stans), streaming metrics, and micro-genres like Lofi, Phonk, and Hyperpop.",
    historyText: "Tumblr fan accounts, SoundCloud rap channels, and TikTok audio loops have transformed music from a simple listening experience into a collaborative, text-driven social game.",
    popularWordSlugs: ["rizz"]
  },
  {
    slug: "emojis",
    title: "Emoji Meanings",
    iconName: "Smile",
    description: "The secret meanings, subverted expressions, and conversational double-meanings behind standard symbols.",
    wordCount: 105,
    articleCount: 8,
    introduction: "Emojis are not just decorations; they are active grammar elements. Internet users frequently subvert original Unicode designs to mean completely different concepts.",
    historyText: "Originating in Japan in 1999 and standardized by Unicode, emojis shifted from simple pictographs to layered emotional statements (e.g., using the skull emoji for 'dead laughing').",
    popularWordSlugs: ["rizz"]
  },
  {
    slug: "history",
    title: "Internet History",
    iconName: "History",
    description: "Retrospective timeline analysis of major platform launches, viral moments, and classic memes.",
    wordCount: 300,
    articleCount: 22,
    introduction: "Internet History preserves the archives of digital growth, charting early message boards, standard flash games, classic meme videos, and social platform launches.",
    historyText: "From the mid-1990s dot-com boom and Web 2.0 expansions to mobile-first platforms and decentralized systems, tracking history lets us understand modern communication.",
    popularWordSlugs: ["skibidi", "rizz"]
  },
  {
    slug: "design",
    title: "Internet Design",
    iconName: "Paintbrush",
    description: "Visual styles, UI trends, and digital aesthetics (e.g., Glassmorphism, Frutiger Aero) popular online.",
    wordCount: 82,
    articleCount: 10,
    introduction: "Internet Design tracks the visual evolution of digital layouts, color systems, and user interfaces.",
    historyText: "From early flat HTML borders and skeumorphic glossy buttons to modern glassmorphic layered panels, design dictates the mood of the web.",
    popularWordSlugs: ["rizz"]
  },
  {
    slug: "programming",
    title: "Programming Culture",
    iconName: "Code",
    description: "Software engineering inside jokes, developer jargon, remote work memes, and code culture.",
    wordCount: 104,
    articleCount: 17,
    introduction: "Programming Culture catalogs the vocabulary, hacks, and community dialect of software developers.",
    historyText: "Originating in Unix boards and early hacker forums, developer slang has expanded globally through Stack Overflow and GitHub loops.",
    popularWordSlugs: ["rizz"]
  }
];

export const cultureTimeline: TimelineItem[] = [
  {
    year: "2005",
    title: "YouTube Launches",
    description: "The birth of online video sharing, shifting internet culture from static text/images to visual-first content."
  },
  {
    year: "2008",
    title: "LOL Mainstream",
    description: "Text abbreviations and early image macros cross from gaming circles into global family messages."
  },
  {
    year: "2012",
    title: "The Doge Era",
    description: "Absurdist, comic-sans narrative memes dominate Reddit and Tumblr, shaping the template format of modern internet humor."
  },
  {
    year: "2016",
    title: "Dank Memes Peak",
    description: "Visual surrealism and ironist meme edits grow highly popular on Reddit, Vine, and Instagram, establishing modern meme formats."
  },
  {
    year: "2020",
    title: "TikTok Explosion",
    description: "Short-form video loops democratize global slang, creating massive audio-first trends overnight."
  },
  {
    year: "2022",
    title: "Rizz Arrives",
    description: "Kai Cenat introduces 'rizz' on Twitch, showcasing how gaming streams act as incubators for modern slang."
  },
  {
    year: "2023",
    title: "NPC Streams Take Over",
    description: "Livestreamers mimic video game characters for gifts, showing the collision of gaming subcultures and live media."
  },
  {
    year: "2024",
    title: "Brainrot Dominance",
    description: "Algorithmically saturated sound loops create hyper-repetitive slang dialogues that spread globally among youth."
  },
  {
    year: "2025",
    title: "Modern AI acceleration",
    description: "Developer prompts, machine learning concepts, and agent speak become common shorthand on corporate and tech boards."
  }
];

export const cultureGuides: CultureGuide[] = [
  {
    slug: "complete-guide-to-gen-z-slang",
    title: "The Complete Guide to Gen Z Slang",
    description: "An editorial breakdown of the most popular Gen Z expressions, text formats, and linguistic quirks.",
    readTime: "6 min read",
    author: "Elena Rostova",
    publishedDate: "2026-04-12",
    sections: [
      {
        id: "intro",
        title: "1. Introduction to Gen Z Slang",
        content: "Gen Z (born 1997-2012) communication is built on high irony, emotional hyperbole, and visual-first references. Understanding this lexicon requires looking past the literal translation and viewing the emotional context."
      },
      {
        id: "core-concepts",
        title: "2. Core Vocabulary Concepts",
        content: "Many Gen Z terms are rooted in African American Vernacular English (AAVE) that scaled globally through TikTok. Key concepts like 'no cap' (no lie), 'bet' (agree/yes), and 'delulu' (delusional) serve as shorthand for emotional states."
      },
      {
        id: "formatting",
        title: "3. Grammar & Text Quirks",
        content: "Gen Z text grammar rarely uses uppercase letters or periods, which are often interpreted as passive-aggressive. Instead, punctuation is replaced with visual double-entendres like the skull emoji (💀) representing 'dead from laughing'."
      }
    ],
    suggestedWordSlugs: ["rizz", "delulu"]
  },
  {
    slug: "understanding-brainrot",
    title: "Understanding Brainrot Culture",
    description: "What happens when algorithm feeds dictate vocabulary? A deep-dive into absurdist internet languages.",
    readTime: "8 min read",
    author: "Marcus Vance",
    publishedDate: "2026-05-02",
    sections: [
      {
        id: "definition",
        title: "1. Defining Brainrot",
        content: "Brainrot refers to highly repetitive, absurdist slang terms originating from short-form loop media feeds (like YouTube Shorts). These terms are often chained together to form nonsensical sentences."
      },
      {
        id: "factors",
        title: "2. The Role of Algorithms",
        content: "Because short-form feeds reward immediate audio recognition, repeating popular sound bytes like 'skibidi' or 'fanum tax' keeps user engagement high, feeding a recursive vocabulary loop."
      }
    ],
    suggestedWordSlugs: ["skibidi", "gyatt", "sigma"]
  },
  {
    slug: "evolution-of-internet-memes",
    title: "The Evolution of Internet Memes",
    description: "From simple Lolcats image macros to dynamic video reels. How digital jokes grew up.",
    readTime: "7 min read",
    author: "Sarah Jenkins",
    publishedDate: "2026-03-28",
    sections: [
      {
        id: "early-days",
        title: "1. The Image Macro Era",
        content: "Early memes in the 2000s were simple: a static image (often a cat or animal) overlaid with white Impact font. They were simple, single-layered jokes."
      },
      {
        id: "surrealism",
        title: "2. The Surrealist Shift",
        content: "During the mid-2010s, memes grew highly ironist and deep-fried. The jokes became multi-layered, demanding that the viewer understand several layers of online lore to catch the punchline."
      }
    ],
    suggestedWordSlugs: ["skibidi", "rizz"]
  }
];
