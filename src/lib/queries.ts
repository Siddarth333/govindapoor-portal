import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Village = Tables<"village_profile">;
export type Announcement = Tables<"announcements">;
export type VEvent = Tables<"events">;
export type Project = Tables<"projects">;
export type VDocument = Tables<"documents">;
export type Meeting = Tables<"meetings">;
export type GalleryItem = Tables<"gallery">;
export type PopulationRecord = Tables<"population_records">;
export type UsefulLink = Tables<"useful_links">;
export type PastSarpanch = Tables<"past_sarpanches">;

export type StatItem = { label: string; value: string };
export type TimelineItem = { year: string; event: string };

export const villageQuery = queryOptions({
  queryKey: ["village"],
  queryFn: async (): Promise<Village | null> => {
    const { data, error } = await supabase.from("village_profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const announcementsQuery = queryOptions({
  queryKey: ["announcements"],
  queryFn: async (): Promise<Announcement[]> => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("pinned", { ascending: false })
      .order("published_on", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: async (): Promise<VEvent[]> => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: async (): Promise<VDocument[]> => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("published_on", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const meetingsQuery = queryOptions({
  queryKey: ["meetings"],
  queryFn: async (): Promise<Meeting[]> => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async (): Promise<GalleryItem[]> => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const feedbackQuery = queryOptions({
  queryKey: ["feedback"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const populationQuery = queryOptions({
  queryKey: ["population_records"],
  queryFn: async (): Promise<PopulationRecord[]> => {
    const { data, error } = await supabase
      .from("population_records")
      .select("*")
      .order("ward", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const linksQuery = queryOptions({
  queryKey: ["useful_links"],
  queryFn: async (): Promise<UsefulLink[]> => {
    const { data, error } = await supabase
      .from("useful_links")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const pastSarpanchesQuery = queryOptions({
  queryKey: ["past_sarpanches"],
  queryFn: async (): Promise<PastSarpanch[]> => {
    const { data, error } = await supabase
      .from("past_sarpanches")
      .select("*")
      .order("term_from", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});


export function asStats(value: unknown): StatItem[] {
  return Array.isArray(value) ? (value as StatItem[]) : [];
}
export function asTimeline(value: unknown): TimelineItem[] {
  return Array.isArray(value) ? (value as TimelineItem[]) : [];
}

export const PROJECT_SECTIONS = [
  "Rural Development",
  "Community Development",
  "Rural Empowerment",
  "Social Service",
] as const;

export const EVENT_CATEGORIES = [
  "Government Programs",
  "Community Events",
  "Agriculture Activities",
  "Health Camps",
  "Awareness Programs",
  "Cultural Celebrations",
  "Educational Programs",
] as const;

export const DOCUMENT_CATEGORIES = [
  "Village Constitution",
  "Community Rules",
  "Public Guidelines",
  "Government Regulations",
  "Local Policies",
  "Citizen Responsibilities",
  "Reports",
] as const;

export const LINK_CATEGORIES = [
  "Government Website",
  "Scheme",
  "Mobile App",
  "Helpline",
] as const;
