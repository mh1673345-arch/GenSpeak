import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decoder",
};

export default function DecoderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
