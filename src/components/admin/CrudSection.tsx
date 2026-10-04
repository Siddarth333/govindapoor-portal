import { useState } from "react";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "time" | "number" | "select" | "switch" | "file";
  options?: readonly string[];
  accept?: string;
  nameField?: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = any;

export function CrudSection({
  table,
  title,
  description,
  fields,
  query,
  primary,
  secondary,
  folder,
}: {
  table:
    | "announcements"
    | "events"
    | "projects"
    | "documents"
    | "meetings"
    | "gallery"
    | "population_records"
    | "useful_links"
    | "past_sarpanches";
  title: string;
  description: string;
  fields: Field[];
  query: UseQueryOptions<any, any, any, any>;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
  folder: string;
}) {
  const qc = useQueryClient();
  const { data = [] } = useQuery(query as any) as { data: Row[] };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const payload = { ...row };
      delete payload.created_at;
      delete payload.updated_at;
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase.from(table).update(rest as never).eq("id", id);
        if (error) throw error;
      } else {
        delete payload.id;
        const { error } = await supabase.from(table).insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: query.queryKey });
      setOpen(false);
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message ?? "Could not save"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: query.queryKey });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Could not delete"),
  });

  async function pick(field: Field, file: File) {
    setUploading(field.name);
    try {
      const path = await uploadFile(file, folder);
      setDraft((d: Row) => ({
        ...d,
        [field.name]: path,
        ...(field.nameField ? { [field.nameField]: file.name } : {}),
      }));
      toast.success("File uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
        <Button
          onClick={() => {
            setDraft({});
            setOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add new
        </Button>
      </div>

      <div className="mt-6 divide-y rounded-lg border">
        {data.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{primary(row)}</p>
              <p className="text-muted-foreground truncate text-xs">{secondary(row)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDraft(row);
                setOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (confirm("Delete this entry?")) remove.mutate(row.id);
              }}
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        ))}
        {data.length === 0 ? (
          <p className="text-muted-foreground p-6 text-sm">Nothing published yet.</p>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit" : "Add"} — {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <Label>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    rows={4}
                    className="mt-1.5"
                    value={draft[f.name] ?? ""}
                    onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={draft[f.name] ?? ""}
                    onValueChange={(v) => setDraft({ ...draft, [f.name]: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : f.type === "switch" ? (
                  <div className="mt-2">
                    <Switch
                      checked={!!draft[f.name]}
                      onCheckedChange={(v) => setDraft({ ...draft, [f.name]: v })}
                    />
                  </div>
                ) : f.type === "file" ? (
                  <div className="mt-1.5 flex items-center gap-3">
                    <Input
                      type="file"
                      accept={f.accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void pick(f, file);
                      }}
                    />
                    {uploading === f.name ? (
                      <Upload className="text-muted-foreground h-4 w-4 animate-pulse" />
                    ) : null}
                  </div>
                ) : (
                  <Input
                    className="mt-1.5"
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={draft[f.name] ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                )}
                {f.type === "file" && draft[f.name] ? (
                  <p className="text-muted-foreground mt-1 truncate text-xs">{draft[f.name]}</p>
                ) : null}
              </div>
            ))}
            <Button
              className="w-full"
              disabled={save.isPending}
              onClick={() => save.mutate(draft)}
            >
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
