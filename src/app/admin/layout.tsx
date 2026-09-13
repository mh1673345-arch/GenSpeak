import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Studio",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
