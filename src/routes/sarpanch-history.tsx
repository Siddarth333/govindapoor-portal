import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { StoredImage } from "@/components/site/StoredImage";
import { Badge } from "@/components/ui/badge";
import { pastSarpanchesQuery } from "@/lib/queries";

export const Route = createFileRoute("/sarpanch-history")({
  head: () => ({
    meta: [
      { title: "Sarpanch History & Major Works — Govindapoor" },
      {
        name: "description",
        content:
          "List of previous Sarpanches of Govindapoor Gram Panchayat with their term period, details and major works completed.",
      },
      { property: "og:title", content: "Sarpanch History & Major Works — Govindapoor" },
      { property: "og:description", content: "Every Sarpanch, their term and their major works." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: rows = [] } = useQuery(pastSarpanchesQuery);

  return (
    <PageShell>
      <PageHero
        eyebrow="Leadership"
        title="Sarpanch history"
        description="Elected leaders of the Gram Panchayat, their term period and the works completed under them."
      />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <ol className="border-border space-y-8 border-l pl-6">
          {rows.map((s, i) => (
            <Reveal key={s.id} delay={i * 70} className="relative">
              <span className="bg-gold absolute top-6 -left-[31px] h-2.5 w-2.5 rounded-full ring-4 ring-[var(--background)]" />
              <article className="bg-surface rounded-lg border p-6">
                <div className="flex flex-wrap items-center gap-4">
                  {s.photo_url ? (
                    <StoredImage
                      path={s.photo_url}
                      alt={s.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{s.name}</h2>
                    <Badge variant="secondary" className="mt-1">
                      {s.term_from} to {s.term_to}
                    </Badge>
                  </div>
                </div>
                {s.details ? (
                  <p className="text-muted-foreground mt-4 text-sm whitespace-pre-line">
                    {s.details}
                  </p>
                ) : null}
                {s.major_works ? (
                  <>
                    <div className="gold-rule mt-5 w-24" />
                    <h3 className="text-muted-foreground mt-4 text-xs tracking-widest uppercase">
                      Major works
                    </h3>
                    <p className="mt-2 text-sm whitespace-pre-line">{s.major_works}</p>
                  </>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ol>
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No records published yet.</p>
        ) : null}
      </section>
    </PageShell>
  );
}
