import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type PlaceholderTone = "neutral" | "warm" | "sage";

export type ThoughtType =
  | "thought"
  | "task"
  | "decision"
  | "question"
  | "idea"
  | "reminder"
  | "goal"
  | "reflection"
  | "other";

export type Importance = "low" | "medium" | "high";

export type Emotion = "positive" | "neutral" | "negative" | "mixed";

export type ExtractedItemType =
  | "task"
  | "decision"
  | "question"
  | "idea"
  | "reminder"
  | "goal";

export type ExtractedItemStatus = "open" | "done" | "dismissed";

export type Profile = {
  id: string;
  created_at: string;
  email: string | null;
};

export type Thought = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  transcript: string;
  summary: string | null;
  primary_topic: string | null;
  explicit_topic: string | null;
  inferred_topics: string[];
  type: ThoughtType | null;
  importance: Importance | null;
  emotion: Emotion | null;
  key_points: unknown[];
  people: string[];
  projects: string[];
  memory_worthy: boolean;
  possible_future_reminder: string | null;
  audio_url: string | null;
};

export type ExtractedItem = {
  id: string;
  user_id: string;
  thought_id: string | null;
  created_at: string;
  updated_at: string;
  item_type: ExtractedItemType;
  title: string;
  description: string | null;
  status: ExtractedItemStatus;
  priority: Importance | null;
};

export type WeeklyReview = {
  id: string;
  user_id: string;
  created_at: string;
  week_start: string;
  week_end: string;
  summary: string | null;
  recurring_topics: unknown[];
  open_loops: unknown[];
  next_steps: unknown[];
  raw_result: Record<string, unknown>;
};
