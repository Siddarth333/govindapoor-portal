import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  History,
  Link2,
  Megaphone,
  Quote,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Counter } from "@/components/site/Counter";
import { StoredImage } from "@/components/site/StoredImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  announcementsQuery,
  asStats,
  eventsQuery,
  projectsQuery,
  villageQuery,
} from "@/lib/queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Govindapoor Gram Panchayat — Official Village Portal" },
      {
        name: "description",
        content:
          "Announcements, development projects, Gram Sabha records and transparent fund reporting for Govindapoor village.",
      },
      { property: "og:title", content: "Govindapoor Gram Panchayat — Official Village Portal" },
      {
        property: "og:description",
        content: "Transparent governance and development updates for Govindapoor village.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { data: village } = useQuery(villageQuery);
  const { data: announcements = [] } = useQuery(announcementsQuery);
  const { data: events = [] } = useQuery(eventsQuery);
  const { data: projects = [] } = useQuery(projectsQuery);

  const stats = asStats(village?.stats);
  const funds = asStats(village?.funds);
  const upcoming = events.slice(0, 3);
  const featured = projects.slice(0, 3);

  return (
    <PageShell>
      {/* Hero */}
      <section className="hero-surface relative overflow-hidden">
        <div className="grid-veil pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="text-gold text-xs font-semibold tracking-[0.28em] uppercase">
              Gram Panchayat · Official Portal
            </p>
            <h1 className="mt-5 text-5xl leading-[1.05] font-semibold sm:text-6xl">
              {village?.name ?? "Govindapoor"}
            </h1>
            <p className="mt-4 max-w-xl text-lg opacity-85">
              {village?.slogan ?? "Transparent Governance. Shared Progress."}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed opacity-75">
              {village?.welcome_message}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="default">
                <Link to="/announcements">
                  {t("latest")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">{t("about")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/projects">{t("projects")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/events">{t("upcoming")}</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <figure className="elevate bg-surface rounded-xl border p-6">
              <Quote className="text-gold h-6 w-6" />
              <blockquote className="mt-4 text-sm leading-relaxed opacity-90">
                {village?.slogan}
              </blockquote>
              <figcaption className="border-border mt-6 border-t pt-5 text-xs tracking-widest uppercase opacity-70">
                Gram Panchayat · {village?.name}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Sarpanch details */}
      <section className="border-border bg-surface-2 border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Village leadership"
            title={t("sarpanchDetails")}
            description="Elected head of the Gram Panchayat and the office you can reach for any citizen service."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="bg-surface rounded-lg border p-7">
              <div className="flex flex-wrap items-center gap-5">
                <StoredImage
                  path={village?.sarpanch_photo}
                  alt={village?.sarpanch_name ?? "Sarpanch"}
                  className="ring-gold/50 h-24 w-24 rounded-full object-cover ring-2"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold">{village?.sarpanch_name}</h3>
                  <p className="text-gold text-xs tracking-widest uppercase">
                    {village?.sarpanch_designation} · {village?.name}
                  </p>
                </div>
              </div>
              <dl className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {(
                  [
                    ["Term", village?.sarpanch_term],
                    ["Ward", village?.sarpanch_ward],
                    ["Phone", village?.sarpanch_phone],
                    ["Email", village?.sarpanch_email],
                    ["Education", village?.sarpanch_education],
                    ["Office address", village?.sarpanch_address],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground text-xs tracking-widest uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium break-words">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120} className="bg-surface rounded-lg border p-7">
              <Quote className="text-gold h-6 w-6" />
              <h3 className="mt-4 text-lg font-semibold">{t("commitment")}</h3>
              <div className="gold-rule mt-4 w-24" />
              <p className="mt-5 text-sm leading-relaxed whitespace-pre-line">
                {village?.commitment_statement}
              </p>
              <p className="text-muted-foreground mt-6 text-sm leading-relaxed whitespace-pre-line">
                {village?.sarpanch_message}
              </p>
              <p className="mt-6 text-sm font-semibold">
                — {village?.sarpanch_name}, {village?.sarpanch_designation}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-border border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Village at a glance"
            title="Key metrics of our Gram Panchayat"
          />
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-3 lg:grid-cols-4">
            {stats.map((s, i) => {
              const isPopulation = /population|households/i.test(s.label);
              const body = (
                <>
                  <p className="font-display text-3xl font-semibold">
                    <Counter value={s.value} />
                  </p>
                  <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs tracking-widest uppercase">
                    {s.label}
                    {isPopulation ? <ArrowRight className="h-3.5 w-3.5" /> : null}
                  </p>
                </>
              );
              return (
                <Reveal
                  key={s.label}
                  delay={i * 60}
                  className="bg-surface hover:bg-surface-2 transition-colors"
                >
                  {isPopulation ? (
                    <Link to="/population" className="block p-6">
                      {body}
                    </Link>
                  ) : (
                    <div className="p-6">{body}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/population">
                {t("populationDetails")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Announcements */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Notice board"
            title={t("latest")}
            description="Public notices, alerts and government announcements published by the Sarpanch."
          />
          <Reveal>
            <Button asChild variant="ghost">
              <Link to="/announcements">
                {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {announcements.slice(0, 3).map((a, i) => (
            <Reveal key={a.id} delay={i * 80}>
              <article className="bg-surface hover:border-primary/40 h-full rounded-lg border p-6 transition-colors">
                <div className="flex items-center gap-2">
                  <Badge variant={a.urgent ? "destructive" : "secondary"}>{a.category}</Badge>
                  {a.pinned ? <Badge variant="outline">Pinned</Badge> : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{a.title}</h3>
                <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">{a.body}</p>
                <p className="text-muted-foreground mt-5 text-xs">
                  {new Date(a.published_on).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </article>
            </Reveal>
          ))}
          {announcements.length === 0 ? (
            <p className="text-muted-foreground text-sm">No announcements published yet.</p>
          ) : null}
        </div>
      </section>

      {/* Events */}
      <section className="bg-surface-2 border-border border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Daily events"
            title={t("upcoming")}
            description="Programs, camps and cultural activities happening across the village."
          />
          <div className="mt-10 space-y-4">
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={i * 80}>
                <Link
                  to="/events"
                  className="bg-surface hover:border-primary/40 group grid gap-4 rounded-lg border p-5 transition-colors sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="bg-primary text-primary-foreground grid h-16 w-16 shrink-0 place-items-center rounded-md">
                    <span className="text-xl font-semibold">
                      {new Date(e.event_date).getDate()}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase">
                      {new Date(e.event_date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gold text-xs tracking-widest uppercase">{e.category}</p>
                    <h3 className="mt-1 truncate text-lg font-semibold">{e.title}</h3>
                    <p className="text-muted-foreground truncate text-sm">
                      {[e.event_time, e.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events published yet.</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Development"
          title="Projects in progress"
          description="Every project with its budget, progress and expected completion — updated by the Panchayat."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="bg-surface h-full overflow-hidden rounded-lg border">
                {p.image_url ? (
                  <StoredImage path={p.image_url} alt={p.name} className="h-40 w-full object-cover" />
                ) : (
                  <div className="hero-surface h-40" />
                )}
                <div className="p-5">
                  <Badge variant="secondary">{p.section}</Badge>
                  <h3 className="mt-3 font-semibold">{p.name}</h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{p.description}</p>
                  <div className="mt-4">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>{p.status}</span>
                      <span>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="mt-2 h-1.5" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          {featured.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects published yet.</p>
          ) : null}
        </div>
      </section>

      {/* Transparency */}
      <section className="hero-surface relative overflow-hidden">
        <div className="grid-veil pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <Reveal>
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
              Accountability
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t("transparency")}</h2>
            <div className="gold-rule mt-6 w-40" />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {funds.map((f, i) => (
              <Reveal
                key={f.label}
                delay={i * 70}
                className="rounded-lg bg-surface border p-6"
              >
                <TrendingUp className="text-gold h-5 w-5" />
                <p className="font-display mt-4 text-2xl font-semibold">
                  <Counter value={f.value} />
                </p>
                <p className="mt-1 text-xs tracking-widest uppercase opacity-70">{f.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {(
            [
              {
                to: "/documents",
                icon: FileText,
                title: "Rules, policies & documents",
                text: "Download the village constitution, guidelines and official reports.",
              },
              {
                to: "/meetings",
                icon: Users,
                title: "Gram Sabha records",
                text: "Meeting notices, agendas, minutes, attendance and decisions taken.",
              },
              {
                to: "/contact",
                icon: Megaphone,
                title: "Share your feedback",
                text: "Submit suggestions or report an issue directly to the Panchayat.",
              },
              {
                to: "/links",
                icon: Link2,
                title: "Government links & useful apps",
                text: "Official portals, scheme websites and mobile apps useful for every citizen.",
              },
              {
                to: "/sarpanch-history",
                icon: History,
                title: "History of Sarpanches",
                text: "Past leaders with their term period, details and the major works they completed.",
              },
              {
                to: "/population",
                icon: Users,
                title: "Population records",
                text: "Ward-wise households, population and voter details in a public table.",
              },
            ] as const
          ).map((c, i) => (
            <Reveal key={c.to} delay={i * 80}>
              <Link
                to={c.to}
                className="bg-surface hover:border-primary/40 group block h-full rounded-lg border p-7 transition-colors"
              >
                <c.icon className="text-primary h-6 w-6" />
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{c.text}</p>
                <span className="text-primary mt-5 inline-flex items-center text-sm font-medium">
                  Open <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <Reveal className="text-muted-foreground flex items-center gap-2 text-xs">
          <CalendarDays className="h-4 w-4" /> Portal content is maintained by the Sarpanch and
          Panchayat office.
        </Reveal>
      </div>
    </PageShell>
  );
}
