export type Era = {
  slug: string;
  name: string;
  from: number;
  to: number;
  tagline: string;
  summary: string;
  /** What this period contributed to how people write and talk online. */
  legacy: string;
  moments: { year: number; text: string }[];
  hue: number;
};

export const eras: Era[] = [
  {
    slug: "network-age",
    name: "The Network Age",
    from: 1969,
    to: 1989,
    tagline: "Before the web, on machines you dialled",
    summary:
      "The internet's first vocabulary was written by researchers, students and hobbyists on systems that assumed everyone reading knew everyone else. Usenet newsgroups and dial-up bulletin boards were small, slow and text-only, and their constraints produced solutions we still use: threading, quoting conventions, and a smiley face made of punctuation.",
    legacy:
      "Almost every social norm people think TikTok invented was settled here first. Lurking before posting, warning about spoilers, trimming quoted text, and the observation that a parody of an extreme view is indistinguishable from the real thing were all documented before the web existed.",
    moments: [
      { year: 1978, text: "The first BBS goes online in Chicago during a blizzard." },
      { year: 1980, text: "Usenet is built at Duke and UNC, organising discussion into newsgroups." },
      { year: 1982, text: "Scott Fahlman proposes the smiley to mark jokes in text." },
      { year: 1988, text: "IRC is written in Finland, inventing the channel model chat still uses." },
    ],
    hue: 165,
  },
  {
    slug: "open-web",
    name: "The Open Web",
    from: 1990,
    to: 1998,
    tagline: "Everyone gets a homepage, nobody gets an audience",
    summary:
      "The web made publishing possible for anyone with a modem and patience. GeoCities organised personal pages into neighbourhoods, webrings replaced search, and hit counters made traffic a private curiosity rather than a business metric. The aesthetic excess of the period, all tiled backgrounds and animated roadworks, has since become a genuine object of study.",
    legacy:
      "This was the last period when the default assumption was that you built your own corner rather than posted into someone else's. The small-web and personal-site revivals of the 2020s are explicit attempts to recover it.",
    moments: [
      { year: 1993, text: "AOL connects its users to Usenet, beginning the Eternal September." },
      { year: 1994, text: "The first webrings appear, linking sites into browsable loops." },
      { year: 1995, text: "GeoCities launches, and the amateur web finds its visual language." },
      { year: 1996, text: "The Internet Archive begins saving the web, mostly unnoticed." },
    ],
    hue: 35,
  },
  {
    slug: "forum-era",
    name: "The Forum Era",
    from: 1999,
    to: 2004,
    tagline: "Broadband, boards, and the birth of the in-joke economy",
    summary:
      "Faster connections and cheap forum software created thousands of self-governing communities with their own vocabularies, moderators and grudges. Something Awful, phpBB boards and early blogs produced the first recognisably modern internet humour, and the conventions of threads, stickies and bumps that every platform still uses.",
    legacy:
      "Forums established that online communities need governance, and that whoever owns the server sets the culture. Every argument about moderation since has been a rerun of arguments settled, badly, on message boards.",
    moments: [
      { year: 1999, text: "Napster arrives and file-sharing culture reshapes what the web is for." },
      { year: 2001, text: "The Wayback Machine opens to the public." },
      { year: 2003, text: "TL;DR appears on Something Awful as an insult, not a courtesy." },
      { year: 2004, text: "The word snowclone is coined, naming the phrasal meme template." },
    ],
    hue: 265,
  },
  {
    slug: "social-graph",
    name: "The Social Graph",
    from: 2005,
    to: 2010,
    tagline: "Real names, image macros and the first viral machines",
    summary:
      "Facebook, YouTube and Twitter replaced the pseudonymous board with the identified profile, while 4chan and Reddit kept anonymity and produced most of the era's humour. Image macros became the dominant meme format, and rickrolling proved that a well-built bait-and-switch could last for decades.",
    legacy:
      "This period invented the modern share button and with it the idea that reach is the point. The vocabulary of virality, from going viral to the original post, dates from here.",
    moments: [
      { year: 2005, text: "Poe's law is formulated, and reaction images become standard reply currency." },
      { year: 2007, text: "Rickrolling escapes 4chan and never fully stops working." },
      { year: 2008, text: "GitHub introduces the pull request, turning code into a conversation." },
      { year: 2009, text: "Reddit's TIL and AMA formats turn curiosity into a content genre." },
    ],
    hue: 210,
  },
  {
    slug: "mobile-meme",
    name: "Mobile and the Meme Factory",
    from: 2011,
    to: 2015,
    tagline: "Tumblr grammar, Vine timing, and slang at industrial scale",
    summary:
      "Phones made posting constant and Tumblr made it emotional. The period produced an enormous amount of durable vocabulary, much of it from Black Twitter and from queer and ballroom culture, and much of it credited to the platforms rather than to the communities that coined it.",
    legacy:
      "The typographic conventions of modern internet English were fixed here: lowercase as sincerity, the full stop as coldness, the keysmash as speechlessness. So was the pattern of a word travelling from a marginalised community to a brand account in under two years.",
    moments: [
      { year: 2011, text: "Twitch launches; Kappa is hidden in the client as an easter egg." },
      { year: 2013, text: "Doge, vaporwave and the -core suffix all arrive within months." },
      { year: 2014, text: "Ship, stan and slay complete their journey into general use." },
      { year: 2015, text: "Ghosting is named as dating apps make disappearing frictionless." },
    ],
    hue: 330,
  },
  {
    slug: "algorithmic",
    name: "The Algorithmic Feed",
    from: 2016,
    to: 2019,
    tagline: "The ranked timeline, and learning to talk around it",
    summary:
      "Chronological feeds gave way to ranked ones, and the algorithm became a folk entity with moods to be appeased. Creators reorganised their language around what would be promoted or suppressed, producing algospeak, and the influencer became a job title with disclosure obligations.",
    legacy:
      "This is when the audience stopped being people you knew and became a distribution system you negotiated with. Every subsequent shift in online writing has been shaped by that negotiation.",
    moments: [
      { year: 2016, text: "Milkshake duck names the cycle of adoration and disgrace." },
      { year: 2017, text: "Ratio is identified on Twitter as the shape of a disliked post." },
      { year: 2018, text: "TikTok merges with Musical.ly and the For You Page begins its rise." },
      { year: 2019, text: "Tone indicators spread as a deliberate fix for a very old problem." },
    ],
    hue: 22,
  },
  {
    slug: "lockdown",
    name: "The Lockdown Internet",
    from: 2020,
    to: 2022,
    tagline: "Everyone indoors, everything accelerated",
    summary:
      "With physical life suspended, online culture absorbed enormous new audiences at once. Among Us made sus universal, Discord became the default for staying in touch, cottagecore offered an imagined outdoors, and the crypto and NFT boom ran its full cycle from mania to collapse in about eighteen months.",
    legacy:
      "The period compressed adoption curves that would normally take years into months, and made the vocabulary of online life the vocabulary of everyone's life. Doomscrolling and touch grass both date from here, and describe two halves of the same problem.",
    moments: [
      { year: 2020, text: "Among Us makes sus a global word in a matter of weeks." },
      { year: 2021, text: "Diamond hands and WAGMI carry a retail trading mania." },
      { year: 2022, text: "Quiet quitting names a boundary and starts an argument that has not ended." },
    ],
    hue: 145,
  },
  {
    slug: "model-era",
    name: "The Model Era",
    from: 2023,
    to: 2026,
    tagline: "Generated everything, and a vocabulary for distrusting it",
    summary:
      "Generative systems moved from research to default infrastructure, and the language followed immediately. Hallucination, prompt engineering and vibe coding entered general speech, while AI slop, clanker and dead internet theory gave people ways to name what they disliked about the result.",
    legacy:
      "For the first time the internet needed everyday words for judging whether something was made by a person. Brainrot and slop are aesthetic complaints; clanker and dead internet theory are epistemological ones.",
    moments: [
      { year: 2023, text: "Brainrot, rizz and delulu arrive together; Oxford picks rizz for the year." },
      { year: 2024, text: "Enshittification wins word of the year; AI slop floods search results." },
      { year: 2025, text: "Vibe coding is named, and agentic becomes the industry's favourite adjective." },
    ],
    hue: 190,
  },
];

export function getEra(slug: string): Era | undefined {
  return eras.find((era) => era.slug === slug);
}
