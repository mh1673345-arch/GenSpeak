export type Scene = {
  slug: string;
  name: string;
  tagline: string;
  years: string;
  /** Two paragraphs of editorial background. */
  summary: string;
  /** What this scene specifically contributed to internet language. */
  contribution: string;
  /** Slugs of terms this scene produced or defined. */
  terms: string[];
  icon: string;
  hue: number;
};

export const scenes: Scene[] = [
  {
    slug: "usenet-bbs",
    name: "Usenet and the BBS",
    tagline: "The first communities, and the first arguments about them",
    years: "1978 to 1995",
    summary:
      "Before the web there were dial-up boards you phoned individually and newsgroups distributed between universities. Both were small, text-only and slow enough that a reply might take a day, which made people careful about what they posted and ruthless about what they quoted.",
    contribution:
      "Essentially the entire grammar of online conduct. Threading, quoting, spoiler warnings, lurking before posting, the smiley, and the recognition that a sufficiently extreme parody cannot be told from sincerity. Modern platforms reinvent these solutions constantly without knowing they are reruns.",
    terms: ["usenet", "bbs", "netiquette", "lurker", "flame-war", "godwins-law", "eternal-september", "top-posting", "rtfm", "emoticon"],
    icon: "Globe",
    hue: 165,
  },
  {
    slug: "imageboards",
    name: "Imageboards",
    tagline: "Anonymous, fast, and responsible for most of the memes",
    years: "2003 to present",
    summary:
      "4chan and its descendants stripped away persistent identity, so nothing accumulated except the post itself. Threads expired, reputation was impossible, and the only currency was whether something was funny enough to be copied before it disappeared.",
    contribution:
      "An enormous share of meme vocabulary and format: copypasta, rickrolling, the wojak and Pepe families, greentext narration, and the taxonomy of reaction images. Also, unavoidably, the environment in which several genuinely harmful movements organised, which the culture's defenders and critics still argue about.",
    terms: ["copypasta", "rickroll", "wojak", "pepe", "gigachad", "greentext", "reaction-image", "tfw", "backrooms", "weeb"],
    icon: "Sparkles",
    hue: 330,
  },
  {
    slug: "black-twitter",
    name: "Black Twitter",
    tagline: "The most under-credited engine in the language",
    years: "2009 to present",
    summary:
      "A loose network rather than a place: overlapping communities of Black users whose conversation on Twitter set the pace for humour, criticism and slang across the whole platform. Academic study of it has been serious and sustained, and largely ignored by the brands that mine it.",
    contribution:
      "A very large proportion of what gets called Gen Z slang, usually credited to whichever platform popularised it years later. The pattern is consistent enough to be predictable: coined in African American Vernacular English, adopted by the wider internet, declared dead once brands use it.",
    terms: ["receipts", "tea", "cap", "no-cap", "bet", "facts", "pressed", "big-mad", "unserious", "cancelled"],
    icon: "MessageCircle",
    hue: 258,
  },
  {
    slug: "ballroom-drag",
    name: "Ballroom and Drag",
    tagline: "Where the vocabulary of praise was invented",
    years: "1970s to present",
    summary:
      "Ballroom culture, built by Black and Latino LGBTQ communities in New York, developed an entire critical language for judging performance: categories, houses, and precise words for what made a walk succeed or fail. Drag culture carried that vocabulary outward, and television carried it everywhere.",
    contribution:
      "Almost every superlative in current use. Slay, serve, ate, gagged, snatched, shade, tea, mother and reading all come from here, with specific technical meanings that flattened as they spread. The words survived; the distinctions between them mostly did not.",
    terms: ["slay", "serving", "ate", "gagged", "snatched", "shade", "tea", "mother", "its-giving", "periodt"],
    icon: "Heart",
    hue: 300,
  },
  {
    slug: "tumblr",
    name: "Tumblr",
    tagline: "Where the internet learned to write in lowercase",
    years: "2007 to present",
    summary:
      "Tumblr combined fandom, aesthetics and confessional writing on a platform with no real reach mechanics, so posts spread by reblogging rather than by ranking. That made it slow, weird and unusually literary compared with what came after.",
    contribution:
      "The typographic register of modern internet English: lowercase as sincerity, keysmashes, the tagging conventions later formalised by AO3, and the entire practice of naming aesthetics with the -core suffix. Also content warnings as a widespread courtesy rather than a platform feature.",
    terms: ["aesthetic", "core-suffix", "cottagecore", "keysmash", "lowercase", "big-mood", "same", "content-warning", "callout-post", "vaguepost"],
    icon: "Palette",
    hue: 175,
  },
  {
    slug: "twitch-chat",
    name: "Twitch Chat",
    tagline: "The fastest dialect generator on the internet",
    years: "2011 to present",
    summary:
      "A live chat moving faster than anyone can read forces language to compress. Twitch solved this with emotes, which function as single-token words, and with rituals like spamming one image so that a crowd of thousands can express a single reaction legibly.",
    contribution:
      "A working vocabulary that exists mostly as images, plus a set of words that escaped into speech: poggers, malding, sadge, copium, and the habit of addressing an imaginary chat. Kappa was a tone indicator a decade before anyone used the phrase.",
    terms: ["emote", "kappa", "poggers", "kekw", "monkas", "sadge", "malding", "copium", "chat-is-this-real", "emote-spam"],
    icon: "Clapperboard",
    hue: 278,
  },
  {
    slug: "stan-twitter",
    name: "Stan Twitter and K-pop Fandom",
    tagline: "Organised enthusiasm as an operational capability",
    years: "2012 to present",
    summary:
      "Music fandoms on Twitter built genuinely impressive coordination: streaming campaigns, mass reporting, hashtag operations and rapid archival research. K-pop fandoms in particular demonstrated they could move faster than most newsrooms.",
    contribution:
      "Delulu, bias, fancam, comeback and the whole grammar of stanning, plus tactics that spread far beyond music: flooding hashtags with fancams, coordinated mass reporting, and treating a chart position as a collective project.",
    terms: ["stan", "delulu", "bias", "fancam", "otp", "mother", "iconic", "era", "ijbol", "parasocial"],
    icon: "Star",
    hue: 350,
  },
  {
    slug: "fanfiction",
    name: "Fanfiction and Archives",
    tagline: "The best-organised writing community online",
    years: "1967 to present",
    summary:
      "Fan writing predates the internet by decades, moving from mimeographed zines to mailing lists to purpose-built archives. Archive of Our Own, run by a nonprofit and staffed by volunteer tag wranglers, solved metadata problems that commercial platforms still have not.",
    contribution:
      "The trope-as-search-term model that now shapes commercial publishing, the vocabulary of shipping and canon, and a demonstration that volunteer-run infrastructure can outperform funded competitors. Enemies to lovers is a marketing category because fanfiction made it a filter.",
    terms: ["fanfic", "ao3", "ship", "canon", "headcanon", "au", "enemies-to-lovers", "slow-burn", "retcon", "otp"],
    icon: "Heart",
    hue: 300,
  },
  {
    slug: "crypto-twitter",
    name: "Crypto Twitter",
    tagline: "A dialect built from typos and conviction",
    years: "2013 to present",
    summary:
      "Crypto communities developed an unusually dense vocabulary very quickly, partly because markets reward shared shorthand and partly because a group under constant scepticism tends to build strong internal markers of belonging.",
    contribution:
      "HODL from a drunk forum post, WAGMI and NGMI as identity tests, gm as a daily ritual, and a full set of words for the specific ways people lose money. The vocabulary of scams, from rug pull to pump and dump, is unusually precise.",
    terms: ["hodl", "wagmi", "gm", "degen", "rug-pull", "diamond-hands", "whale", "memecoin", "dyor", "pump-and-dump"],
    icon: "Coins",
    hue: 45,
  },
  {
    slug: "tiktok",
    name: "TikTok",
    tagline: "The accelerator, not usually the origin",
    years: "2018 to present",
    summary:
      "TikTok's recommendation system decoupled reach from following, so anything could travel regardless of who posted it. That made it the fastest distribution mechanism online, and the reason a term can go from a subculture to a school playground in weeks.",
    contribution:
      "Very little vocabulary of its own, and enormous amplification of everyone else's. Its genuine inventions are structural rather than lexical: the duet, the stitch, the GRWM, and algospeak, which is what happens when a whole population writes around a moderation system.",
    terms: ["fyp", "algospeak", "grwm", "duet", "pov-format", "girl-dinner", "delulu", "brainrot", "corecore", "beige-flag"],
    icon: "Users",
    hue: 22,
  },
  {
    slug: "ai-labs",
    name: "AI Research and Its Audience",
    tagline: "Jargon that escaped the paper it was defined in",
    years: "2017 to present",
    summary:
      "Terminology from machine learning research reached general speech faster than any previous technical vocabulary, largely because the products arrived at consumer scale within months of the papers. The result is a lot of precise words being used loosely.",
    contribution:
      "Hallucination, prompt engineering, context window, agentic and alignment as everyday words, alongside a counter-vocabulary of scepticism: AI slop, clanker, dead internet theory and model collapse. Both halves appeared within about two years of each other.",
    terms: ["hallucination", "prompt-engineering", "context-window", "agentic", "vibe-coding", "ai-slop", "clanker", "alignment", "rag", "dead-internet-theory"],
    icon: "Bot",
    hue: 190,
  },
];

export function getScene(slug: string): Scene | undefined {
  return scenes.find((scene) => scene.slug === slug);
}
