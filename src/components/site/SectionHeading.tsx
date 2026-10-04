import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      {eyebrow ? (
        <p className="text-gold text-xs font-semibold tracking-[0.22em] uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description ? <p className="text-muted-foreground mt-3 text-base">{description}</p> : null}
      <div className="gold-rule mt-6 w-40" />
    </Reveal>
  );
}
