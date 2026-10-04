import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Administrator Sign In — Govindapoor Gram Panchayat" },
      {
        name: "description",
        content: "Secure sign-in for the Sarpanch to manage announcements, events and records.",
      },
      { property: "og:title", content: "Administrator Sign In — Govindapoor" },
      { property: "og:description", content: "Panchayat administration login." },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. Check your email to confirm, then sign in.");
      setMode("signin");
    }
  }

  return (
    <PageShell>
      <section className="mx-auto flex max-w-md flex-col justify-center px-4 py-24 sm:px-6">
        <div className="bg-surface rounded-lg border p-8">
          <ShieldCheck className="text-primary h-7 w-7" />
          <h1 className="mt-4 text-2xl font-semibold">Administration sign in</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Restricted to the Sarpanch and authorised Panchayat staff.
          </p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create admin account"}
            </Button>
          </form>
          <button
            className="text-muted-foreground mt-5 text-xs underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "First time? Create the administrator account"
              : "Already registered? Sign in"}
          </button>
        </div>
      </section>
    </PageShell>
  );
}
