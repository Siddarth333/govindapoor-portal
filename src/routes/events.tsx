import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin, Search } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { StoredImage } from "@/components/site/StoredImage";
import { FileLink } from "@/components/site/FileLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENT_CATEGORIES, eventsQuery } from "@/lib/queries";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Village Events & Programs — Govindapoor Gram Panchayat" },
      {
        name: "description",
        content:
          "Timeline of government programs, health camps, cultural celebrations and community events in Govindapoor village.",
      },
      { property: "og:title", content: "Village Events & Programs — Govindapoor" },
      { property: "og:description", content: "Event timeline with documents and locations." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data = [] } = useQuery(eventsQuery);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const list = useMemo(
    () =>
      data.filter(
        (e) =>
          (cat === "All" || e.category === cat) &&
          `${e.title} ${e.description} ${e.location ?? ""} ${e.event_date}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [data, q, cat],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Daily events"
        title="Event timeline"
        description="Every program published by the Panchayat with date, time, location, photos and documents."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...EVENT_CATEGORIES].map((c) => (
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
        </div>

        <div className="border-border relative mt-12 space-y-8 border-l pl-6">
          {list.map((e, i) => (
            <Reveal key={e.id} delay={i * 60}>
              <div className="relative">
                <span className="bg-gold absolute top-6 -left-[31px] h-2.5 w-2.5 rounded-full ring-4 ring-[var(--background)]" />
                <article className="bg-surface grid gap-5 rounded-lg border p-6 md:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="min-w-0">
                    <Badge variant="secondary">{e.category}</Badge>
                    <h2 className="mt-3 text-xl font-semibold">{e.title}</h2>
                    <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line">
                      {e.description}
                    </p>
                    <ul className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-xs">
                      <li className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(e.event_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </li>
                      {e.event_time ? (
                        <li className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {e.event_time}
                        </li>
                      ) : null}
                      {e.location ? (
                        <li className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {e.location}
                        </li>
                      ) : null}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <FileLink path={e.file_url} label={e.file_name} />
                      {e.map_url ? (
                        <Button asChild size="sm" variant="ghost">
                          <a href={e.map_url} target="_blank" rel="noreferrer noopener">
                            <MapPin className="mr-1.5 h-4 w-4" /> View on map
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  {e.image_url ? (
                    <StoredImage
                      path={e.image_url}
                      alt={e.title}
                      className="h-40 w-full rounded-md object-cover"
                    />
                  ) : null}
                </article>
              </div>
            </Reveal>
          ))}
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">No events found.</p>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
