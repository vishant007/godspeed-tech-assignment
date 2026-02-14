"use client";

import { createElement, useEffect, useState, useCallback, useMemo } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmbeddedAgentProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function EmbeddedAgent({ isOpen, onToggle }: EmbeddedAgentProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    import("@mcp-b/embedded-agent/web-component")
      .then(() => setReady(true))
      .catch((err) => {
        console.error("Failed to load embedded agent:", err);
        setError(err);
      });
  }, []);

  useEffect(() => {
    if (!isOpen || !ready) return;

    const handleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const agentElement = document.querySelector('webmcp-agent');
      if (agentElement) {
        const rect = agentElement.getBoundingClientRect();
        const clickX = mouseEvent.clientX;
        const clickY = mouseEvent.clientY;

        if (clickX > rect.right - 100 && clickY < rect.top + 100) {
          onToggle(false);
        }
      }
    };

    const sidebar = document.querySelector('.webmcp-sidebar');
    if (sidebar) {
      sidebar.addEventListener('click', handleClick);
      return () => {
        sidebar.removeEventListener('click', handleClick);
      };
    }
  }, [isOpen, ready, onToggle]);

  const devMode = useMemo(
    () =>
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
        ? JSON.stringify({
            anthropicApiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
          })
        : undefined,
    []
  );

  const handleOpen = useCallback(() => onToggle(true), [onToggle]);
  const handleClose = useCallback(() => onToggle(false), [onToggle]);

  const webMCPAgent = useMemo(
    () =>
      createElement("webmcp-agent", {
        "dev-mode": devMode,
        "enable-debug-tools": "false",
        style: { height: "100%", width: "100%" },
        onClose: handleClose,
      }),
    [devMode, handleClose]
  );

  const mobileWebMCPAgent = useMemo(
    () =>
      createElement("webmcp-agent", {
        "dev-mode": devMode,
        "enable-debug-tools": "false",
      }),
    [devMode]
  );

  if (error) {
    return (
      <div className="fixed bottom-6 right-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm max-w-xs">
        Failed to load AI Assistant
      </div>
    );
  }

  if (!ready) return null;

  return (
    <>
      <div className="hidden md:block">
        {!isOpen && (
          <Button
            onClick={handleOpen}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
            size="icon"
            aria-label="Open AI Assistant"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleClose}
            aria-label="Close sidebar backdrop"
            title="Click to close sidebar"
          />
        )}

        {isOpen && (
          <div className="webmcp-sidebar fixed inset-y-0 right-0 w-[30vw] bg-background border-l border-border shadow-2xl z-50 flex flex-col">
            <div className="flex-1 overflow-hidden">{webMCPAgent}</div>
          </div>
        )}
      </div>

      <div className="md:hidden">{mobileWebMCPAgent}</div>
    </>
  );
}
