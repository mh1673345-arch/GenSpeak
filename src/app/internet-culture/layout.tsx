import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internet Culture",
};

export default function InternetCultureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
