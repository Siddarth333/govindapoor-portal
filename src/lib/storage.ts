import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string>();

/** Resolve a stored file path (or absolute URL) to a usable URL. */
export async function resolveUrl(path?: string | null): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const hit = cache.get(path);
  if (hit) return hit;
  const { data } = await supabase.storage.from("village").createSignedUrl(path, 60 * 60 * 6);
  if (!data?.signedUrl) return null;
  cache.set(path, data.signedUrl);
  return data.signedUrl;
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("village").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}
