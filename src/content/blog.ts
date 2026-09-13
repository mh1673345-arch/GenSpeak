export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readMinutes: number;
  tags: string[];
  body: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "language-changes-with-time",
    title: "Language Has Always Been Changing. The Internet Just Sped It Up.",
    excerpt:
      "Every generation thinks the one after it is ruining the language. Every generation before them thought the same thing. Here is why that fear is old, why the internet made the cycle visible for the first time, and why I built GenSpeak because of it.",
    author: "M. Hassan Bin Asif",
    date: "2026-09-14",
    readMinutes: 9,
    tags: ["language", "internet-culture", "founder-note"],
    body: [
      {
        type: "p",
        text: "Somewhere on my phone is a screenshot I have never deleted: my mother, texting me to ask what \"lowkey\" meant, followed four minutes later by a second message asking why \"highkey\" meant the opposite. I remember laughing, then trying to explain it, then realising I couldn't actually explain it well. I knew how to use the word. I did not know where it came from, why it existed, or why English suddenly needed two new adverbs for an idea it already had words for. That gap between using a word and understanding it is the entire reason this website exists.",
      },
      {
        type: "h2",
        text: "The fear is centuries old",
      },
      {
        type: "p",
        text: "People have been certain the language was collapsing for as long as there has been language to complain about. Jonathan Swift spent part of the 1700s campaigning against contractions like \"don't\" and \"can't\", convinced they were coarsening English. Victorian style guides treated the word \"reliable\" as an ugly, uneducated invention. In the 1980s, television and pop music were blamed for eroding young people's vocabulary, the same charge now aimed at TikTok. None of these predictions came true the way their authors expected, because they were never really about language. They were about the discomfort of watching something you consider yours change in front of you, faster than you would like, in the hands of people younger than you.",
      },
      {
        type: "p",
        text: "Linguists have a name for the actual, unremarkable process underneath all that anxiety: semantic drift. Words widen, narrow, flip, and get replaced constantly, and they always have. \"Silly\" meant blessed in Old English. \"Nice\" meant foolish in Middle English. \"Awful\" meant awe-inspiring, in a good way, until it did not. If you could talk to an English speaker from four hundred years ago, you would understand maybe half of what they said, and they would find your accent, your grammar, and a large share of your vocabulary completely alien. That was true long before there was an internet to blame for it.",
      },
      {
        type: "h2",
        text: "What actually changed is the clock speed",
      },
      {
        type: "p",
        text: "What is genuinely new is not that language changes. It is how fast it can now change, and how visible that speed has become. For most of history, a new word spread the way anything spread before mass communication: through trade routes, migration, conquest, and the slow drift of people moving and talking to each other. A slang term coined in one city might take a generation to reach another, if it ever did. Dictionaries could survive on decade-long revision cycles because the language itself moved at a decade-long pace.",
      },
      {
        type: "p",
        text: "That pace is gone. A joke made in a Discord server on a Tuesday can be a format on TikTok by Thursday and a brand's marketing email by the following Monday, at which point the people who made it have usually already abandoned it, because its arrival in a marketing email is proof that it is over. I have tried, while building the dictionary behind this site, to date when certain words entered wide use, and the honest answer for some of them is measured in weeks, not years. \"Demure\" went from one person's video to a genuinely exhausted cultural reference in under a month in 2024. No dictionary built for a decade-long revision cycle was ever going to keep up with that, and it is not a failure of those dictionaries. They were built for a world that changed at a different speed.",
      },
      {
        type: "h2",
        text: "The internet did not just speed things up. It changed who gets credit.",
      },
      {
        type: "p",
        text: "There is a second thing the internet did that I think matters more than the speed, and it is the part most casual complaints about slang miss entirely: it made the origin of language visible, and that visibility keeps exposing an old injustice. Go through the words in this dictionary and a pattern shows up immediately. An enormous share of what people now consider generically \"internet slang\" or \"Gen Z slang\" has direct, traceable roots in African American Vernacular English, in queer and ballroom culture, in specific real communities who built these words for their own use, years before a platform's trending page carried them somewhere else and stripped the credit off along the way.",
      },
      {
        type: "quote",
        text: "\"Cap\" and \"no cap\" did not start on TikTok. \"Slay\", \"shade\", and \"tea\" did not start on Twitter. \"Rizz\" was not born on a trending page. They were already alive, doing real work, in real communities, long before an app made them visible to everyone else.",
      },
      {
        type: "p",
        text: "This is not a new complaint, academically speaking. Linguists who study African American Vernacular English and ballroom culture have documented this cycle of adoption and credit-stripping for decades. But it is rarely reflected in the actual reference material people reach for when they hear a word they do not know. A definition without an honest origin is not just incomplete. It quietly finishes the erasure that the trend cycle started. That is a small thing to fix with a dictionary entry, but it is not a nothing thing, and it was one of the reasons I did not want to build this site as just another list of definitions.",
      },
      {
        type: "h2",
        text: "Why I actually built this",
      },
      {
        type: "p",
        text: "I did not set out to build a linguistics project. I set out to solve my own mother's problem, and then realised how many people have the exact same problem from different directions. Parents trying to understand their kids without interrogating them. Teachers trying to figure out if a word in a classroom is harmless or a genuine warning sign. Non-native English speakers who can translate every individual word in a sentence and still have no idea what it means. Journalists and marketers who want to reference something current and instead reference something that died out eighteen months ago, visibly out of touch. Older internet users who remember when a word meant something completely different and want to know what happened to it. Younger users who use a word fluently and have never once wondered where it came from, because why would they.",
      },
      {
        type: "p",
        text: "The existing options were not built for any of that. Crowdsourced slang dictionaries are fast but unreliable, full of joke entries, settled scores, and definitions with no origin, no date, and no way to tell a currently used term from something nobody has said unironically since 2016. Formal dictionaries are reliable but slow, often years behind, and understandably cautious about a vocabulary that moves faster than any editorial board can responsibly verify. Neither one was solving the actual problem, which is not \"what does this word mean\" so much as \"what does this word mean, where did it actually come from, and can I trust that answer.\"",
      },
      {
        type: "p",
        text: "That is the gap GenSpeak is built to sit in. Every entry gets a real definition, a plain-language rewrite for when the formal one still does not land, an origin that traces the word back as honestly as I can manage, usage examples that sound like something a person would actually type, and an honest usage trend instead of a pretense that a word is either eternal or brand new. Descriptive, not prescriptive: if a word is genuinely in use, it belongs here whether or not I personally like it, the same way a real dictionary does not get to have opinions about the words it defines.",
      },
      {
        type: "h2",
        text: "This will be out of date the day I publish it, and that is fine",
      },
      {
        type: "p",
        text: "I want to be honest about something: some fraction of what is in this dictionary right now will read as dated within a year, the same way \"on fleek\" now reads as a very specific snapshot of 2014. That is not a flaw in the project. That is the actual subject of the project. Language keeps moving, communities keep inventing, platforms keep redistributing, and a living dictionary's job is not to freeze that process, it is to keep an honest, well-sourced record of it as it happens, the way this blog post itself will eventually become a small piece of that record. My mother, by the way, has since asked me what \"gyat\" means. I sent her the link instead of trying to explain it over text again. That, more than anything else, is what this website is for.",
      },
    ],
  },
];
