import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useI18n } from "@/lib/i18n";
import { translateTexts } from "@/lib/translate.functions";

const originals = new Map<Text, string>();
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);

function translatable(node: Text) {
  const text = node.nodeValue ?? "";
  if (text.trim().length < 2) return false;
  if (!/\p{L}{2,}/u.test(text)) return false;
  let el = node.parentElement;
  while (el) {
    if (SKIP.has(el.tagName) || el.hasAttribute("data-no-translate")) return false;
    el = el.parentElement;
  }
  return true;
}

function collect(): Text[] {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const out: Text[] = [];
  let n = walker.nextNode();
  while (n) {
    const node = n as Text;
    if (translatable(node)) out.push(node);
    n = walker.nextNode();
  }
  return out;
}

function loadCache(lang: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(`gp-tr-${lang}`) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}
function saveCache(lang: string, cache: Record<string, string>) {
  try {
    localStorage.setItem(`gp-tr-${lang}`, JSON.stringify(cache));
  } catch {
    /* quota */
  }
}

export function AutoTranslate() {
  const { lang } = useI18n();
  const translate = useServerFn(translateTexts);

  useEffect(() => {
    if (lang === "en") {
      originals.forEach((value, node) => {
        if (node.isConnected) node.nodeValue = value;
      });
      originals.clear();
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cache = loadCache(lang);

    const run = async () => {
      const nodes = collect();
      const pending: { node: Text; source: string }[] = [];

      for (const node of nodes) {
        const source = (originals.get(node) ?? node.nodeValue ?? "").trim();
        if (!source) continue;
        if (!originals.has(node)) originals.set(node, node.nodeValue ?? "");
        const hit = cache[source];
        if (hit) {
          if (node.nodeValue !== hit) node.nodeValue = hit;
        } else {
          pending.push({ node, source });
        }
      }

      const unique = Array.from(new Set(pending.map((p) => p.source)));
      for (let i = 0; i < unique.length; i += 50) {
        const batch = unique.slice(i, i + 50);
        try {
          const result = await translate({ data: { lang: lang as "te" | "hi", texts: batch } });
          if (cancelled) return;
          batch.forEach((source, idx) => {
            const value = result[idx];
            if (value) cache[source] = value;
          });
          saveCache(lang, cache);
          for (const p of pending) {
            const value = cache[p.source];
            if (value && p.node.isConnected) p.node.nodeValue = value;
          }
        } catch {
          return;
        }
      }
    };

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void run(), 400);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [lang, translate]);

  return null;
}
