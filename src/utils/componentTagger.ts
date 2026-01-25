import type { Plugin } from "vite";

export function componentTagger(): Plugin {
  return {
    name: "component-tagger",
    apply: "serve", // dev only
    configResolved() {
      console.log("✅ ComponentTagger enabled (dev mode)");
    },
  };
}
