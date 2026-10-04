import { Download } from "lucide-react";
import { useStoredUrl } from "@/hooks/useStoredUrl";
import { Button } from "@/components/ui/button";

export function FileLink({ path, label }: { path?: string | null; label?: string | null }) {
  const url = useStoredUrl(path);
  if (!path) return null;
  return (
    <Button asChild variant="outline" size="sm" disabled={!url}>
      <a href={url ?? "#"} target="_blank" rel="noreferrer noopener">
        <Download className="mr-1.5 h-4 w-4" />
        {label || "Download"}
      </a>
    </Button>
  );
}
