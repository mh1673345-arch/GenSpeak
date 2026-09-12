import { ImageResponse } from "next/og";

import { getStats } from "@/lib/dictionary";

export const alt = "GenSpeak - the internet culture dictionary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const stats = getStats();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09080d",
          color: "#f5f3f7",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f5f3f7",
              color: "#09080d",
              borderRadius: 10,
              fontSize: 28,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 30, letterSpacing: -0.5 }}>GenSpeak</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.02, letterSpacing: -2 }}>
            The dictionary for
          </div>
          <div style={{ fontSize: 78, lineHeight: 1.02, letterSpacing: -2, color: "#9b8cff" }}>
            how the internet talks
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 22, color: "#a29eb4" }}>
          <div style={{ display: "flex" }}>{stats.terms} entries</div>
          <div style={{ display: "flex" }}>{stats.categories} categories</div>
          <div style={{ display: "flex" }}>
            {stats.oldest} to {stats.newest}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
