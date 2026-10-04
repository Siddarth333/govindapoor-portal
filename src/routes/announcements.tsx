import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Pin, Search } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { FileLink } from "@/components/site/FileLink";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { announcementsQuery } from "@/lib/queries";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements & Notices — Govindapoor Gram Panchayat" },
      {
        name: "description",
        content:
          "Latest public notices, emergency alerts, scheme registrations and government announcements for Govindapoor village.",
      },
      { property: "og:title", content: "Announcements & Notices — Govindapoor" },
      { property: "og:description", content: "Public notices and alerts from the Gram Panchayat." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data = [] } = useQuery(announcementsQuery);
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      data.filter((a) =>
        `${a.title} ${a.body} ${a.category} ${a.published_on}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [data, q],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Notice board"
        title="Announcements & public notices"
        description="Emergency alerts, government announcements, scheme registrations and application deadlines."
      />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search announcements by title, category or date"
            className="pl-9"
          />
        </div>
        <div className="mt-8 space-y-4">
          {list.map((a, i) => (
            <Reveal key={a.id} delay={i * 50}>
              <article className="bg-surface rounded-lg border p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={a.urgent ? "destructive" : "secondary"}>
                    {a.urgent ? <AlertTriangle className="mr-1 h-3 w-3" /> : null}
                    {a.category}
                  </Badge>
                  {a.pinned ? (
                    <Badge variant="outline">
                      <Pin className="mr-1 h-3 w-3" /> Pinned
                    </Badge>
                  ) : null}
                  <span className="text-muted-foreground ml-auto text-xs">
                    {new Date(a.published_on).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{a.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line">{a.body}</p>
                <div className="mt-4">
                  <FileLink path={a.file_url} label={a.file_name} />
                </div>
              </article>
            </Reveal>
          ))}
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">No announcements found.</p>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
