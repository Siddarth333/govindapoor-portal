import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, Moon, Sun, ShieldCheck, Languages, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme";
import { useI18n, type Lang } from "@/lib/i18n";
import { villageQuery } from "@/lib/queries";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", key: "home" },
  { to: "/announcements", key: "announcements" },
  { to: "/events", key: "events" },
  { to: "/projects", key: "projects" },
  { to: "/meetings", key: "meetings" },
  { to: "/documents", key: "documents" },
  { to: "/gallery", key: "gallery" },
  { to: "/population", key: "population" },
  { to: "/links", key: "links" },
  { to: "/sarpanch-history", key: "sarpanchHistory" },
  { to: "/about", key: "about" },
  { to: "/contact", key: "contact" },
] as const;

const langs: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { data: village } = useQuery(villageQuery);
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="bg-primary text-primary-foreground grid h-10 w-10 shrink-0 place-items-center rounded-md">
            <Landmark className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="font-display block truncate text-base font-semibold">
              {village?.name ?? "Govindapoor"} Gram Panchayat
            </span>
            <span className="text-muted-foreground block truncate text-xs">
              Official Village Portal
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="mr-2 hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="text-muted-foreground hover:text-foreground data-[status=active]:text-foreground data-[status=active]:bg-secondary rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Change language">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langs.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={lang === l.code ? "font-semibold" : ""}
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to={isAdmin ? "/admin" : "/auth"}>
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              {isAdmin ? t("admin") : "Sarpanch Login"}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="hover:bg-secondary rounded-md px-3 py-2.5 text-sm font-medium"
                  >
                    {t(l.key)}
                  </Link>
                ))}
                <Link
                  to={isAdmin ? "/admin" : "/auth"}
                  onClick={() => setOpen(false)}
                  className="hover:bg-secondary rounded-md px-3 py-2.5 text-sm font-medium"
                >
                  {isAdmin ? t("admin") : "Sarpanch Login"}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
