import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, TrendingUp } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StoredImage } from "@/components/site/StoredImage";
import { Counter } from "@/components/site/Counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PROJECT_SECTIONS, asStats, projectsQuery, villageQuery } from "@/lib/queries";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Development Projects & Transparency — Govindapoor" },
      {
        name: "description",
        content:
          "Rural development, community programs, empowerment and social service projects in Govindapoor with budgets, progress and fund utilisation.",
      },
      { property: "og:title", content: "Development Projects & Transparency — Govindapoor" },
      {
        property: "og:description",
        content: "Project budgets, progress tracking and fund utilisation reports.",
      },
    ],
  }),
  component: Page,
});

const inr = (n: number) =>
  n ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n) : "—";

function Page() {
  const { data = [] } = useQuery(projectsQuery);
  const { data: village } = useQuery(villageQuery);
  const [section, setSection] = useState<string>("All");
  const funds = asStats(village?.funds);

  const list = useMemo(
    () => data.filter((p) => section === "All" || p.section === section),
    [data, section],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Development"
        title="Projects & transparency dashboard"
        description="Rural development, community development, rural empowerment and social service initiatives — with budgets and live progress."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Funds" title="Fund utilisation" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {funds.map((f, i) => (
            <Reveal key={f.label} delay={i * 60} className="bg-surface rounded-lg border p-6">
              <IndianRupee className="text-primary h-5 w-5" />
              <p className="font-display mt-4 text-2xl font-semibold">
                <Counter value={f.value} />
              </p>
              <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
                {f.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {["All", ...PROJECT_SECTIONS].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={section === s ? "default" : "outline"}
              onClick={() => setSection(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <article className="bg-surface flex h-full flex-col overflow-hidden rounded-lg border">
                {p.image_url ? (
                  <StoredImage path={p.image_url} alt={p.name} className="h-44 w-full object-cover" />
                ) : (
                  <div className="hero-surface h-44" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{p.section}</Badge>
                    <Badge variant="outline">{p.status}</Badge>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold">{p.name}</h2>
                  <p className="text-muted-foreground mt-2 text-sm">{p.description}</p>
                  <dl className="text-muted-foreground mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="tracking-widest uppercase">Budget</dt>
                      <dd className="text-foreground mt-1 font-medium">{inr(p.budget)}</dd>
                    </div>
                    <div>
                      <dt className="tracking-widest uppercase">Completion</dt>
                      <dd className="text-foreground mt-1 font-medium">
                        {p.completion_date
                          ? new Date(p.completion_date).toLocaleDateString("en-IN", {
                              dateStyle: "medium",
                            })
                          : "—"}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-auto pt-5">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" /> Progress
                      </span>
                      <span>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="mt-2 h-1.5" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects in this section yet.</p>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
