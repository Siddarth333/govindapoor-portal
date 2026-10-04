import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Search } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { FileLink } from "@/components/site/FileLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DOCUMENT_CATEGORIES, documentsQuery } from "@/lib/queries";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Rules, Policies & Documents — Govindapoor Gram Panchayat" },
      {
        name: "description",
        content:
          "Village constitution, community rules, public guidelines, government regulations and downloadable official documents of Govindapoor.",
      },
      { property: "og:title", content: "Rules, Policies & Documents — Govindapoor" },
      { property: "og:description", content: "Downloadable village rules, policies and reports." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data = [] } = useQuery(documentsQuery);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const list = useMemo(
    () =>
      data.filter(
        (d) =>
          (cat === "All" || d.category === cat) &&
          `${d.title} ${d.description ?? ""}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [data, q, cat],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Governance"
        title="Rules, policies & official documents"
        description="The village constitution, community rules, citizen responsibilities and every official record — free to download."
      />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents"
            className="pl-9"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", ...DOCUMENT_CATEGORIES].map((c) => (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              onClick={() => setCat(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          {list.map((d, i) => (
            <Reveal key={d.id} delay={i * 45}>
              <article className="bg-surface grid gap-4 rounded-lg border p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                <div className="bg-secondary text-secondary-foreground grid h-11 w-11 shrink-0 place-items-center rounded-md">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <Badge variant="secondary">{d.category}</Badge>
                  <h2 className="mt-2 font-semibold">{d.title}</h2>
                  {d.description ? (
                    <p className="text-muted-foreground mt-1 text-sm">{d.description}</p>
                  ) : null}
                </div>
                <FileLink path={d.file_url} label={d.file_name} />
              </article>
            </Reveal>
          ))}
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">No documents found.</p>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
