import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, X } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { StoredImage } from "@/components/site/StoredImage";
import { Button } from "@/components/ui/button";
import { galleryQuery, type GalleryItem } from "@/lib/queries";
import { useStoredUrl } from "@/hooks/useStoredUrl";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Village Gallery — Govindapoor Gram Panchayat" },
      {
        name: "description",
        content:
          "Photos and videos of festivals, development projects, community activities and infrastructure in Govindapoor village.",
      },
      { property: "og:title", content: "Village Gallery — Govindapoor" },
      { property: "og:description", content: "Categorised photo and video albums of the village." },
    ],
  }),
  component: Page,
});

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const url = useStoredUrl(item.media_url);
  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <figure className="max-h-full w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {item.media_type === "video" ? (
          <video src={url ?? undefined} controls className="max-h-[75vh] w-full rounded-lg" />
        ) : (
          <img
            src={url ?? undefined}
            alt={item.caption}
            className="max-h-[75vh] w-full rounded-lg object-contain"
          />
        )}
        <figcaption className="mt-4 text-center text-sm text-white/80">{item.caption}</figcaption>
      </figure>
    </div>
  );
}

function Page() {
  const { data = [] } = useQuery(galleryQuery);
  const [album, setAlbum] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const albums = useMemo(
    () => ["All", ...Array.from(new Set(data.map((g) => g.album)))],
    [data],
  );
  const list = useMemo(
    () => data.filter((g) => album === "All" || g.album === album),
    [data, album],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Gallery"
        title="Moments from Govindapoor"
        description="Festivals, development works, community activities, historical photographs and aerial views."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {albums.map((a) => (
            <Button
              key={a}
              size="sm"
              variant={album === a ? "default" : "outline"}
              onClick={() => setAlbum(a)}
            >
              {a}
            </Button>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g, i) => (
            <Reveal key={g.id} delay={i * 50}>
              <button
                onClick={() => setActive(g)}
                className="group bg-surface relative block w-full overflow-hidden rounded-lg border text-left"
              >
                {g.media_type === "video" ? (
                  <div className="hero-surface grid h-56 w-full place-items-center">
                    <Play className="text-gold h-10 w-10" />
                  </div>
                ) : (
                  <StoredImage
                    path={g.media_url}
                    alt={g.caption}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="p-4">
                  <p className="text-gold text-xs tracking-widest uppercase">{g.album}</p>
                  <h2 className="mt-1 font-medium">{g.caption}</h2>
                </div>
              </button>
            </Reveal>
          ))}
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">No media uploaded yet.</p>
          ) : null}
        </div>
      </section>
      {active ? <Lightbox item={active} onClose={() => setActive(null)} /> : null}
    </PageShell>
  );
}
