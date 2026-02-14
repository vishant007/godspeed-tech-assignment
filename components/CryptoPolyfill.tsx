"use client";

import { useEffect } from "react";

/**
 * Polyfill for crypto.randomUUID() in older browsers
 * This component should be rendered at the root of the application
 */
export function CryptoPolyfill() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.crypto && !window.crypto.randomUUID) {
      // Polyfill crypto.randomUUID() using crypto.getRandomValues()
      window.crypto.randomUUID = function randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
        // UUIDv4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        // where y is one of 8, 9, A, or B
        return ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, (c) => {
          const num = parseInt(c, 10);
          return (
            num ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
          ).toString(16);
        }) as `${string}-${string}-${string}-${string}-${string}`;
      };
      console.log("[CryptoPolyfill] Added crypto.randomUUID() polyfill");
    }
  }, []);

  return null;
}
