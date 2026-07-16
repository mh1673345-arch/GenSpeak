import { PrismaClient, Role, WordStatus, VoteType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding GenSpeak Database with upgraded multi-page schemas...");

  // 1. Clear database tables sequentially
  await prisma.auditLog.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.trending.deleteMany({});
  await prisma.searchHistory.deleteMany({});
  await prisma.example.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.synonym.deleteMany({});
  await prisma.antonym.deleteMany({});
  await prisma.relatedWord.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.guide.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.word.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.platform.deleteMany({});
  await prisma.internetCultureTopic.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared all existing records.");

  // 2. Create seed Admin User and Author profiles
  const adminUser = await prisma.user.create({
    data: {
      name: "GenSpeak Admin",
      email: "admin@genspeak.app",
      role: Role.ADMIN,
    },
  });

  const editorAuthor = await prisma.author.create({
    data: {
      userId: adminUser.id,
      name: "Elena Rostova",
      bio: "Lead linguistic editor at GenSpeak, charting early web slang and youth communication grids.",
      avatarUrl: "/avatars/elena.jpg"
    }
  });

  console.log("Seeded User & Author profiles.");

  // 3. Create Categories
  const catSlang = await prisma.category.create({
    data: { name: "Slang", slug: "slang", description: "Foundational abbreviations and emerging chat tokens.", icon: "💬" }
  });
  const catMemes = await prisma.category.create({
    data: { name: "Memes", slug: "memes", description: "Viral visual macros and shared internet jokes.", icon: "🎭" }
  });
  const catBrainrot = await prisma.category.create({
    data: { name: "Brainrot", slug: "brainrot", description: "Surrealist, algorithmically repeated filler vocabulary.", icon: "🧠" }
  });
  const catHistory = await prisma.category.create({
    data: { name: "History", slug: "history", description: "Classic historical web launch checkpoints.", icon: "⏳" }
  });

  // 4. Create Tags
  const tagGenZ = await prisma.tag.create({ data: { name: "Gen Z", slug: "gen-z" } });
  const tagGenAlpha = await prisma.tag.create({ data: { name: "Gen Alpha", slug: "gen-alpha" } });
  const tagGaming = await prisma.tag.create({ data: { name: "Gaming", slug: "gaming" } });

  // 5. Create Platforms
  const platTikTok = await prisma.platform.create({ data: { name: "TikTok", slug: "tiktok", icon: "music" } });
  const platTwitch = await prisma.platform.create({ data: { name: "Twitch", slug: "twitch", icon: "tv" } });
  const platDiscord = await prisma.platform.create({ data: { name: "Discord", slug: "discord", icon: "message-square" } });

  console.log("Seeded categories, tags, and platforms.");

  // 6. Create Timeline Events
  const event2005 = await prisma.timelineEvent.create({
    data: {
      year: "2005",
      title: "YouTube Launches",
      description: "The birth of global online video sharing.",
      eventDate: new Date("2005-02-14")
    }
  });

  const event2022 = await prisma.timelineEvent.create({
    data: {
      year: "2022",
      title: "Rizz Explodes",
      description: "Kai Cenat introduces 'rizz' on Twitch, showcasing how stream culture acts as a slang incubator.",
      eventDate: new Date("2022-06-01")
    }
  });

  const event2023 = await prisma.timelineEvent.create({
    data: {
      year: "2023",
      title: "Skibidi Toilet Series",
      description: "Absurdist animation begins looping, birthing new filler adjectives.",
      eventDate: new Date("2023-02-07")
    }
  });

  // 7. Seed Words
  // Word 1: rizz
  const wRizz = await prisma.word.create({
    data: {
      title: "rizz",
      slug: "rizz",
      shortMeaning: "One's ability to charm or seduce another person.",
      fullMeaning: "Derived from 'charisma', rizz refers to the capacity to attract romantic partners through style, charm, conversation, or presence. It can be active ('rizzing up') or a passive trait ('unspoken rizz').",
      pronunciation: "/rɪz/",
      ipa: "/rɪz/",
      origin: "Popularized on Twitch streams by creator Kai Cenat in late 2021 before scaling globally on TikTok.",
      firstAppearance: "Twitch broadcast (late 2021)",
      emoji: "😏",
      aiExplanation: "The linguistic evolution of 'rizz' displays aphesis and clipping, isolating the core accented syllable of charisma.",
      aiTranslation: "Charming/courting someone effortlessly.",
      seoTitle: "What does Rizz mean? Definition and Origins",
      seoDescription: "Learn the meaning, origins, and examples of the popular internet slang 'rizz'.",
      historyText: "Rizz was coined in twitch communities before spreading as TikTok reactions. In December 2023, Oxford declared it the official Word of the Year.",
      relatedHashtags: "rizz, charisma, twitch, kai",
      difficulty: "Intermediate",
      popularityScore: 95,
      trendScore: 80,
      commonMistakes: "Using rizz in formal, professional business environments.",
      eli10: "It's like having a magical charisma magnet that makes people like you and laugh at your jokes.",
      parentExplanation: "A clipped form of the word charisma, representing charm and conversational attraction.",
      teacherExplanation: "Slang noun indicating interpersonal charm or persuasion. Generally harmless.",
      safetyNotes: "Entirely benign slang; clean context.",
      references: "https://www.oxfordlanguages.com",
      status: WordStatus.APPROVED,
      authorId: editorAuthor.id,
      categories: { connect: [{ id: catSlang.id }] },
      tags: { connect: [{ id: tagGenZ.id }] },
      platforms: { connect: [{ id: platTikTok.id }, { id: platTwitch.id }] },
      timelineEvents: { connect: [{ id: event2022.id }] },
      examples: {
        create: [
          { text: "He literally has unspoken rizz, he didn't even say anything and she was smiling.", context: "TikTok Comment" },
          { text: "Watch me rizz up this lobby real quick.", context: "Gaming Discord" }
        ]
      },
      conversations: {
        create: [
          { text: "Teen: 'I've got unmatched rizz.'\nParent: 'Does that mean you're good at talking to people?'", context: "Home exchange" }
        ]
      },
      synonyms: { create: [{ term: "Charisma" }, { term: "Game" }] },
      antonyms: { create: [{ term: "L Rizz" }] }
    }
  });

  // Word 2: skibidi
  const wSkibidi = await prisma.word.create({
    data: {
      title: "skibidi",
      slug: "skibidi",
      shortMeaning: "A cool, bad, or random adjective depending on context; popular in Gen Alpha culture.",
      fullMeaning: "Originating from the 'Skibidi Toilet' YouTube series, the word itself is a lexical filler with no fixed definition. It is prefixed to imply absurdity, coolness, or weirdness.",
      pronunciation: "/skɪ.bɪ.di/",
      ipa: "/skɪ.bɪ.di/",
      origin: "Created by animator Alexey Gerasimov (DaFuq!?Boom!) in February 2023.",
      firstAppearance: "DaFuq!?Boom! YouTube Shorts upload (Feb 2023)",
      emoji: "🚽",
      aiExplanation: "Linguistically, 'skibidi' represents a versatile adjective showing rapid semantic shifts in loop media streams.",
      aiTranslation: "Cool / strange (context-dependent).",
      seoTitle: "What does Skibidi mean? Definition and Origin",
      seoDescription: "Discover the meaning and origin of 'skibidi' inside Gen Alpha dictionary entries.",
      historyText: "Emerged in early 2023 as part of an internet meme series. Quickly turned into a primary pillar of Gen Alpha brainrot language.",
      relatedHashtags: "skibidi, brainrot, toilet, alpha",
      difficulty: "Advanced",
      popularityScore: 98,
      trendScore: 95,
      commonMistakes: "Expecting a single literal translation, it acts as a context-dependent descriptor.",
      eli10: "A funny word kids use to say something is super cool, or really silly and strange.",
      parentExplanation: "A nonsense word originating from a popular YouTube series, used interchangeably to mean cool or bad.",
      teacherExplanation: "Neologism from video media. Used as a structural filler in peer speech patterns.",
      safetyNotes: "Harmless, though parents should monitor the YouTube series for mild animated battle themes.",
      references: "https://www.youtube.com",
      status: WordStatus.APPROVED,
      authorId: editorAuthor.id,
      categories: { connect: [{ id: catBrainrot.id }, { id: catMemes.id }] },
      tags: { connect: [{ id: tagGenAlpha.id }, { id: tagGaming.id }] },
      platforms: { connect: [{ id: platDiscord.id }] },
      timelineEvents: { connect: [{ id: event2023.id }] },
      examples: {
        create: [
          { text: "That new hoverboard is so skibidi.", context: "Gen Alpha slang" }
        ]
      },
      synonyms: { create: [{ term: "Surreal" }] },
      antonyms: { create: [{ term: "Standard" }] }
    }
  });

  // Word 3: gyatt
  const wGyatt = await prisma.word.create({
    data: {
      title: "gyatt",
      slug: "gyatt",
      shortMeaning: "An exclamation of surprise or excitement, typically referencing physical build.",
      fullMeaning: "Short for 'God damn', gyatt is used as a high-impact exclamation. It became popularized in Twitch chat overlays and later morphed into a noun/adjective describing physique.",
      pronunciation: "/ɡjɑːt/",
      ipa: "/ɡjɑːt/",
      origin: "Twitch streamer channels, scaling globally in mid-2023 on short-form loops.",
      firstAppearance: "Twitch streams (2022)",
      emoji: "😮",
      historyText: "Started as a phonetic spelling of Twitch streamers exclaiming surprise, later evolving on TikTok comments.",
      relatedHashtags: "gyatt, twitch, stream, reaction",
      difficulty: "Intermediate",
      popularityScore: 92,
      trendScore: 85,
      commonMistakes: "Using it in formal school presentations or essay assignments.",
      eli10: "A loud sound people say when they are super surprised by something cool.",
      parentExplanation: "An exclamation clipped from 'God damn', used to express astonishment or excitement.",
      teacherExplanation: "Subculture interjection indicating high surprise. Discourage usage in classroom decorum.",
      safetyNotes: "Contains mild anatomical connotations in certain visual contexts. Monitor usage.",
      references: "https://www.twitch.tv",
      status: WordStatus.APPROVED,
      authorId: editorAuthor.id,
      categories: { connect: [{ id: catSlang.id }, { id: catBrainrot.id }] },
      tags: { connect: [{ id: tagGenAlpha.id }] },
      platforms: { connect: [{ id: platTikTok.id }] }
    }
  });

  // Word 4: sigma
  const wSigma = await prisma.word.create({
    data: {
      title: "sigma",
      slug: "sigma",
      shortMeaning: "A cool, independent, self-reliant male archetype or general slang for cool.",
      fullMeaning: "Originally part of pseudoscientific social structures (sigma male), the term became highly ironized as a synonym for 'cool', 'respectable', or 'badass'.",
      pronunciation: "/ˈsɪɡ.mə/",
      ipa: "/ˈsɪɡ.mə/",
      origin: "Internet forums and TikTok video edits highlighting cool expressions.",
      firstAppearance: "Web forums (2021)",
      emoji: "🤫",
      historyText: "Derived from old internet personality forums. Transformed into an ironic cool indicator via silent-walk film overlays on short form videos.",
      relatedHashtags: "sigma, cool, silent, iron",
      difficulty: "Beginner",
      popularityScore: 90,
      trendScore: 75,
      commonMistakes: "Taking the male archetype personality classifications too seriously.",
      eli10: "Like a quiet superhero who does their own thing and doesn't need to show off.",
      parentExplanation: "A term indicating an independent, self-reliant individual who achieves goals quietly.",
      teacherExplanation: "Subculture character description indicating self-directed focus. Safe to use.",
      safetyNotes: "Benign; often used in a humorous or self-mocking way.",
      references: "https://reddit.com",
      status: WordStatus.APPROVED,
      authorId: editorAuthor.id,
      categories: { connect: [{ id: catSlang.id }, { id: catMemes.id }] },
      tags: { connect: [{ id: tagGaming.id }] },
      platforms: { connect: [{ id: platDiscord.id }] }
    }
  });

  console.log("Seeded words database.");

  // 8. Create seed Collections (Curated Decks)
  const collTikTok = await prisma.collection.create({
    data: {
      title: "Top TikTok Slang",
      slug: "top-tiktok-slang",
      description: "The absolute essential terms defining the TikTok comments, audio trends, and reaction formats.",
      bannerGradient: "from-primary-purple to-primary-pink",
      words: { connect: [{ id: wRizz.id }, { id: wSkibidi.id }, { id: wGyatt.id }] }
    }
  });

  const collGaming = await prisma.collection.create({
    data: {
      title: "Most Popular Gaming Terms",
      slug: "popular-gaming-terms",
      description: "Lobby chatter, voice-chat callouts, and competitive ranking terms used in Fortnite and Roblox.",
      bannerGradient: "from-accent-cyan to-primary-purple",
      words: { connect: [{ id: wSigma.id }, { id: wRizz.id }] }
    }
  });

  console.log("Seeded curated collections.");

  // 9. Create seed Editorial Guides
  const guideSlang = await prisma.guide.create({
    data: {
      title: "The Complete Guide to Gen Z Slang",
      slug: "complete-guide-to-gen-z-slang",
      description: "An editorial breakdown of the most popular Gen Z expressions, text formats, and linguistic quirks.",
      content: "Gen Z communication is built on high irony, emotional hyperbole, and visual-first references. Understanding this lexicon requires looking past the literal translation and viewing the emotional context.",
      readTime: "6 min read",
      published: true,
      publishedAt: new Date(),
      authorId: editorAuthor.id,
      words: { connect: [{ id: wRizz.id }] },
      categories: { connect: [{ id: catSlang.id }] },
      collections: { connect: [{ id: collTikTok.id }] }
    }
  });

  // 10. Seed Internet Culture Topics
  const topicBasics = await prisma.internetCultureTopic.create({
    data: {
      title: "Internet Basics",
      slug: "basics",
      description: "The core foundations of online speak, foundational acronyms, and netiquette guidelines.",
      introduction: "Internet Basics covers the foundation of online communication. From early BBS boards and email abbreviations to universal modern acronyms, this is the grammar that runs the internet.",
      historyText: "Modern web dialect evolved from early Unix terminals, IRC (Internet Relay Chat), and SMS character limitations. These constraints birthed shortcuts like LOL, BRB, and ASAP that remain universal."
    }
  });

  console.log("Seeded guides and topics.");
  console.log("GenSpeak database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
