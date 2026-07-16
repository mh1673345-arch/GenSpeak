"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Copy, Check, Share2, Send, User, Cpu, Terminal,
  Plus, Trash2, StopCircle, MessageSquare, BookOpen, Bookmark
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
  
  // Citations mapping metadata
  citations?: {
    words: string[];
    guides: Array<{ title: string; slug: string }>;
    collections: Array<{ title: string; slug: string }>;
  };
  suggestedFollowUps?: string[];
}

interface SavedSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

// Global counter to prevent calling impure Date.now() in render scope closures
let messageIdCounter = 0;

export function Translator() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [audienceMode, setAudienceMode] = useState<"eli10" | "parents" | "professional" | "genz" | "summary" | "deep">("genz");
  const [currentSessionId, setCurrentSessionId] = useState<string>("session-default");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-welcome",
      sender: "ai",
      text: "Yo! I'm your GenSpeak Internet Culture Companion. Ask me to explain a slang term, translate a text conversation, or contextualize a meme. I search the GenSpeak database first to verify details.",
      suggestedFollowUps: [
        "What does rizz mean?",
        "Explain Gen Alpha humor.",
        "Translate: lowkey cooked but infinite aura 💀"
      ]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // References for mutable stream variables to comply with React 19 immutability guidelines
  const streamedResponseTextRef = useRef("");
  const citationJSONRef = useRef("");
  const inCitationBlockRef = useRef(false);

  // Auto-scroll on chat message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save session helper
  const saveSessionToBackend = async (session: SavedSession) => {
    if (!user) return;
    try {
      await fetch("/api/ai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: session.id,
          email: user.email,
          title: session.title,
          messages: session.messages
        })
      });
    } catch (err) {
      console.error("Failed to sync session with server:", err);
    }
  };

  // Load chat histories based on authentication profile
  useEffect(() => {
    if (user) {
      // Authenticated user: load history from SQLite database
      fetch(`/api/ai/conversations?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then((data: SavedSession[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setTimeout(() => {
              setSessions(data);
              // Default to latest session
              setCurrentSessionId(data[0].id);
              setMessages(data[0].messages);
            }, 0);
          } else {
            // Create a default session in the database
            const defaultSession: SavedSession = {
              id: "session-" + ++messageIdCounter,
              title: "Initial Chat Session",
              messages: [...messages],
              updatedAt: new Date().toISOString()
            };
            setTimeout(() => {
              setSessions([defaultSession]);
              setCurrentSessionId(defaultSession.id);
            }, 0);
            saveSessionToBackend(defaultSession);
          }
        })
        .catch(err => console.error("Database conversations fetch error:", err));
    } else {
      // Anonymous user: load history from localStorage
      const localData = localStorage.getItem("genspeak_anon_conversations");
      if (localData) {
        try {
          const parsed: SavedSession[] = JSON.parse(localData);
          if (parsed.length > 0) {
            setTimeout(() => {
              setSessions(parsed);
              setCurrentSessionId(parsed[0].id);
              setMessages(parsed[0].messages);
            }, 0);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user, messages]);

  // Sync current conversation messages with sessions array
  useEffect(() => {
    if (!currentSessionId) return;
    setTimeout(() => {
      setSessions(prev => 
        prev.map(s => s.id === currentSessionId ? { ...s, messages } : s)
      );
    }, 0);
  }, [messages, currentSessionId]);

  // Sync anonymous sessions array with localStorage
  useEffect(() => {
    if (!user && sessions.length > 0) {
      localStorage.setItem("genspeak_anon_conversations", JSON.stringify(sessions));
    }
  }, [sessions, user]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = () => {
    alert("Shareable link copied to clipboard!");
  };

  const handleCreateNewSession = () => {
    const newSessionId = "session-" + ++messageIdCounter;
    const newSession: SavedSession = {
      id: newSessionId,
      title: "New Chat " + (sessions.length + 1),
      messages: [
        {
          id: "m-welcome",
          sender: "ai",
          text: "Yo! Ask me anything. I search our verified dictionary database first before resolving replies.",
          suggestedFollowUps: [
            "What does gyatt mean?",
            "Is sigma positive or negative?",
            "Translate: bro is mewing in silence"
          ]
        }
      ],
      updatedAt: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setMessages(newSession.messages);

    if (user) {
      saveSessionToBackend(newSession);
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (filtered.length > 0) {
      setCurrentSessionId(filtered[0].id);
      setMessages(filtered[0].messages);
    } else {
      // Reset to fresh blank state
      setCurrentSessionId("session-default");
      setMessages([
        {
          id: "m-welcome",
          sender: "ai",
          text: "Ask me about internet slang. I speak brainrot, gaming, and parent-friendly translations.",
          suggestedFollowUps: ["Explain rizz.", "What is skibidi?"]
        }
      ]);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  const handleCancelStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setMessages(prev => 
        prev.map(m => m.isStreaming ? { ...m, isStreaming: false, text: m.text + " [Generation Aborted]" } : m)
      );
    }
  };

  // Chat request sender
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    setInputText("");
    setIsLoading(true);

    const userMsgId = "m-user-" + ++messageIdCounter;
    const aiMsgId = "m-ai-" + ++messageIdCounter;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: "user", text: textToSend }
    ];

    setMessages(updatedMessages);

    // Initial loading state skeleton
    setMessages(prev => [
      ...prev,
      { id: aiMsgId, sender: "ai", text: "Verifying GenSpeak Knowledge database context...", isStreaming: true }
    ]);

    abortControllerRef.current = new AbortController();

    // Reset stream refs
    streamedResponseTextRef.current = "";
    citationJSONRef.current = "";
    inCitationBlockRef.current = false;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          audienceMode,
          conversationId: currentSessionId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to initialize stream reader");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });

        // Check if we hit the citation block divider
        if (textChunk.includes("\n[CITATIONS]\n")) {
          const parts = textChunk.split("\n[CITATIONS]\n");
          streamedResponseTextRef.current += parts[0];
          citationJSONRef.current += parts[1];
          inCitationBlockRef.current = true;
        } else if (inCitationBlockRef.current) {
          citationJSONRef.current += textChunk;
        } else {
          streamedResponseTextRef.current += textChunk;
        }

        // Dynamically type answer on screen
        setMessages(prev => 
          prev.map(msg => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                text: streamedResponseTextRef.current || "Answering...",
                isStreaming: true
              };
            }
            return msg;
          })
        );
      }

      // Finish streaming, parse citation blocks
      let parsedCitations = undefined;
      if (citationJSONRef.current) {
        try {
          parsedCitations = JSON.parse(citationJSONRef.current.trim());
        } catch (e) {
          console.error("Citations parsing error:", e);
        }
      }

      // Update current session chat message list
      const finalAiMessage: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: streamedResponseTextRef.current,
        isStreaming: false,
        citations: parsedCitations,
        suggestedFollowUps: [
          `Where does "${textToSend.substring(0, 15)}" originate?`,
          `Give me examples of using "${textToSend.substring(0, 15)}".`
        ]
      };

      const finalMessages = [...updatedMessages, finalAiMessage];
      setMessages(finalMessages);
      setIsLoading(false);

      // Update session record
      setSessions(prev => 
        prev.map(s => {
          if (s.id === currentSessionId) {
            // Auto rename title if it was default
            const newTitle = s.title.startsWith("New Chat") ? textToSend.substring(0, 24) : s.title;
            const updatedSession = { ...s, title: newTitle, messages: finalMessages, updatedAt: new Date().toISOString() };
            if (user) {
              saveSessionToBackend(updatedSession);
            }
            return updatedSession;
          }
          return s;
        })
      );

    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj.name === "AbortError") {
        console.log("Request aborted");
        return;
      }
      console.error(err);
      setIsLoading(false);
      setMessages(prev => 
        prev.map(m => m.id === aiMsgId ? {
          ...m,
          text: "Engine encountered a connection timeout. Please verify network access.",
          isStreaming: false
        } : m)
      );
    }
  };

  return (
    <div className="flex bg-[#111217]/20 border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl min-h-[580px] max-w-5xl mx-auto items-stretch">
      
      {/* 1. Collapsible History Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 shrink-0 bg-black/40 border-r border-white/5 flex flex-col items-stretch p-4 text-left text-white">
          <button
            onClick={handleCreateNewSession}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mb-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-xs font-mono font-bold tracking-widest text-[#FF8A3D] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW DECODER CHAT</span>
          </button>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 no-scrollbar">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-1">PREVIOUS DECODER LOGS</span>
            {sessions.map(s => (
              <div
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  s.id === currentSessionId 
                    ? "bg-[#FF6A1A]/10 border border-[#FF6A1A]/20 text-[#FF8A3D] font-bold" 
                    : "bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs truncate">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* 2. Chat Workspace Board */}
      <div className="flex-1 flex flex-col bg-black/10 min-w-0">
        
        {/* Workspace Controls Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-colors cursor-pointer"
              title="Toggle History Sidebar"
            >
              <Terminal className="w-4 h-4 text-[#FF8A3D]" />
            </button>
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audience mode:</span>
          </div>

          <div className="flex gap-1.5 flex-wrap text-[9px] font-mono uppercase tracking-wider">
            {[
              { id: "genz", label: "Gen Z Mode ⚡" },
              { id: "parents", label: "Parents 👴" },
              { id: "eli10", label: "ELI10 🧸" },
              { id: "professional", label: "Teachers 💼" }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setAudienceMode(mode.id as "eli10" | "parents" | "professional" | "genz" | "summary" | "deep")}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  audienceMode === mode.id 
                    ? "bg-[#FF6A1A]/10 border-[#FF6A1A]/30 text-[#FF8A3D] font-bold" 
                    : "bg-transparent border-white/5 text-slate-500 hover:text-slate-350"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </header>

        {/* Message Feeds */}
        <div className="flex-1 min-h-[400px] max-h-[460px] overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar bg-[#050505]/40">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${
                  isUser ? "bg-primary-pink/10 text-primary-pink" : "bg-[#FF6A1A]/10 text-[#FF8A3D]"
                }`}>
                  {isUser ? <User className="w-4.5 h-4.5" /> : <Cpu className="w-4.5 h-4.5" />}
                </div>

                <div className="flex flex-col gap-3">
                  {/* Message Text Bubble */}
                  <div className={`p-4 rounded-2xl relative ${
                    isUser 
                      ? "bg-gradient-to-r from-primary-pink/10 to-primary-purple/5 border border-white/[0.08] text-white rounded-tr-sm text-right" 
                      : "bg-[#111217]/35 border border-white/[0.06] text-slate-300 rounded-tl-sm text-left"
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">{msg.text}</p>
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#FF8A3D] animate-pulse" />
                    )}
                  </div>

                  {/* Knowledge-First RAG Citations */}
                  {!isUser && msg.citations && !msg.isStreaming && (
                    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/5 bg-[#111217]/15 text-left animate-fade-in">
                      
                      <div className="flex flex-col gap-1 border-b border-white/[0.03] pb-2 text-[9px] font-mono uppercase text-slate-500">
                        <span>Verified Citations & References</span>
                      </div>

                      {msg.citations.words && msg.citations.words.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center text-[9px] font-mono">
                          <span className="text-slate-500 uppercase mr-1 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#FF8A3D]" />
                            LEXICON GLOSSARY:
                          </span>
                          {msg.citations.words.map((w, i) => (
                            <Link 
                              key={i} 
                              href={`/word/${w}`}
                              className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[#FF8A3D] hover:border-[#FF6A1A]/30 transition-colors font-bold lowercase"
                            >
                              {w}
                            </Link>
                          ))}
                        </div>
                      )}

                      {msg.citations.guides && msg.citations.guides.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center text-[9px] font-mono">
                          <span className="text-slate-500 uppercase mr-1 flex items-center gap-1">
                            <Bookmark className="w-3 h-3 text-[#FF8A3D]" />
                            GUIDEBOOKS:
                          </span>
                          {msg.citations.guides.map((g, i) => (
                            <Link 
                              key={i} 
                              href={`/guides/${g.slug}`}
                              className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-white hover:border-[#FF6A1A]/30 transition-colors"
                            >
                              {g.title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {msg.citations.collections && msg.citations.collections.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center text-[9px] font-mono">
                          <span className="text-slate-500 uppercase mr-1 flex items-center gap-1">
                            <Terminal className="w-3 h-3 text-[#FF8A3D]" />
                            CURATIONS:
                          </span>
                          {msg.citations.collections.map((c, i) => (
                            <Link 
                              key={i} 
                              href={`/collections/${c.slug}`}
                              className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-white hover:border-[#FF6A1A]/30 transition-colors"
                            >
                              {c.title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Utilities Bar */}
                      <div className="flex items-center gap-4.5 border-t border-white/[0.03] pt-3 text-[10px] font-mono text-slate-500">
                        <button 
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? "Copied" : "Copy Reference"}</span>
                        </button>
                        <button 
                          onClick={handleShare}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Link</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* Dynamic Suggested Follow-ups prompts */}
                  {msg.suggestedFollowUps && !msg.isStreaming && (
                    <div className="flex flex-col gap-2 mt-1 text-left animate-fade-in">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Suggested Queries:</span>
                      <div className="flex flex-col gap-1.5 items-start">
                        {msg.suggestedFollowUps.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-[10px] font-sans text-left text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#FF6A1A]/20 transition-all cursor-pointer"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-4.5 border-t border-white/5 bg-white/[0.01]">
          <div className="relative rounded-2xl border border-white/5 bg-black/40 p-1 flex items-center justify-between gap-3 focus-within:border-[#FF6A1A]/40 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              placeholder={`Ask about slangs (e.g. "What does rizz mean?")...`}
              className="flex-1 bg-transparent border-none text-white placeholder-slate-600 outline-none text-xs sm:text-sm px-3.5 py-3 h-11"
            />
            {isLoading ? (
              <button
                onClick={handleCancelStreaming}
                className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-500/90 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer shrink-0"
                title="Stop generation"
              >
                <StopCircle className="w-4.5 h-4.5" />
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-[#FF6A1A] hover:bg-[#FF6A1A]/95 text-white flex items-center justify-center shadow-lg disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </footer>

      </div>

    </div>
  );
}
