import { useStoredUrl } from "@/hooks/useStoredUrl";
import { cn } from "@/lib/utils";

export function StoredImage({
  path,
  alt,
  className,
}: {
  path?: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const url = useStoredUrl(path);
  if (!url) return <div className={cn("bg-surface-2 animate-pulse", className)} aria-hidden />;
  return <img src={url} alt={alt} loading="lazy" className={className} />;
}
