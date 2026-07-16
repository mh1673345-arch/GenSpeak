"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CustomCollection {
  id: string;
  title: string;
  words: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  streak: number;
  progress: Record<string, number>; // pathId -> stepIndex completed
  savedWords: string[];
  savedGuides: string[];
  savedCollections: string[];
  savedTopics: string[];
  customCollections: CustomCollection[];
  achievements: string[];
  recentActivity: Array<{ id: string; text: string; time: string }>;
  notifications: Array<{ id: string; text: string; read: boolean }>;
  xp?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (method: string, email: string) => void;
  logout: () => void;
  saveWord: (slug: string) => void;
  unsaveWord: (slug: string) => void;
  saveGuide: (slug: string) => void;
  unsaveGuide: (slug: string) => void;
  saveCollection: (slug: string) => void;
  unsaveCollection: (slug: string) => void;
  saveTopic: (slug: string) => void;
  unsaveTopic: (slug: string) => void;
  createCustomCollection: (title: string) => void;
  addWordToCustomCollection: (collId: string, wordSlug: string) => void;
  updateProgress: (pathId: string, stepIndex: number) => void;
  markNotificationRead: (id: string) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("genspeak_user");
      setTimeout(() => {
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const initialUser: UserProfile = {
            id: "usr-alex",
            name: "Alex Thorne",
            email: "alex@genspeak.io",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
            bio: "Hyper-online slang collector & amateur memeologist.",
            joinDate: "July 2026",
            streak: 5,
            progress: {
              "slang-basics": 2,
              "gaming-jargon": 0
            },
            savedWords: ["rizz", "skibidi", "gyatt"],
            savedGuides: ["complete-guide-to-gen-z-slang"],
            savedCollections: ["top-tiktok-slang"],
            savedTopics: ["gen-alpha"],
            customCollections: [
              { id: "c-myfavs", title: "My Ultimate Slang Deck", words: ["rizz", "delulu"] }
            ],
            achievements: ["first-save", "explorer"],
            recentActivity: [
              { id: "act-1", text: "Saved Gen Alpha category portal", time: "2 hours ago" },
              { id: "act-2", text: "Completed 'Slang 101' lesson", time: "1 day ago" },
              { id: "act-3", text: "Unlocked 'Internet Explorer' badge", time: "3 days ago" }
            ],
            notifications: [
              { id: "nt-1", text: "New guide: 'Understanding Brainrot' is trending!", read: false },
              { id: "nt-2", text: "Your daily learning streak is at 5 days. Keep going!", read: false }
            ],
            xp: 120
          };
          localStorage.setItem("genspeak_user", JSON.stringify(initialUser));
          setUser(initialUser);
        }
      }, 0);
    }
  }, []);

  const saveToStorage = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem("genspeak_user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("genspeak_user");
    }
  };

  const login = (method: string, email: string) => {
    const newUser: UserProfile = {
      id: `usr-${Math.floor(Math.random() * 1000)}`,
      name: email.split("@")[0],
      email: email,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=120&q=80`,
      bio: "Newly joined internet culture enthusiast.",
      joinDate: "July 2026",
      streak: 1,
      progress: {},
      savedWords: [],
      savedGuides: [],
      savedCollections: [],
      savedTopics: [],
      customCollections: [],
      achievements: [],
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Logged in via ${method}`, time: "Just now" }
      ],
      notifications: [
        { id: `nt-${Math.random()}`, text: "Welcome to GenSpeak! Explore categories to get started.", read: false }
      ],
      xp: 0
    };
    saveToStorage(newUser);
  };

  const logout = () => {
    saveToStorage(null);
  };

  const saveWord = (slug: string) => {
    if (!user) return;
    if (user.savedWords.includes(slug)) return;
    
    // Check if First Save achievement is unlocked
    const newAchievements = [...user.achievements];
    if (!newAchievements.includes("first-save")) {
      newAchievements.push("first-save");
    }

    const updated: UserProfile = {
      ...user,
      savedWords: [...user.savedWords, slug],
      achievements: newAchievements,
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Saved word "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const unsaveWord = (slug: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      savedWords: user.savedWords.filter(s => s !== slug),
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Removed word "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const saveGuide = (slug: string) => {
    if (!user) return;
    if (user.savedGuides.includes(slug)) return;
    const updated: UserProfile = {
      ...user,
      savedGuides: [...user.savedGuides, slug],
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Saved guide "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const unsaveGuide = (slug: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      savedGuides: user.savedGuides.filter(s => s !== slug),
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Removed guide "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const saveCollection = (slug: string) => {
    if (!user) return;
    if (user.savedCollections.includes(slug)) return;
    const updated: UserProfile = {
      ...user,
      savedCollections: [...user.savedCollections, slug],
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Saved collection "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const unsaveCollection = (slug: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      savedCollections: user.savedCollections.filter(s => s !== slug),
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Removed collection "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const saveTopic = (slug: string) => {
    if (!user) return;
    if (user.savedTopics.includes(slug)) return;
    const updated: UserProfile = {
      ...user,
      savedTopics: [...user.savedTopics, slug],
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Saved topic "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const unsaveTopic = (slug: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      savedTopics: user.savedTopics.filter(s => s !== slug),
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Removed topic "${slug}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const createCustomCollection = (title: string) => {
    if (!user) return;
    const newColl: CustomCollection = {
      id: `c-${Math.floor(Math.random() * 10000)}`,
      title,
      words: []
    };
    const updated: UserProfile = {
      ...user,
      customCollections: [...user.customCollections, newColl],
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Created collection "${title}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const addWordToCustomCollection = (collId: string, wordSlug: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      customCollections: user.customCollections.map((c) => {
        if (c.id === collId && !c.words.includes(wordSlug)) {
          return { ...c, words: [...c.words, wordSlug] };
        }
        return c;
      }),
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Added "${wordSlug}" to custom collection`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const updateProgress = (pathId: string, stepIndex: number) => {
    if (!user) return;
    const currentProgress = { ...user.progress };
    currentProgress[pathId] = Math.max(currentProgress[pathId] || 0, stepIndex);

    // If completed the path, unlock completed-guide achievement
    const newAchievements = [...user.achievements];
    if (stepIndex >= 2 && !newAchievements.includes("completed-guide")) {
      newAchievements.push("completed-guide");
    }

    const updated: UserProfile = {
      ...user,
      progress: currentProgress,
      achievements: newAchievements,
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Updated progress on path "${pathId}"`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const markNotificationRead = (id: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      notifications: user.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    };
    saveToStorage(updated);
  };
  const addXp = (amount: number) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      xp: (user.xp || 0) + amount,
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Rewarded +${amount} XP`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };

  const incrementStreak = () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      streak: user.streak + 1,
      recentActivity: [
        { id: `act-${Math.random()}`, text: `Daily interaction streak updated to ${user.streak + 1} days!`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    saveToStorage(updated);
  };
  return (
    <AuthContext.Provider 
      value={{
        user,
        login,
        logout,
        saveWord,
        unsaveWord,
        saveGuide,
        unsaveGuide,
        saveCollection,
        unsaveCollection,
        saveTopic,
        unsaveTopic,
        createCustomCollection,
        addWordToCustomCollection,
        updateProgress,
        markNotificationRead,
        addXp,
        incrementStreak
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
