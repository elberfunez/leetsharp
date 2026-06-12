import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import csharp from "shiki/langs/csharp.mjs";
import oneDarkPro from "shiki/themes/one-dark-pro.mjs";

/** Fine-grained Shiki bundle: only the C# grammar and one theme ship to the
 *  browser. Heavyweight to initialize — share one instance app-wide. */
let instance: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
  if (!instance) {
    instance = createHighlighterCore({
      themes: [oneDarkPro],
      langs: [csharp],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return instance;
}

/** Highlight C# source, tagging each line with data-line="n" (1-based)
 *  so the code panel can spotlight the lines of the current step. */
export async function highlightCSharp(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: "csharp",
    theme: "one-dark-pro",
    transformers: [
      {
        line(node, line) {
          node.properties["data-line"] = String(line);
        },
      },
    ],
  });
}
