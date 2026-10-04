import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Counter } from "@/components/site/Counter";
import { asStats, asTimeline, villageQuery } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Village Profile & History — Govindapoor" },
      {
        name: "description",
        content:
          "History, geography, population, culture, landmarks, education, healthcare and agriculture of Govindapoor village.",
      },
      { property: "og:title", content: "Village Profile & History — Govindapoor" },
      { property: "og:description", content: "Everything about Govindapoor village at a glance." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: village } = useQuery(villageQuery);
  const stats = asStats(village?.stats);
  const timeline = asTimeline(village?.timeline);

  const blocks = [
    { title: "History", body: village?.history },
    { title: "Geography", body: village?.geography },
    { title: "Culture & traditions", body: village?.culture },
    { title: "Landmarks", body: village?.landmarks },
    { title: "Education", body: village?.education },
    { title: "Healthcare", body: village?.healthcare },
    { title: "Agriculture", body: village?.agriculture },
  ].filter((b) => b.body);

  return (
    <PageShell>
      <PageHero
        eyebrow="Village profile"
        title={`About ${village?.name ?? "Govindapoor"}`}
        description={village?.slogan ?? undefined}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 50} className="bg-surface p-6">
              <p className="font-display text-2xl font-semibold">
                <Counter value={s.value} />
              </p>
              <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 50} className="bg-surface rounded-lg border p-6">
              <h2 className="text-lg font-semibold">{b.title}</h2>
              <div className="gold-rule mt-3 w-16" />
              <p className="text-muted-foreground mt-4 text-sm whitespace-pre-line">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {timeline.length > 0 ? (
        <section className="bg-surface-2 border-border border-y">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <SectionHeading eyebrow="Milestones" title="Village timeline" />
            <ol className="border-border mt-10 space-y-6 border-l pl-6">
              {timeline.map((t, i) => (
                <Reveal key={`${t.year}-${i}`} delay={i * 60} className="relative">
                  <span className="bg-gold absolute top-2 -left-[31px] h-2.5 w-2.5 rounded-full ring-4 ring-[var(--surface-2)]" />
                  <p className="text-gold font-display text-sm font-semibold">{t.year}</p>
                  <p className="mt-1 text-sm">{t.event}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Location" title="Find the village" />
        <Reveal className="mt-8 overflow-hidden rounded-lg border">
          <iframe
            title="Govindapoor village location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent((village?.name ?? "Govindapoor") + " village")}&z=13&output=embed`}
            className="h-96 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
        {village?.map_url ? (
          <Reveal className="mt-4">
            <a
              className="text-primary text-sm font-medium underline-offset-4 hover:underline"
              href={village.map_url}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open exact location in Google Maps
            </a>
          </Reveal>
        ) : null}
      </section>
    </PageShell>
  );
}
