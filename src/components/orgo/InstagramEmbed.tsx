"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function loadAndProcess() {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return () => {};
  }
  if (document.querySelector("script[data-orgo-instgrm]")) {
    const tick = window.setInterval(() => {
      if (window.instgrm) {
        window.clearInterval(tick);
        window.instgrm.Embeds.process();
      }
    }, 200);
    return () => window.clearInterval(tick);
  }
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.dataset.orgoInstgrm = "1";
  script.onload = () => window.instgrm?.Embeds.process();
  document.head.appendChild(script);
  return () => {
    document.head.removeChild(script);
  };
}

export function InstagramEmbed({ permalink }: { permalink: string }) {
  useEffect(loadAndProcess, [permalink]);

  return (
    <div className="instagram-embed-wrap flex h-full w-full items-center justify-center bg-white">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: "0",
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5)",
          display: "block",
          lineHeight: "0",
          margin: "0",
          maxWidth: "540px",
          minWidth: "326px",
          padding: "0",
          width: "100%",
        }}
      >
        <a
          href={permalink}
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#FFFFFF",
            lineHeight: "0",
            padding: "0 0 0 0",
            textAlign: "center",
            textDecoration: "none",
            width: "100%",
          }}
        >
          <span className="instagram-fallback flex items-center justify-center gap-2 bg-gradient-to-br from-primary via-primary to-primary/80 px-6 py-10 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" role="img" aria-label="Instagram">
              <rect width="24" height="24" rx="6" fill="#fff" />
              <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.1 14.9c-.2 1.7-.9 2.4-2.6 2.6-1.5.2-4.5.2-5.9 0-1.7-.2-2.4-.9-2.6-2.6-.2-1.5-.2-4.4 0-5.9.2-1.7.9-2.4 2.6-2.6 1.5-.2 4.4-.2 5.9 0 1.7.2 2.4.9 2.6 2.6.2 1.4.2 4.4 0 5.9z"
                fill="#0095F6"
              />
            </svg>
            <span>
              <strong className="font-display text-xl text-white">Watch on Instagram</strong>
            </span>
          </span>
        </a>
      </blockquote>
    </div>
  );
}