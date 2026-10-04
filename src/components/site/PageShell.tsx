import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { Reveal } from "./Reveal";
import { AutoTranslate } from "./AutoTranslate";

export function PageShell({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ScrollProgress />
      <AutoTranslate />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string | undefined;
}) {
  return (
    <section className="hero-surface relative overflow-hidden">
      <div className="grid-veil pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-base opacity-80">{description}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
