import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { FileLink } from "@/components/site/FileLink";
import { meetingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Gram Sabha Meetings & Resolutions — Govindapoor" },
      {
        name: "description",
        content:
          "Gram Sabha meeting notices, agendas, minutes, attendance records, decisions taken and future action plans for Govindapoor village.",
      },
      { property: "og:title", content: "Gram Sabha Meetings & Resolutions — Govindapoor" },
      { property: "og:description", content: "Meeting notices, minutes and resolutions." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data = [] } = useQuery(meetingsQuery);
  return (
    <PageShell>
      <PageHero
        eyebrow="Gram Sabha"
        title="Meetings & resolutions"
        description="Notices, agendas, minutes, attendance, decisions taken and future action plans — published after every sitting."
      />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="space-y-5">
          {data.map((m, i) => (
            <Reveal key={m.id} delay={i * 60}>
              <article className="bg-surface rounded-lg border p-6">
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(m.meeting_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </span>
                  {m.attendance ? (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> {m.attendance}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-xl font-semibold">{m.title}</h2>
                {m.agenda ? (
                  <div className="mt-4">
                    <h3 className="text-xs tracking-widest uppercase opacity-70">Agenda</h3>
                    <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">
                      {m.agenda}
                    </p>
                  </div>
                ) : null}
                {m.minutes ? (
                  <div className="mt-4">
                    <h3 className="text-xs tracking-widest uppercase opacity-70">Minutes</h3>
                    <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">
                      {m.minutes}
                    </p>
                  </div>
                ) : null}
                {m.decisions ? (
                  <div className="border-primary/40 mt-4 border-l-2 pl-4">
                    <h3 className="text-xs tracking-widest uppercase opacity-70">
                      Decisions & action plan
                    </h3>
                    <p className="mt-1 text-sm whitespace-pre-line">{m.decisions}</p>
                  </div>
                ) : null}
                <div className="mt-5">
                  <FileLink path={m.file_url} label={m.file_name} />
                </div>
              </article>
            </Reveal>
          ))}
          {data.length === 0 ? (
            <p className="text-muted-foreground text-sm">No meeting records published yet.</p>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
