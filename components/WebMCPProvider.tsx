"use client";

import "@mcp-b/global";
import { useState } from "react";
import { CryptoPolyfill } from "@/components/CryptoPolyfill";
import { EmbeddedAgent } from "@/components/EmbeddedAgent";

export function WebMCPProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <CryptoPolyfill />

      <div className="flex min-h-screen">
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "md:max-w-[70vw]" : "w-full"
          }`}
        >
          {children}
        </div>

        <EmbeddedAgent isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      </div>
    </>
  );
}
