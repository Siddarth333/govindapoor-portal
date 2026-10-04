import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { StoredImage } from "@/components/site/StoredImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { villageQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Citizen Feedback — Govindapoor Gram Panchayat" },
      {
        name: "description",
        content:
          "Contact the Sarpanch and Panchayat office of Govindapoor, view office hours, and submit suggestions or report village issues.",
      },
      { property: "og:title", content: "Contact & Citizen Feedback — Govindapoor" },
      { property: "og:description", content: "Reach the Panchayat office or share feedback." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: village } = useQuery(villageQuery);
  const [form, setForm] = useState({ name: "", contact: "", kind: "Suggestion", message: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.message.trim().length < 5) {
      toast.error("Please enter your name and a short message.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("feedback").insert({
      name: form.name.trim().slice(0, 100),
      contact: form.contact.trim().slice(0, 120) || null,
      kind: form.kind,
      message: form.message.trim().slice(0, 2000),
    });
    setBusy(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    toast.success("Thank you — your message has reached the Panchayat office.");
    setForm({ name: "", contact: "", kind: "Suggestion", message: "" });
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Reach the Panchayat office"
        description="Office details, contact numbers and a direct channel to send suggestions or report issues."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="bg-surface rounded-lg border p-7">
            <div className="flex items-center gap-4">
              <StoredImage
                path={village?.sarpanch_photo}
                alt={village?.sarpanch_name ?? "Sarpanch"}
                className="ring-primary/30 h-16 w-16 rounded-full object-cover ring-2"
              />
              <div>
                <p className="font-semibold">{village?.sarpanch_name}</p>
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Sarpanch · {village?.name}
                </p>
              </div>
            </div>
            <ul className="mt-7 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>{village?.office_address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <a href={`tel:${village?.contact_phone}`}>{village?.contact_phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <a href={`mailto:${village?.contact_email}`}>{village?.contact_email}</a>
              </li>
              <li className="flex gap-3">
                <Clock className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>{village?.office_hours}</span>
              </li>
            </ul>
            {village?.map_url ? (
              <Button asChild variant="outline" className="mt-7">
                <a href={village.map_url} target="_blank" rel="noreferrer noopener">
                  <MapPin className="mr-1.5 h-4 w-4" /> Village location
                </a>
              </Button>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={submit} className="bg-surface rounded-lg border p-7">
            <h2 className="text-lg font-semibold">Citizen feedback</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Suggestions, issue reports and improvement recommendations.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={form.name}
                  maxLength={100}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="contact">Phone or email (optional)</Label>
                <Input
                  id="contact"
                  value={form.contact}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Suggestion", "Issue Report", "Improvement", "Other"].map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full">
                <Send className="mr-1.5 h-4 w-4" /> {busy ? "Sending…" : "Send to Panchayat"}
              </Button>
            </div>
          </form>
        </Reveal>
      </section>
    </PageShell>
  );
}
