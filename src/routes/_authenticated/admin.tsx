/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { StoredImage } from "@/components/site/StoredImage";
import { CrudSection, type Field } from "@/components/admin/CrudSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import {
  DOCUMENT_CATEGORIES,
  LINK_CATEGORIES,
  linksQuery,
  pastSarpanchesQuery,
  populationQuery,
  EVENT_CATEGORIES,
  PROJECT_SECTIONS,
  announcementsQuery,
  asStats,
  asTimeline,
  documentsQuery,
  eventsQuery,
  feedbackQuery,
  galleryQuery,
  meetingsQuery,
  projectsQuery,
  villageQuery,
  type StatItem,
  type TimelineItem,
  type Village,
} from "@/lib/queries";

const populationFields: Field[] = [
  { name: "ward", label: "Ward", type: "text" },
  { name: "households", label: "Households", type: "number" },
  { name: "male", label: "Male", type: "number" },
  { name: "female", label: "Female", type: "number" },
  { name: "total", label: "Total population", type: "number" },
  { name: "voters", label: "Registered voters", type: "number" },
  { name: "notes", label: "Notes", type: "text" },
];

const linkFields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "category", label: "Category", type: "select", options: LINK_CATEGORIES },
  { name: "url", label: "Website / app link", type: "text" },
];

const pastSarpanchFields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "term_from", label: "Term from (year)", type: "text" },
  { name: "term_to", label: "Term to (year)", type: "text" },
  { name: "details", label: "Details", type: "textarea" },
  { name: "major_works", label: "Major works", type: "textarea" },
  { name: "photo_url", label: "Photo", type: "file", accept: "image/*" },
];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Govindapoor Gram Panchayat" },
      { name: "description", content: "Manage village announcements, events, projects and records." },
      { property: "og:title", content: "Admin Dashboard — Govindapoor" },
      { property: "og:description", content: "Panchayat content management." },
    ],
  }),
  component: Admin,
});

const announcementFields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "body", label: "Details", type: "textarea" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      "Public Notice",
      "Emergency Alert",
      "Government Announcement",
      "Scheme Registration",
      "Application Deadline",
    ],
  },
  { name: "published_on", label: "Published on", type: "date" },
  { name: "pinned", label: "Pin to top", type: "switch" },
  { name: "urgent", label: "Mark urgent", type: "switch" },
  { name: "file_url", label: "Attachment", type: "file", nameField: "file_name" },
];

const eventFields: Field[] = [
  { name: "title", label: "Event title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "category", label: "Category", type: "select", options: EVENT_CATEGORIES },
  { name: "event_date", label: "Date", type: "date" },
  { name: "event_time", label: "Time", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "map_url", label: "Google Maps link", type: "text" },
  { name: "image_url", label: "Photo", type: "file", accept: "image/*" },
  { name: "file_url", label: "Document", type: "file", nameField: "file_name" },
];

const projectFields: Field[] = [
  { name: "name", label: "Project name", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "section", label: "Section", type: "select", options: PROJECT_SECTIONS },
  { name: "category", label: "Category", type: "text" },
  { name: "budget", label: "Budget (₹)", type: "number" },
  { name: "spent", label: "Spent (₹)", type: "number" },
  { name: "progress", label: "Progress %", type: "number" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Planned", "In Progress", "Completed"],
  },
  { name: "completion_date", label: "Completion date", type: "date" },
  { name: "image_url", label: "Photo", type: "file", accept: "image/*" },
  { name: "file_url", label: "Report", type: "file" },
];

const documentFields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "category", label: "Category", type: "select", options: DOCUMENT_CATEGORIES },
  { name: "published_on", label: "Published on", type: "date" },
  { name: "file_url", label: "File (PDF)", type: "file", nameField: "file_name" },
];

const meetingFields: Field[] = [
  { name: "title", label: "Meeting title", type: "text" },
  { name: "meeting_date", label: "Date", type: "date" },
  { name: "agenda", label: "Agenda", type: "textarea" },
  { name: "minutes", label: "Minutes", type: "textarea" },
  { name: "decisions", label: "Decisions taken", type: "textarea" },
  { name: "action_plan", label: "Future action plan", type: "textarea" },
  { name: "attendance", label: "Attendance", type: "text" },
  { name: "file_url", label: "Document", type: "file", nameField: "file_name" },
];

const galleryFields: Field[] = [
  { name: "caption", label: "Caption", type: "text" },
  { name: "album", label: "Album", type: "text" },
  {
    name: "media_type",
    label: "Media type",
    type: "select",
    options: ["image", "video"],
  },
  { name: "media_url", label: "File", type: "file" },
];

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, user, loading } = useAuth();
  const { data: village } = useQuery(villageQuery);
  const { data: feedback = [] } = useQuery(feedbackQuery);
  const [form, setForm] = useState<Village | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (village && !form) setForm(village);
  }, [village, form]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function saveVillage() {
    if (!form) return;
    setSaving(true);
    const { id, updated_at, ...rest } = form as any;
    const { error } = await supabase.from("village_profile").update(rest).eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: villageQuery.queryKey });
    toast.success("Village profile updated");
  }

  async function changePhoto(file: File) {
    try {
      const path = await uploadFile(file, "profile");
      setForm((f) => (f ? { ...f, sarpanch_photo: path } : f));
      toast.success("Photo uploaded — remember to save");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    }
  }

  if (loading) {
    return <PageShell />;
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <section className="mx-auto max-w-lg px-4 py-28 text-center sm:px-6">
          <ShieldAlert className="text-destructive mx-auto h-8 w-8" />
          <h1 className="mt-4 text-2xl font-semibold">Administrator access required</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The account {user?.email} is signed in but not authorised to manage this portal.
          </p>
          <Button className="mt-6" variant="outline" onClick={signOut}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
        </section>
      </PageShell>
    );
  }

  const stats = asStats(form?.stats);
  const funds = asStats(form?.funds);
  const timeline = asTimeline(form?.timeline);

  const setStats = (key: "stats" | "funds", list: StatItem[]) =>
    setForm((f) => (f ? { ...f, [key]: list as any } : f));

  return (
    <PageShell>
      <PageHero
        eyebrow="Administration"
        title="Panchayat dashboard"
        description="Publish and edit every section of the village portal."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">Signed in as {user?.email}</p>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="flex h-auto flex-wrap justify-start">
            {[
              ["profile", "Village profile"],
              ["announcements", "Announcements"],
              ["events", "Events"],
              ["projects", "Projects"],
              ["documents", "Documents"],
              ["meetings", "Meetings"],
              ["gallery", "Gallery"],
              ["population", "Population"],
              ["links", "Useful links"],
              ["history", "Sarpanch history"],
              ["feedback", "Feedback"],
            ].map(([v, l]) => (
              <TabsTrigger key={v} value={v as string}>
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="mt-8">
            {form ? (
              <div className="space-y-6">
                <div className="bg-surface flex flex-wrap items-center gap-5 rounded-lg border p-6">
                  <StoredImage
                    path={form.sarpanch_photo}
                    alt={form.sarpanch_name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="min-w-56 flex-1">
                    <Label>Sarpanch name</Label>
                    <Input
                      className="mt-1.5"
                      value={form.sarpanch_name}
                      onChange={(e) => setForm({ ...form, sarpanch_name: e.target.value })}
                    />
                  </div>
                  <div className="min-w-56 flex-1">
                    <Label>Profile photo</Label>
                    <Input
                      className="mt-1.5"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void changePhoto(file);
                      }}
                    />
                  </div>
                </div>

                <div className="bg-surface grid gap-4 rounded-lg border p-6 md:grid-cols-2">
                  {(
                    [
                      ["name", "Village name"],
                      ["slogan", "Slogan"],
                      ["contact_phone", "Contact phone"],
                      ["contact_email", "Contact email"],
                      ["office_address", "Office address"],
                      ["office_hours", "Office hours"],
                      ["map_url", "Google Maps link"],
                      ["sarpanch_designation", "Sarpanch designation"],
                      ["sarpanch_term", "Sarpanch term"],
                      ["sarpanch_ward", "Sarpanch ward"],
                      ["sarpanch_phone", "Sarpanch phone"],
                      ["sarpanch_email", "Sarpanch email"],
                      ["sarpanch_education", "Sarpanch education"],
                      ["sarpanch_address", "Sarpanch address"],
                    ] as const
                  ).map(([k, label]) => (
                    <div key={k}>
                      <Label>{label}</Label>
                      <Input
                        className="mt-1.5"
                        value={(form as any)[k] ?? ""}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-surface grid gap-4 rounded-lg border p-6">
                  {(
                    [
                      ["welcome_message", "Welcome message"],
                      ["sarpanch_message", "Message from the Sarpanch"],
                      ["commitment_statement", "Commitment statement"],
                      ["history", "History"],
                      ["geography", "Geography"],
                      ["culture", "Culture & traditions"],
                      ["landmarks", "Landmarks"],
                      ["education", "Education"],
                      ["healthcare", "Healthcare"],
                      ["agriculture", "Agriculture"],
                    ] as const
                  ).map(([k, label]) => (
                    <div key={k}>
                      <Label>{label}</Label>
                      <Textarea
                        rows={3}
                        className="mt-1.5"
                        value={(form as any)[k] ?? ""}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                {(
                  [
                    ["stats", "Village statistics", stats],
                    ["funds", "Transparency / funds", funds],
                  ] as const
                ).map(([key, label, list]) => (
                  <div key={key} className="bg-surface rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{label}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStats(key, [...list, { label: "", value: "" }])}
                      >
                        Add row
                      </Button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {list.map((s, i) => (
                        <div key={i} className="flex flex-wrap gap-3">
                          <Input
                            className="min-w-40 flex-1"
                            placeholder="Label"
                            value={s.label}
                            onChange={(e) => {
                              const next = [...list];
                              next[i] = { ...s, label: e.target.value };
                              setStats(key, next);
                            }}
                          />
                          <Input
                            className="min-w-32 flex-1"
                            placeholder="Value"
                            value={s.value}
                            onChange={(e) => {
                              const next = [...list];
                              next[i] = { ...s, value: e.target.value };
                              setStats(key, next);
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setStats(key, list.filter((_, j) => j !== i))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="bg-surface rounded-lg border p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Village timeline</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setForm({
                          ...form,
                          timeline: [...timeline, { year: "", event: "" }] as any,
                        })
                      }
                    >
                      Add milestone
                    </Button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {timeline.map((t: TimelineItem, i: number) => (
                      <div key={i} className="flex flex-wrap gap-3">
                        <Input
                          className="w-28"
                          placeholder="Year"
                          value={t.year}
                          onChange={(e) => {
                            const next = [...timeline];
                            next[i] = { ...t, year: e.target.value };
                            setForm({ ...form, timeline: next as any });
                          }}
                        />
                        <Input
                          className="min-w-48 flex-1"
                          placeholder="Milestone"
                          value={t.event}
                          onChange={(e) => {
                            const next = [...timeline];
                            next[i] = { ...t, event: e.target.value };
                            setForm({ ...form, timeline: next as any });
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setForm({
                              ...form,
                              timeline: timeline.filter((_, j) => j !== i) as any,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={saveVillage} disabled={saving} size="lg">
                  {saving ? "Saving…" : "Save village profile"}
                </Button>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="announcements" className="mt-8">
            <CrudSection
              table="announcements"
              title="Announcements"
              description="Public notices, alerts and scheme registrations."
              fields={announcementFields}
              query={announcementsQuery as any}
              folder="announcements"
              primary={(r: any) => r.title}
              secondary={(r: any) => `${r.category} · ${r.published_on}`}
            />
          </TabsContent>
          <TabsContent value="events" className="mt-8">
            <CrudSection
              table="events"
              title="Events"
              description="Daily events with date, time, location, photos and documents."
              fields={eventFields}
              query={eventsQuery as any}
              folder="events"
              primary={(r: any) => r.title}
              secondary={(r: any) => `${r.category} · ${r.event_date}`}
            />
          </TabsContent>
          <TabsContent value="projects" className="mt-8">
            <CrudSection
              table="projects"
              title="Development projects"
              description="Budgets, progress and fund utilisation."
              fields={projectFields}
              query={projectsQuery as any}
              folder="projects"
              primary={(r: any) => r.name}
              secondary={(r: any) => `${r.section} · ${r.progress}% · ${r.status}`}
            />
          </TabsContent>
          <TabsContent value="documents" className="mt-8">
            <CrudSection
              table="documents"
              title="Documents, rules & policies"
              description="Downloadable PDFs and official records."
              fields={documentFields}
              query={documentsQuery as any}
              folder="documents"
              primary={(r: any) => r.title}
              secondary={(r: any) => `${r.category} · ${r.published_on}`}
            />
          </TabsContent>
          <TabsContent value="meetings" className="mt-8">
            <CrudSection
              table="meetings"
              title="Gram Sabha meetings"
              description="Notices, agendas, minutes and resolutions."
              fields={meetingFields}
              query={meetingsQuery as any}
              folder="meetings"
              primary={(r: any) => r.title}
              secondary={(r: any) => r.meeting_date}
            />
          </TabsContent>
          <TabsContent value="gallery" className="mt-8">
            <CrudSection
              table="gallery"
              title="Gallery"
              description="Photos and videos organised into albums."
              fields={galleryFields}
              query={galleryQuery as any}
              folder="gallery"
              primary={(r: any) => r.caption}
              secondary={(r: any) => `${r.album} · ${r.media_type}`}
            />
          </TabsContent>
          <TabsContent value="population" className="mt-8">
            <CrudSection
              table="population_records"
              title="Population records"
              description="Ward-wise households, population and voter details shown in the public table."
              fields={populationFields}
              query={populationQuery as any}
              folder="population"
              primary={(r: any) => r.ward}
              secondary={(r: any) => `${r.total} people · ${r.households} households`}
            />
          </TabsContent>
          <TabsContent value="links" className="mt-8">
            <CrudSection
              table="useful_links"
              title="Government links & apps"
              description="Official websites, scheme portals, helplines and mobile apps."
              fields={linkFields}
              query={linksQuery as any}
              folder="links"
              primary={(r: any) => r.title}
              secondary={(r: any) => r.category}
            />
          </TabsContent>
          <TabsContent value="history" className="mt-8">
            <CrudSection
              table="past_sarpanches"
              title="Sarpanch history"
              description="Previous Sarpanches with their term, details and major works."
              fields={pastSarpanchFields}
              query={pastSarpanchesQuery as any}
              folder="sarpanches"
              primary={(r: any) => r.name}
              secondary={(r: any) => `${r.term_from} - ${r.term_to}`}
            />
          </TabsContent>
          <TabsContent value="feedback" className="mt-8">
            <h2 className="text-xl font-semibold">Citizen feedback</h2>
            <div className="mt-6 divide-y rounded-lg border">
              {feedback.map((f: any) => (
                <div key={f.id} className="p-4">
                  <p className="text-muted-foreground text-xs">
                    {f.kind} · {new Date(f.created_at).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 font-medium">
                    {f.name} {f.contact ? `· ${f.contact}` : ""}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">{f.message}</p>
                </div>
              ))}
              {feedback.length === 0 ? (
                <p className="text-muted-foreground p-6 text-sm">No feedback received yet.</p>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </PageShell>
  );
}
