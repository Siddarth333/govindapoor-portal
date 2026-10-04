import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { villageQuery } from "@/lib/queries";

export function Footer() {
  const { data: v } = useQuery(villageQuery);
  return (
    <footer className="hero-surface mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">{v?.name ?? "Govindapoor"} Gram Panchayat</h3>
          <p className="mt-3 max-w-sm text-sm opacity-80">
            {v?.slogan ?? "Transparent Governance. Shared Progress."}
          </p>
          <div className="gold-rule mt-6 w-24" />
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase opacity-70">Quick links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {(
              [
                { to: "/announcements", label: "Announcements" },
                { to: "/projects", label: "Development Projects" },
                { to: "/meetings", label: "Gram Sabha Records" },
                { to: "/documents", label: "Rules & Documents" },
                { to: "/gallery", label: "Gallery" },
              ] as const
            ).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="opacity-80 transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase opacity-70">
            Village office
          </h4>
          <ul className="mt-4 space-y-3 text-sm opacity-85">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {v?.office_address || "Gram Panchayat Office, Govindapoor"}
            </li>
            {v?.contact_phone ? (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                {v.contact_phone}
              </li>
            ) : null}
            {v?.contact_email ? (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                {v.contact_email}
              </li>
            ) : null}
            <li className="opacity-70">{v?.office_hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-border border-t py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {v?.name ?? "Govindapoor"} Gram Panchayat · Official village
        portal
      </div>
    </footer>
  );
}
