import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { linksQuery } from "@/lib/queries";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Government Websites & Useful Apps — Govindapoor" },
      {
        name: "description",
        content:
          "Official government websites, scheme portals, helplines and mobile apps useful for citizens of Govindapoor village.",
      },
      { property: "og:title", content: "Government Websites & Useful Apps — Govindapoor" },
      { property: "og:description", content: "Citizen services, schemes and government apps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: links = [] } = useQuery(linksQuery);
  const groups = Array.from(new Set(links.map((l) => l.category)));

  return (
    <PageShell>
      <PageHero
        eyebrow="Citizen services"
        title="Government links & useful apps"
        description="Verified government portals, scheme websites and mobile applications for everyday citizen needs."
      />
      <section className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:px-6">
        {groups.map((g) => (
          <div key={g}>
            <SectionHeading eyebrow="Category" title={g} />
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {links
                .filter((l) => l.category === g)
                .map((l, i) => (
                  <Reveal key={l.id} delay={i * 60}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="bg-surface hover:border-primary/40 group block h-full rounded-lg border p-6 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold">{l.title}</h3>
                        <ExternalLink className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">{l.description}</p>
                      <Badge variant="secondary" className="mt-4">
                        {l.category}
                      </Badge>
                    </a>
                  </Reveal>
                ))}
            </div>
          </div>
        ))}
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No links published yet.</p>
        ) : null}
      </section>
    </PageShell>
  );
}
