"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ open, setOpen, openSearch }), [open, openSearch]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used inside <SearchProvider>");
  return context;
}
