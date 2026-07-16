export interface WordData {
  id: string;
  term: string;
  slug: string;
  definition: string;
  meaning: string;
  pronunciation: string;
  origin: string;
  history: { title: string; content: string; date: string }[];
  popularity: { platform: string; score: number; trend: "UP" | "DOWN" | "STABLE" }[];
  examples: { text: string; context: string }[];
  tiktokUsage: string;
  gamingUsage: string;
  discordUsage: string;
  whenToUse: string;
  whenNotToUse: string;
  synonyms: string[];
  antonyms: string[];
  emojis: string[];
  memes: string[];
  faq: { q: string; a: string }[];
  category: string;
  categorySlug: string;
  aiExplanation: string;
  aiTranslation: string;
  votes: number;
  commentsCount: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  popularityStatus?: "Viral" | "Growing" | "Common" | "Declining" | "Archive";
  commonMistakes?: string;
  funFact?: string;
  didYouKnow?: string;
  ipa?: string;
  historyText?: string;
  relatedHashtags?: string;
  popularityScore?: number;
  trendScore?: number;
  eli10?: string;
  parentExplanation?: string;
  teacherExplanation?: string;
  safetyNotes?: string;
  references?: string;
  ogTitle?: string;
  ogDescription?: string;
  featuredImage?: string;
  gallery?: string;
}

export const mockWords: WordData[] = [
  {
    id: "w1",
    term: "rizz",
    slug: "rizz",
    definition: "One's ability to charm or seduce another person.",
    meaning: "Derived from 'charisma', rizz refers to the capacity to attract romantic partners through style, charm, conversation, or presence. It can be active ('rizzing someone up') or a state of being ('unspoken rizz').",
    pronunciation: "/rɪz/",
    origin: "Popularized on Twitch and YouTube by creator Kai Cenat in late 2021, later exploding on TikTok in 2022 and 2023.",
    history: [
      { title: "Origins on Stream", content: "Kai Cenat introduces the term on his Twitch broadcast to describe smooth interactions with girls.", date: "Mid 2021" },
      { title: "TikTok Mainstream", content: "Short clips edit the stream clips, and users adopt it as a universal slang for charisma.", date: "Late 2022" },
      { title: "Oxford Word of the Year", content: "Oxford University Press officially names 'rizz' as the Word of the Year.", date: "December 2023" }
    ],
    popularity: [
      { platform: "TikTok", score: 98, trend: "UP" },
      { platform: "Twitch", score: 95, trend: "STABLE" },
      { platform: "General", score: 90, trend: "UP" }
    ],
    examples: [
      { text: "He literally has unspoken rizz, he didn't even say anything and she was smiling.", context: "TikTok Comment" },
      { text: "Watch me rizz up this lobby real quick.", context: "Gaming Discord" }
    ],
    tiktokUsage: "Often paired with the 'W Rizz' text overlay or editing videos featuring slow-motion zooms and audio tracks like 'Lover Boy'.",
    gamingUsage: "Used playfully in lobbies to brag about microphone confidence or general influence over teammates.",
    discordUsage: "Used as a reaction role or user tag for smooth talkers and community managers.",
    whenToUse: "When complimenting someone's smooth conversational skills or high charm factor.",
    whenNotToUse: "Avoid in highly formal letters, job interviews, or when describing professional capability.",
    synonyms: ["Charisma", "Charm", "Game", "Seductive power"],
    antonyms: ["L Rizz", "Awkwardness", "Clumsiness"],
    emojis: ["😏", "⚡", "🎩", "🤫"],
    memes: ["W Rizz", "Rizzler", "The Rizzard of Oz", "Unspoken Rizz"],
    faq: [
      { q: "Is 'rizz' a noun or a verb?", a: "It is both! You can have 'rizz' (noun) and you can also 'rizz up' someone (verb)." },
      { q: "Where does the word come from?", a: "It is a shortened, stylized version of the middle syllable of 'cha-RIZZ-ma'." }
    ],
    category: "Slang",
    categorySlug: "slang",
    aiExplanation: "The linguistic evolution of 'rizz' displays aphesis and clipping, which are common processes in internet dialects where the core accented syllable of a word is isolated to form a high-impact root.",
    aiTranslation: "Charming/courting someone effortlessly.",
    votes: 4235,
    commentsCount: 142,
    difficulty: "Beginner",
    popularityStatus: "Viral",
    commonMistakes: "Confusing it with simple confidence. Rizz requires active charisma and positive social outcomes.",
    funFact: "Oxford University Press officially crowned 'rizz' as Word of the Year, beating out Swiftie and Prompt.",
    didYouKnow: "Linguists classify rizz as a rare example of a clipping where both the prefix and suffix of 'charisma' are discarded."
  },
  {
    id: "w2",
    term: "skibidi",
    slug: "skibidi",
    definition: "A cool, bad, or random adjective depending on context; popular in Gen Alpha culture.",
    meaning: "Originating from the 'Skibidi Toilet' YouTube series, the word itself is an empty signifier (a word with no fixed literal definition). In general use, it is often prefixed to mean 'cool', 'coolly alternative', or 'bad/weird' depending on sentence valence.",
    pronunciation: "/skɪ.bɪ.di/",
    origin: "Created by animator Alexey Gerasimov (DaFuq!?Boom!) in February 2023, utilizing a mashup song of 'Give It To Me' and 'Dom Dom Yes Yes'.",
    history: [
      { title: "First Upload", content: "DaFuq!?Boom! uploads a short video showing a head inside a toilet singing the mashup.", date: "Feb 2023" },
      { title: "Viral Explosion", content: "The series garners billions of views, turning the nonsense lyric into a cultural meme.", date: "Mid 2023" },
      { title: "Adjective Shift", content: "Gen Alpha children adopt 'skibidi' as a general descriptor (e.g., 'skibidi Ohio' or 'skibidi sigma').", date: "Late 2023" }
    ],
    popularity: [
      { platform: "YouTube", score: 99, trend: "STABLE" },
      { platform: "TikTok", score: 94, trend: "UP" },
      { platform: "Gaming", score: 85, trend: "DOWN" }
    ],
    examples: [
      { text: "That new hoverboard is so skibidi.", context: "Gen Alpha slang" },
      { text: "Stop acting so skibidi, you are being weird.", context: "Middle School Chat" }
    ],
    tiktokUsage: "Background sound for bizarre edits, fast transition sequences, and brainrot compilations.",
    gamingUsage: "Shouted in Roblox, Minecraft, or Fortnite lobbies, often as a distraction or battle cry.",
    discordUsage: "Spammed as emojis, custom stickers, and reaction reactions inside young creator servers.",
    whenToUse: "Use ironically when talking to younger peers, or when mocking internet meme overload.",
    whenNotToUse: "Never use in serious, technical, corporate, or academic environments.",
    synonyms: ["Nonsense", "Weird", "Cool", "Absurd"],
    antonyms: ["Serious", "Standard", "Plain"],
    emojis: ["🚽", "🤪", "💥", "🎵"],
    memes: ["Skibidi Toilet", "Skibidi Rizzler", "Only in Ohio"],
    faq: [
      { q: "What does 'skibidi' actually mean?", a: "Literally, nothing! It is a sound effect that has evolved to mean either 'cool' or 'bad/weird' depending entirely on tone." },
      { q: "Who invented it?", a: "Alexey Gerasimov, creator of the Skibidi Toilet web series." }
    ],
    category: "Memes",
    categorySlug: "memes",
    aiExplanation: "Linguistically, 'skibidi' represents a lexical filler that transitioned into a versatile adjective, demonstrating the high speed of semantic shifting in web subcultures.",
    aiTranslation: "Extraordinary / strange (context-dependent).",
    votes: 3102,
    commentsCount: 289,
    difficulty: "Advanced",
    popularityStatus: "Declining",
    commonMistakes: "Using it in standard formal correspondence or with individuals outside internet meme subcultures.",
    funFact: "The DaFuq!?Boom! channel gained over 30 million subscribers in under a year due to the Skibidi series.",
    didYouKnow: "The prefix 'skibidi' originally stems from scatted lyrics in Turkish pop dance mixes."
  },
  {
    id: "w3",
    term: "gyatt",
    slug: "gyatt",
    definition: "An exclamation of excitement or shock; often referencing an attractive figure.",
    meaning: "Originally an abbreviation/slurred pronunciation of 'God damn', gyatt is used to express shock, excitement, or appreciation, most frequently in response to seeing an attractive person with a curvy shape.",
    pronunciation: "/ɡjɑːt/",
    origin: "Adopted by live streamers like YourRAGE and Kai Cenat who screamed it during streams, which was then clipped and shared on TikTok.",
    history: [
      { title: "Stream Origins", content: "Twitch streamers express shock by saying 'Gyatt' in high-energy clips.", date: "2021" },
      { title: "Sound Bites", content: "The audio byte becomes a viral template on TikTok, attached to gaming and lifestyle clips.", date: "2022" },
      { title: "Grammar shift", content: "Transitions from an exclamation to a noun denoting the figure itself (e.g. 'having a gyatt').", date: "2023" }
    ],
    popularity: [
      { platform: "TikTok", score: 96, trend: "UP" },
      { platform: "Twitch", score: 92, trend: "STABLE" },
      { platform: "Discord", score: 88, trend: "STABLE" }
    ],
    examples: [
      { text: "Gyatt! Did you see that clean flip?", context: "TikTok Stream" },
      { text: "He was typing 'gyatt' in chat when the model walked in.", context: "Discord Log" }
    ],
    tiktokUsage: "Used as an energetic audio voiceover or a text graphic overlay expressing dramatic surprise.",
    gamingUsage: "Shouted during clutch plays or moments of intense graphics rendering.",
    discordUsage: "Used as a spam reaction in meme channels.",
    whenToUse: "Use to express high-energy amazement or lighthearted shock.",
    whenNotToUse: "Do not use in workspaces, formal communications, or around people sensitive to vulgarity.",
    synonyms: ["God damn!", "Wow!", "Damn!"],
    antonyms: ["Meh", "Unimpressed"],
    emojis: ["🤯", "🍑", "👀", "🔥"],
    memes: ["Gyatt level 10", "Baby Baird", "Gyatt in Ohio"],
    faq: [
      { q: "Is 'gyatt' an abbreviation?", a: "Yes, it is a phonetic representation of 'God damn' shortened to a single, explosive syllable." },
      { q: "Is it appropriate for all audiences?", a: "No. Because of its common association with physical figures, it should be used with care in mixed settings." }
    ],
    category: "Slang",
    categorySlug: "slang",
    aiExplanation: "This term displays phonetic contraction and vowel shift (monophthongization) characteristic of contemporary African American Vernacular English (AAVE) before its digital absorption.",
    aiTranslation: "Astonishing / An expression of physical attraction.",
    votes: 2890,
    commentsCount: 94
  },
  {
    id: "w4",
    term: "sigma",
    slug: "sigma",
    definition: "An independent, successful male who lives outside societal hierarchies.",
    meaning: "Originally part of the pseudo-scientific 'socio-sexual hierarchy' (alongside alpha and beta), the 'sigma male' represents a lone wolf who is successful, popular, and silent, refusing to conform to societal rules.",
    pronunciation: "/ˈsɪɡ.mə/",
    origin: "Coined by blogger Theodore Robert Beale (Vox Day) in 2010, but viralized in late 2022 through edits of Patrick Bateman from American Psycho.",
    history: [
      { title: "Blogging Roots", content: "The concept is outlined in online subcultures as a alternative to Alpha males.", date: "2010" },
      { title: "American Psycho Edits", content: "TikTokers merge the concept with clips of Christian Bale, introducing the iconic 'Sigma Face'.", date: "Late 2022" },
      { title: "Irony Era", content: "The term becomes highly satirized, used by kids to describe any minor action of autonomy.", date: "2024" }
    ],
    popularity: [
      { platform: "TikTok", score: 92, trend: "STABLE" },
      { platform: "YouTube", score: 90, trend: "UP" },
      { platform: "Reddit", score: 80, trend: "DOWN" }
    ],
    examples: [
      { text: "He cleaned up his own trash, absolute sigma behavior.", context: "TikTok Comment" },
      { text: "I'm on my sigma grindset, no distractions.", context: "Instagram Caption" }
    ],
    tiktokUsage: "Accompanied by synthwave music (e.g. 'Worth Nothing') and a facial expression involving pursed lips and raised eyebrows.",
    gamingUsage: "Used to describe a teammate who wins a round solo without talking to the team.",
    discordUsage: "Used in meme channels to refer to self-disciplined, quiet users.",
    whenToUse: "To describe independence, focus, self-discipline, or ironically for small heroic actions.",
    whenNotToUse: "Avoid in serious psychological discussions or professional behavioral reviews.",
    synonyms: ["Lone wolf", "Maverick", "Independent", "Silent leader"],
    antonyms: ["Beta", "Follower", "Clingy"],
    emojis: ["🤫", "🗿", "🐺", "💼"],
    memes: ["Sigma Grindset", "Patrick Bateman Sigma", "Sigma Face"],
    faq: [
      { q: "Is 'sigma' a real psychological term?", a: "No, it is a pop-culture taxonomy created in internet subcultures, not recognized by psychology." },
      { q: "Why is the stone face emoji (🗿) associated with it?", a: "The Moai (🗿) emoji signifies stoicism, stillness, and strength, which align with the Sigma archetype." }
    ],
    category: "Slang",
    categorySlug: "slang",
    aiExplanation: "The evolution of 'sigma' highlights how technical labels (greek letters) are repurposed in digital spaces to construct archetypes of masculine identity.",
    aiTranslation: "Self-reliant / A stoic, independent achiever.",
    votes: 1955,
    commentsCount: 62
  },
  {
    id: "w5",
    term: "delulu",
    slug: "delulu",
    definition: "Delusional; having unrealistic expectations, often in a playful or romantic context.",
    meaning: "Slang for delusional, 'delulu' refers to holding extremely optimistic or romanticized beliefs about a situation (often relating to celebrities, crush reactions, or career dreams). It is often celebrated as a coping mechanism ('delulu is the solulu').",
    pronunciation: "/də.luː.luː/",
    origin: "Originating in the K-Pop fan community (specifically on forums like AskKpop) around 2014 to describe obsessive fan behavior, later entering the mainstream in 2022.",
    history: [
      { title: "K-Pop Forums", content: "Fans coin 'delulu' to criticize over-obsessive fans who believe they will date their idols.", date: "2014" },
      { title: "Mainstream Adoption", content: "TikTok creators adopt it to describe romantic optimism and positive self-delusion.", date: "Mid 2022" },
      { title: "Brand Slogans", content: "The phrase 'delulu is the solulu' (solution) goes viral globally.", date: "2023" }
    ],
    popularity: [
      { platform: "TikTok", score: 97, trend: "UP" },
      { platform: "Instagram", score: 94, trend: "UP" },
      { platform: "Twitter/X", score: 89, trend: "STABLE" }
    ],
    examples: [
      { text: "He looked at my direction for 0.1 seconds, I am fully delulu now.", context: "TikTok Caption" },
      { text: "Stay delulu guys, it is the only way to survive this job search.", context: "Slack Chat" }
    ],
    tiktokUsage: "Used in lifestyle and relationship videos with creators explaining their funny romantic theories.",
    gamingUsage: "Rarely used, but sometimes applied to teammates who think they can win an impossible 1v5 match.",
    discordUsage: "Highly popular in social and relationship-oriented channels.",
    whenToUse: "When jokingly describing your unrealistic hopes, romantic optimism, or dreams.",
    whenNotToUse: "Do not use when discussing clinical mental health conditions or serious psychological disorders.",
    synonyms: ["Delusional", "Unrealistic", "Dreamer", "Wishful thinker"],
    antonyms: ["Realistic", "Grounded", "Pragmatic"],
    emojis: ["🤡", "🌸", "🧠", "✨"],
    memes: ["Delulu is the solulu", "Certified Delulu", "Living in my own world"],
    faq: [
      { q: "Where does 'delulu' come from?", a: "It is a reduplication and clipping of the word 'delusional' created by Korean pop music fans." },
      { q: "Is 'delulu is the solulu' grammatical?", a: "It is internet slang grammar. 'Solulu' is a playful distortion of 'solution' to create a rhyme." }
    ],
    category: "Slang",
    categorySlug: "slang",
    aiExplanation: "The word displays reduplicative morphology, a common linguistic strategy in colloquial internet register to soften harsh terms (e.g. changing 'delusional' to a cute double-vowel format).",
    aiTranslation: "Playfully optimistic or delusional.",
    votes: 3840,
    commentsCount: 112
  }
];
