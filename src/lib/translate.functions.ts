import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  lang: z.enum(["te", "hi"]),
  texts: z.array(z.string()).max(200),
});

const LANG_NAME = { te: "Telugu", hi: "Hindi" } as const;

export const translateTexts = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }): Promise<string[]> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey || data.texts.length === 0) return data.texts;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content:
              `You translate website text for an Indian Gram Panchayat portal into ${LANG_NAME[data.lang]}. ` +
              `You receive a JSON array of strings. Return ONLY a JSON array of the same length, ` +
              `each element the translation of the matching input. Keep numbers, dates, currency, ` +
              `URLs, emails and proper nouns intact. Keep translations short and natural.`,
          },
          { role: "user", content: JSON.stringify(data.texts) },
        ],
      }),
    });

    if (!res.ok) return data.texts;
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\[[\s\S]*\]/);
    if (!match) return data.texts;
    try {
      const parsed = JSON.parse(match[0]) as unknown;
      if (!Array.isArray(parsed) || parsed.length !== data.texts.length) return data.texts;
      return parsed.map((v, i) => (typeof v === "string" && v.trim() ? v : data.texts[i]!));
    } catch {
      return data.texts;
    }
  });
