"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  BookOpen, Clock, AlertTriangle, Check, X, 
  Edit3, Terminal, Sparkles, Eye, Info,
  Link2, CheckCircle2, FileText, Upload, RefreshCw, BarChart2
} from "lucide-react";
import { WordData } from "@/data/mockWords";
import { executeAIRequest } from "@/lib/aiService";

export default function EditorialStudio() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "editor" | "linking" | "importer" | "revisions">("dashboard");
  const [editorSubTab, setEditorSubTab] = useState<"basics" | "history" | "explanations" | "seo">("basics");
  const [wordsList, setWordsList] = useState<WordData[]>([]);
  const [activeContentType, setActiveContentType] = useState<"word" | "topic" | "guide" | "collection">("word");
  
  // Editor form states
  const [wordForm, setWordForm] = useState({
    term: "",
    definition: "",
    meaning: "",
    pronunciation: "",
    ipa: "",
    origin: "",
    firstAppearance: "",
    emoji: "",
    examples: "",
    conversations: "",
    synonyms: "",
    antonyms: "",
    relatedWords: "",
    category: "Slang",
    seoTitle: "",
    seoDescription: "",
    ogTitle: "",
    ogDescription: "",
    featuredImage: "",
    gallery: "",
    historyText: "",
    relatedHashtags: "",
    difficulty: "Intermediate",
    popularityScore: "85",
    trendScore: "75",
    commonMistakes: "",
    eli10: "",
    parentExplanation: "",
    teacherExplanation: "",
    safetyNotes: "",
    references: "",
    faq: "",
    status: "DRAFT" as "DRAFT" | "PENDING_REVIEW" | "APPROVED",
    aiExplanation: ""
  });

  // Importer state
  const [importData, setImportData] = useState("");
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [aiLoading, setAiLoading] = useState(false);

  // Link recommendations state
  const [activeLinkingWord, setActiveLinkingWord] = useState<WordData | null>(null);
  const [linkingRecommendations, setLinkingRecommendations] = useState<{
    words: string[];
    guides: string[];
    collections: string[];
    categories: string[];
  } | null>(null);

  // Mock revision history
  const [revisionHistory, setRevisionHistory] = useState([
    { id: "log1", action: "ENTRY_PUBLISH", user: "Elena Rostova", details: "Published definition for rizz", time: "10 mins ago" },
    { id: "log2", action: "AI_DRAFT_GENERATE", user: "Elena Rostova", details: "AI draft generated for skibidi", time: "1 hour ago" },
    { id: "log3", action: "DRAFT_CREATE", user: "David Miller", details: "Created entry draft for gyatt", time: "2 hours ago" }
  ]);

  // Fetch words from database on mount
  useEffect(() => {
    fetch("/api/admin/words")
      .then((res) => res.json())
      .then((data) => setWordsList(data))
      .catch((err) => console.error("Failed to load admin words:", err));
  }, []);

  // Stats calculation
  const totalWords = wordsList.length;
  const draftWords = wordsList.filter(w => w.popularityStatus === "Archive" || !w.popularityStatus).length; 
  const publishedWords = wordsList.filter(w => w.popularityStatus === "Viral" || w.popularityStatus === "Growing" || w.popularityStatus === "Common").length;
  const scheduledWords = wordsList.filter(w => w.popularityStatus === "Archive").length;

  const missingExamples = wordsList.filter(w => w.examples.length === 0).length;
  const missingOrigins = wordsList.filter(w => !w.origin || w.origin.includes("validation")).length;
  const missingRelated = wordsList.filter(w => w.synonyms.length === 0).length;
  const lowSeoScore = wordsList.filter(w => !w.aiExplanation).length;

  // Real-time SEO Score Calculator
  const getSeoScore = () => {
    let score = 10;
    if (wordForm.seoTitle.length >= 40 && wordForm.seoTitle.length <= 70) score += 15;
    if (wordForm.seoDescription.length >= 100 && wordForm.seoDescription.length <= 160) score += 15;
    if ((wordForm.definition.length + wordForm.meaning.length) > 120) score += 15;
    if (wordForm.examples.length > 5) score += 10;
    if (wordForm.synonyms.length > 0) score += 10;
    if (wordForm.eli10.length > 20) score += 15;
    if (wordForm.safetyNotes.length > 10) score += 10;
    return Math.min(100, score);
  };

  const seoScore = getSeoScore();

  // Content Completeness Score Calculator
  const getCompletenessScore = () => {
    const fields = [
      wordForm.term, wordForm.definition, wordForm.meaning, wordForm.pronunciation,
      wordForm.origin, wordForm.firstAppearance, wordForm.emoji, wordForm.examples,
      wordForm.synonyms, wordForm.antonyms, wordForm.seoTitle, wordForm.seoDescription,
      wordForm.ipa, wordForm.historyText, wordForm.relatedHashtags, wordForm.difficulty,
      wordForm.eli10, wordForm.parentExplanation, wordForm.teacherExplanation,
      wordForm.safetyNotes, wordForm.references
    ];
    const filled = fields.filter(f => f && f.trim().length > 0).length;
    return Math.floor((filled / fields.length) * 100);
  };

  const completenessScore = getCompletenessScore();

  // AI draft generating pipeline
  const handleAiDraftGenerate = async () => {
    if (!wordForm.term.trim()) {
      alert("Please type a slang term first to draft content using AI.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await executeAIRequest("slangTranslate", wordForm.term);
      const parts = response.content.split("\n\n");
      
      const mockedDraft = {
        term: wordForm.term.toLowerCase(),
        definition: parts[0] || `One's capability of charms / seduction or general attraction power.`,
        meaning: parts[1] || `A contemporary internet term derived from 'charisma'. Refers to natural conversational appeal, confidence, and romantic game.`,
        pronunciation: `/${wordForm.term.toLowerCase()}/`,
        ipa: `/${wordForm.term.toLowerCase()}/`,
        origin: parts[2] || `Emerging in twitch broadcasts (mid 2021) and scaling globally via TikTok loops in 2022.`,
        firstAppearance: "Twitch broadcast streams (late 2021)",
        emoji: "😏",
        examples: `[{"text": "He literally has unspoken ${wordForm.term}.", "context": "TikTok Comment"}]`,
        conversations: `Teen: "Check my ${wordForm.term}." / Parent: "Is that confidence?"`,
        synonyms: "Charisma, Charm, Game",
        antonyms: `L ${wordForm.term}`,
        relatedWords: "aura, cooked, gyatt",
        category: "Slang",
        seoTitle: `What does ${wordForm.term} mean? Definition, Origins, & Real Examples`,
        seoDescription: `Learn the comprehensive definition, origins, pronunciation rules, and usage contexts behind the popular slang '${wordForm.term}'.`,
        faq: `Where does the word come from? - It is clipped from the word charisma.`,
        status: "PENDING_REVIEW" as const,
        aiExplanation: response.content || "Draft generated.",
        ogTitle: `What Does ${wordForm.term} Mean? | GenSpeak`,
        ogDescription: `Complete glossary breakdown for the term ${wordForm.term}.`,
        featuredImage: "",
        gallery: "",
        historyText: `Coined in streaming channels, spreading as viral visual formats.`,
        relatedHashtags: `${wordForm.term}, slang, definition`,
        difficulty: "Intermediate",
        popularityScore: "85",
        trendScore: "75",
        commonMistakes: "",
        eli10: `It means having a smooth personality that makes people want to talk to you.`,
        parentExplanation: `A shortened version of charisma indicating attraction and verbal confidence.`,
        teacherExplanation: `Slang noun indicating interpersonal charm or persuasion. Generally harmless.`,
        safetyNotes: `Entirely benign slang; safe to use.`,
        references: ""
      };

      setWordForm(mockedDraft);

      const newLog = {
        id: `log-${Date.now()}`,
        action: "AI_DRAFT_GENERATE",
        user: "Elena Rostova",
        details: `AI draft generated successfully for: ${wordForm.term}`,
        time: "Just now"
      };
      setRevisionHistory([newLog, ...revisionHistory]);

    } catch (error) {
      console.error(error);
      alert("Error generating AI draft. Falling back to local dictionary models.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordForm.term || !wordForm.definition) return;

    // Content duplicates validator check
    const isDuplicate = wordsList.some(
      (w) => w.term.toLowerCase() === wordForm.term.toLowerCase()
    );
    if (isDuplicate) {
      alert(`Validation error: An entry for "${wordForm.term}" already exists inside the dictionary indexes.`);
      return;
    }

    try {
      const response = await fetch("/api/admin/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wordForm)
      });

      if (response.ok) {
        const freshRes = await fetch("/api/admin/words");
        const freshData = await freshRes.json();
        setWordsList(freshData);

        const newWordEntry = freshData.find((w: WordData) => w.slug === wordForm.term.toLowerCase().replace(/\s+/g, "-"));
        if (newWordEntry) {
          setActiveLinkingWord(newWordEntry);
          setLinkingRecommendations({
            words: ["rizz", "gyatt", "sigma"].filter(w => w !== newWordEntry.term),
            guides: ["complete-guide-to-gen-z-slang"],
            collections: ["top-tiktok-slang"],
            categories: [newWordEntry.categorySlug]
          });
          setActiveTab("linking");
        }

        const newLog = {
          id: `log-${Date.now()}`,
          action: "ENTRY_PUBLISH",
          user: "Elena Rostova",
          details: `Created database dictionary entry for ${wordForm.term}`,
          time: "Just now"
        };
        setRevisionHistory([newLog, ...revisionHistory]);

        setWordForm({
          term: "", definition: "", meaning: "", pronunciation: "", ipa: "", origin: "",
          firstAppearance: "", emoji: "", examples: "", conversations: "",
          synonyms: "", antonyms: "", relatedWords: "", category: "Slang",
          seoTitle: "", seoDescription: "", ogTitle: "", ogDescription: "",
          featuredImage: "", gallery: "", historyText: "", relatedHashtags: "",
          difficulty: "Intermediate", popularityScore: "85", trendScore: "75",
          commonMistakes: "", eli10: "", parentExplanation: "", teacherExplanation: "",
          safetyNotes: "", references: "", faq: "", status: "DRAFT", aiExplanation: ""
        });
        
        alert("Dictionary entry saved successfully!");
      } else {
        const err = await response.json();
        alert(`Failed to save entry: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error saving word details.");
    }
  };

  // Batch importer execution (supports JSON and CSV templates)
  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    interface ImportWordItem {
      term: string;
      definition: string;
      meaning?: string;
      pronunciation?: string;
      origin?: string;
      category?: string;
      synonyms?: string[];
      antonyms?: string[];
    }
    try {
      let items: ImportWordItem[] = [];
      const rawInput = importData.trim();

      if (rawInput.startsWith("[")) {
        items = JSON.parse(rawInput);
      } else {
        // Simple CSV parser
        const lines = rawInput.split("\n").filter(l => l.trim());
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
        items = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          const obj: Record<string, string | string[]> = {};
          headers.forEach((header, index) => {
            if (header === "synonyms" || header === "antonyms") {
              obj[header] = values[index] ? values[index].split(";").map(s => s.trim()) : [];
            } else {
              obj[header] = values[index] || "";
            }
          });
          return obj as unknown as ImportWordItem;
        });
      }

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid import template array.");
      }

      const response = await fetch("/api/admin/words/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });

      if (response.ok) {
        const result = await response.json();
        
        const freshRes = await fetch("/api/admin/words");
        const freshData = await freshRes.json();
        setWordsList(freshData);

        setImportStatus("success");
        setImportData("");
        setTimeout(() => setImportStatus("idle"), 3500);

        const newLog = {
          id: `log-${Date.now()}`,
          action: "BATCH_IMPORT",
          user: "Elena Rostova",
          details: `Imported ${result.imported} entries, skipped ${result.skipped} duplicates`,
          time: "Just now"
        };
        setRevisionHistory([newLog, ...revisionHistory]);
      } else {
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 3500);
      }
    } catch (err) {
      console.error(err);
      setImportStatus("error");
      setTimeout(() => setImportStatus("idle"), 3500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col gap-2 border-b border-white/5 pb-8 mb-10 mt-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF8A3D] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            CONTENT ARCHITECTURE DESK
          </span>
          <h1 className="text-4xl font-black font-display tracking-tight leading-none text-white text-left animate-fade-in">
            Editorial <span className="text-[#FF8A3D]">Studio.</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-xl leading-relaxed mt-1 text-left">
            Build drafts, validate SEO profiles, auto-link metadata records, and verify slang distributions in our global internet culture index.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 pb-3.5 mb-8 gap-6 text-xs font-mono font-bold tracking-wider">
          {[
            { id: "dashboard", label: "PIPELINE DASHBOARD" },
            { id: "editor", label: "CREATOR STUDIO" },
            { id: "linking", label: "AUTO LINKER" },
            { id: "importer", label: "BATCH IMPORTER" },
            { id: "revisions", label: "AUDIT LOGS" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "dashboard" | "editor" | "linking" | "importer" | "revisions")}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === tab.id ? "text-[#FF8A3D] border-b-2 border-[#FF8A3D]" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PIPELINE DASHBOARD */}
        {activeTab === "dashboard" && (
          <section className="flex flex-col gap-10">
            {/* Grid of stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Total Entries", count: totalWords, icon: <BookOpen className="w-4 h-4 text-primary-pink" /> },
                { title: "Draft State", count: draftWords, icon: <Edit3 className="w-4 h-4 text-[#FFB347]" /> },
                { title: "Published State", count: publishedWords, icon: <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> },
                { title: "Scheduled State", count: scheduledWords, icon: <Clock className="w-4 h-4 text-[#4D9EFF]" /> }
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-[#111217]/20 p-5 flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{stat.title}</span>
                    <span className="text-2xl font-bold font-display">{stat.count}</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Quality audits list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Warnings and issues checklist */}
              <div className="rounded-2xl border border-white/5 bg-[#111217]/15 p-6 flex flex-col gap-5">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF8A3D]" />
                  Content Quality Audits
                </h3>
                <div className="flex flex-col gap-3.5 text-xs text-[#9EA3B0] font-sans">
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-2 text-left">
                    <span>Missing Usage Examples</span>
                    <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">{missingExamples} words</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-2 text-left">
                    <span>Missing Era / Origins</span>
                    <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">{missingOrigins} words</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-2 text-left">
                    <span>Missing Related Metadata</span>
                    <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">{missingRelated} words</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 text-left">
                    <span>Missing SEO Explanations (Low Score)</span>
                    <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">{lowSeoScore} words</span>
                  </div>
                </div>
              </div>

              {/* Missing entries search query list */}
              <div className="rounded-2xl border border-white/5 bg-[#111217]/15 p-6 flex flex-col gap-5">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#4D9EFF]" />
                  Most Searched Terms Without Entries
                </h3>
                <div className="flex flex-col gap-3.5 text-xs text-[#9EA3B0] font-mono uppercase tracking-wider">
                  {[
                    { term: "mewing", queries: 4325 },
                    { term: "mogging", queries: 3290 },
                    { term: "fanum tax", queries: 2840 },
                    { term: "gooning", queries: 1950 }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/[0.03] pb-2 last:border-0 last:pb-0 text-left">
                      <span className="text-white font-bold">{item.term}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.queries} searches</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* TAB 2: CREATOR STUDIO */}
        {activeTab === "editor" && (
          <section className="flex flex-col gap-8 text-left animate-fade-in">
            {/* Content Type select buttons */}
            <div className="flex gap-3 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-fit text-[10px] font-mono uppercase tracking-widest">
              {(["word", "topic", "guide", "collection"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveContentType(type)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeContentType === type ? "bg-[#FF8A3D] text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {type}s
                </button>
              ))}
            </div>

            {/* Form layout */}
            {activeContentType === "word" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* CMS Input columns divided into Tabs */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Editor sub tabs */}
                  <div className="flex border-b border-white/5 pb-2.5 gap-4 text-[10px] font-mono font-bold tracking-widest">
                    {[
                      { id: "basics", label: "1. BASIC INFO" },
                      { id: "history", label: "2. HISTORY & ORIGIN" },
                      { id: "explanations", label: "3. EXPLANATIONS" },
                      { id: "seo", label: "4. METADATA & SEO" }
                    ].map((tab) => (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setEditorSubTab(tab.id as "basics" | "history" | "explanations" | "seo")}
                        className={`pb-1 px-1 transition-all border-b ${
                          editorSubTab === tab.id ? "text-primary-pink border-primary-pink" : "text-slate-500 border-transparent hover:text-slate-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleCreateWordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111217]/10 border border-white/5 p-6 rounded-2xl">
                    
                    {editorSubTab === "basics" && (
                      <>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Slang Term</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={wordForm.term}
                              onChange={(e) => setWordForm({ ...wordForm, term: e.target.value })}
                              required
                              placeholder="e.g., mewing"
                              className="flex-1 bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40"
                            />
                            <button
                              type="button"
                              onClick={handleAiDraftGenerate}
                              disabled={aiLoading}
                              className="px-4 bg-[#FF6A1A]/10 border border-[#FF6A1A]/20 text-[#FF8A3D] hover:bg-[#FF6A1A]/20 font-mono font-bold text-[10px] tracking-wider uppercase rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              <span>AI Assistant</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Short Definition</label>
                          <input
                            type="text"
                            value={wordForm.definition}
                            onChange={(e) => setWordForm({ ...wordForm, definition: e.target.value })}
                            required
                            placeholder="Core definition statement..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Detailed Meaning</label>
                          <textarea
                            rows={3}
                            value={wordForm.meaning}
                            onChange={(e) => setWordForm({ ...wordForm, meaning: e.target.value })}
                            placeholder="Provide full semantic explanations..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40 resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Pronunciation (Phonetic)</label>
                          <input
                            type="text"
                            value={wordForm.pronunciation}
                            onChange={(e) => setWordForm({ ...wordForm, pronunciation: e.target.value })}
                            placeholder="/skɪ.bɪ.di/"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">IPA symbol representation</label>
                          <input
                            type="text"
                            value={wordForm.ipa}
                            onChange={(e) => setWordForm({ ...wordForm, ipa: e.target.value })}
                            placeholder="/skɪ.bɪ.di/"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Category</label>
                          <select
                            value={wordForm.category}
                            onChange={(e) => setWordForm({ ...wordForm, category: e.target.value })}
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white outline-none"
                          >
                            <option value="Slang">Slang</option>
                            <option value="Memes">Memes</option>
                            <option value="Brainrot">Brainrot</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Difficulty level</label>
                          <select
                            value={wordForm.difficulty}
                            onChange={(e) => setWordForm({ ...wordForm, difficulty: e.target.value })}
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Emoji association</label>
                          <input
                            type="text"
                            value={wordForm.emoji}
                            onChange={(e) => setWordForm({ ...wordForm, emoji: e.target.value })}
                            placeholder="😏"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {editorSubTab === "history" && (
                      <>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Linguistic Origin</label>
                          <input
                            type="text"
                            value={wordForm.origin}
                            onChange={(e) => setWordForm({ ...wordForm, origin: e.target.value })}
                            placeholder="Coined on Twitch, spread to TikTok comments"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">First Appearance date/era</label>
                          <input
                            type="text"
                            value={wordForm.firstAppearance}
                            onChange={(e) => setWordForm({ ...wordForm, firstAppearance: e.target.value })}
                            placeholder="Mid 2022"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">References/Sources (URL)</label>
                          <input
                            type="text"
                            value={wordForm.references}
                            onChange={(e) => setWordForm({ ...wordForm, references: e.target.value })}
                            placeholder="https://oxfordlanguages.com"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Internet History Timeline Narrative</label>
                          <textarea
                            rows={4}
                            value={wordForm.historyText}
                            onChange={(e) => setWordForm({ ...wordForm, historyText: e.target.value })}
                            placeholder="Enter detailed milestones, viral shifts, and usage explosions timeline..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40 resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Related Hashtags (comma separated)</label>
                          <input
                            type="text"
                            value={wordForm.relatedHashtags}
                            onChange={(e) => setWordForm({ ...wordForm, relatedHashtags: e.target.value })}
                            placeholder="rizz, charisma, charm, kai"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {editorSubTab === "explanations" && (
                      <>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Explain Like I&apos;m 10 (ELI10)</label>
                          <textarea
                            rows={3}
                            value={wordForm.eli10}
                            onChange={(e) => setWordForm({ ...wordForm, eli10: e.target.value })}
                            placeholder="Explain the slang in extremely basic metaphors for children..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Parent-Friendly Translation</label>
                          <textarea
                            rows={3}
                            value={wordForm.parentExplanation}
                            onChange={(e) => setWordForm({ ...wordForm, parentExplanation: e.target.value })}
                            placeholder="Brief description mapping to adult vocabulary indexes..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Teacher Guide Explanation</label>
                          <textarea
                            rows={3}
                            value={wordForm.teacherExplanation}
                            onChange={(e) => setWordForm({ ...wordForm, teacherExplanation: e.target.value })}
                            placeholder="Classroom advice and cultural contexts explanations..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Safety warning notes</label>
                          <textarea
                            rows={2}
                            value={wordForm.safetyNotes}
                            onChange={(e) => setWordForm({ ...wordForm, safetyNotes: e.target.value })}
                            placeholder="Add safety warnings if the term is offensive or inappropriate..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none resize-none"
                          />
                        </div>
                      </>
                    )}

                    {editorSubTab === "seo" && (
                      <>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">SEO Title tag</label>
                          <input
                            type="text"
                            value={wordForm.seoTitle}
                            onChange={(e) => setWordForm({ ...wordForm, seoTitle: e.target.value })}
                            placeholder="What does slang mean? Definition guide..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40"
                          />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">SEO Meta Description</label>
                          <input
                            type="text"
                            value={wordForm.seoDescription}
                            onChange={(e) => setWordForm({ ...wordForm, seoDescription: e.target.value })}
                            placeholder="Brief search page listing teaser snippet..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">OG Title card</label>
                          <input
                            type="text"
                            value={wordForm.ogTitle}
                            onChange={(e) => setWordForm({ ...wordForm, ogTitle: e.target.value })}
                            placeholder="Social share title card..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">OG Description card</label>
                          <input
                            type="text"
                            value={wordForm.ogDescription}
                            onChange={(e) => setWordForm({ ...wordForm, ogDescription: e.target.value })}
                            placeholder="Social share description teaser..."
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Popularity Score (0-100)</label>
                          <input
                            type="number"
                            value={wordForm.popularityScore}
                            onChange={(e) => setWordForm({ ...wordForm, popularityScore: e.target.value })}
                            placeholder="90"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Trend Score (0-100)</label>
                          <input
                            type="number"
                            value={wordForm.trendScore}
                            onChange={(e) => setWordForm({ ...wordForm, trendScore: e.target.value })}
                            placeholder="85"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Featured Image URL</label>
                          <input
                            type="text"
                            value={wordForm.featuredImage}
                            onChange={(e) => setWordForm({ ...wordForm, featuredImage: e.target.value })}
                            placeholder="/featured/rizz.png"
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Publishing Workflow Status</label>
                          <select
                            value={wordForm.status}
                            onChange={(e) => setWordForm({ ...wordForm, status: e.target.value as "DRAFT" | "PENDING_REVIEW" | "APPROVED" })}
                            className="bg-black/45 border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white outline-none"
                          >
                            <option value="DRAFT">DRAFT (Invisible)</option>
                            <option value="PENDING_REVIEW">PENDING REVIEW</option>
                            <option value="APPROVED">APPROVED (Live)</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2 border-t border-white/5 pt-4">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-pink text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-primary-pink/90 active:scale-95 cursor-pointer"
                      >
                        <span>Upsert Knowledge Object</span>
                        <Check className="w-4 h-4" />
                      </button>
                    </div>

                  </form>
                </div>

                {/* CMS Stats and Real-time Audits sidebar columns */}
                <div className="flex flex-col gap-6">
                  
                  {/* Completeness score widget */}
                  <div className="rounded-2xl border border-white/5 bg-[#111217]/15 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-accent-cyan" />
                        Completeness
                      </span>
                      <span className="text-xs font-mono font-bold text-accent-cyan">{completenessScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.03] border border-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-accent-cyan transition-all duration-300"
                        style={{ width: `${completenessScore}%` }}
                      />
                    </div>
                    {completenessScore < 100 && (
                      <span className="text-[9px] text-slate-500 font-sans mt-0.5 leading-relaxed">
                        • Complete safety warning tags, teacher definitions, and internet timeline narrative blocks to maximize record index levels.
                      </span>
                    )}
                  </div>

                  {/* Real-time SEO Score checklist */}
                  <div className="rounded-2xl border border-white/5 bg-[#111217]/15 p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">SEO Score Card</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        seoScore > 80 ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#F59E0B]/15 text-[#F59E0B]"
                      }`}>
                        {seoScore}%
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 text-xs text-[#9EA3B0] font-sans">
                      <div className="flex items-center justify-between">
                        <span>Title tag length (40-70 chars)</span>
                        {wordForm.seoTitle.length >= 40 && wordForm.seoTitle.length <= 70 ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">{wordForm.seoTitle.length} ch</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meta description (100-160 chars)</span>
                        {wordForm.seoDescription.length >= 100 && wordForm.seoDescription.length <= 160 ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">{wordForm.seoDescription.length} ch</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ELI10 Metaphor filled</span>
                        {wordForm.eli10.length > 20 ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <span className="text-[9px] text-[#F59E0B] font-mono uppercase">Missing</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Safety Warnings annotated</span>
                        {wordForm.safetyNotes.length > 5 ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <span className="text-[9px] text-slate-500 font-mono uppercase">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time preview widget */}
                  <div className="rounded-2xl border border-white/5 bg-[#111217]/15 p-5 flex flex-col gap-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Social Share Preview
                    </span>
                    <div className="rounded-xl border border-white/5 bg-black/60 p-4 flex flex-col gap-2 text-left">
                      <span className="text-[10px] font-mono text-[#FF8A3D] font-bold tracking-widest uppercase">GENSPEAK GLOSSARY</span>
                      <h4 className="font-display font-bold text-sm text-white uppercase">{wordForm.term || "rizz"}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{wordForm.definition || "Definition context teaser..."}</p>
                      <div className="border-t border-white/5 pt-2 mt-1 flex items-center justify-between text-[9px] font-mono text-slate-600">
                        <span>PRONOUNCED: {wordForm.pronunciation || "/rɪz/"}</span>
                        <span>{wordForm.category.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Render other forms in pending/draft layout */}
            {activeContentType !== "word" && (
              <div className="bg-[#111217]/10 border border-white/5 p-8 rounded-2xl text-center">
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h4 className="font-display font-bold text-sm text-white capitalize">{activeContentType} Editor ready</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mt-1">
                  Editorial CMS configuration mapping fields loaded. Form is ready for manual entries or batch importing.
                </p>
              </div>
            )}
          </section>
        )}

        {/* TAB 3: AUTO LINKING RECOMMENDER */}
        {activeTab === "linking" && (
          <section className="flex flex-col gap-6 max-w-2xl bg-[#111217]/10 border border-white/5 p-6 rounded-2xl">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-[#FF8A3D]" />
              Automatic Linking Recommender
            </h3>
            {activeLinkingWord ? (
              <div className="flex flex-col gap-6 mt-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs text-left">
                  <Check className="w-4 h-4" />
                  <span>Dictionary word <strong>{activeLinkingWord.term}</strong> published successfully! Link recommendations computed below:</span>
                </div>

                <div className="flex flex-col gap-4 text-xs text-[#9EA3B0] font-sans text-left">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Recommended Related Words</span>
                    <div className="flex gap-2 flex-wrap">
                      {linkingRecommendations?.words.map((w, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-white font-mono">{w}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Recommended Guides Linkages</span>
                    <div className="flex gap-2 flex-wrap">
                      {linkingRecommendations?.guides.map((g, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-white font-mono">{g}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Recommended Collection Decks</span>
                    <div className="flex gap-2 flex-wrap">
                      {linkingRecommendations?.collections.map((c, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-white font-mono">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert("Internal relational database references mapped successfully!");
                    setActiveLinkingWord(null);
                    setActiveTab("dashboard");
                  }}
                  className="px-6 py-3 rounded-full bg-white/[0.03] border border-white/5 hover:border-white/10 font-mono font-bold text-[10px] tracking-wider uppercase text-white cursor-pointer mt-4"
                >
                  Confirm Linked Relationships
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mt-2 text-left">
                No active published terms. Complete a dictionary entry in the Creator Studio tab to evaluate automatic links.
              </p>
            )}
          </section>
        )}

        {/* TAB 4: BATCH IMPORTER */}
        {activeTab === "importer" && (
          <section className="flex flex-col gap-6 max-w-3xl">
            <div className="flex flex-col gap-2 bg-[#111217]/10 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-primary-pink" />
                Launch Content Importer (JSON / CSV formats)
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1 text-left">
                Batch import slang lists directly. Paste your compiled JSON array template or CSV lines directly in the text box below to initialize dynamic database insertions.
              </p>

              {importStatus === "success" && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs mt-4 text-left">
                  <Check className="w-4 h-4" />
                  <span>Batch array imported successfully! SQLite database index is now synchronized.</span>
                </div>
              )}

              {importStatus === "error" && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs mt-4 text-left">
                  <X className="w-4 h-4" />
                  <span>Import failed. Please check your data format layouts and templates headers.</span>
                </div>
              )}

              <form onSubmit={handleBatchImport} className="flex flex-col gap-4 mt-4 text-left">
                <textarea
                  rows={8}
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder={`JSON FORMAT:
[
  {
    "term": "rizz",
    "definition": "Charisma.",
    "category": "Slang"
  }
]

OR CSV FORMAT:
term,definition,category
rizz,Charisma,Slang`}
                  className="w-full bg-black/45 border border-white/5 p-4 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/40 font-mono resize-none"
                />
                <button
                  type="submit"
                  className="w-fit flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FF8A3D] text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#FF8A3D]/90 active:scale-95 cursor-pointer mt-2"
                >
                  <span>Execute Batch Import</span>
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </section>
        )}

        {/* TAB 5: AUDIT REVISIONS */}
        {activeTab === "revisions" && (
          <section className="flex flex-col gap-6 max-w-4xl text-left">
            <div className="rounded-2xl border border-white/5 bg-[#111217]/15 p-6 flex flex-col gap-6">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Revision Audit Logs
              </h3>
              <div className="flex flex-col gap-4 text-xs font-sans text-slate-300">
                {revisionHistory.map((log) => (
                  <div key={log.id} className="flex flex-col gap-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                      <span className="text-[#FF8A3D] font-bold">{log.action}</span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-sm font-display font-bold text-white mt-1">{log.details}</p>
                    <span className="text-[10px] text-slate-500 font-mono">By contributor: {log.user}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
