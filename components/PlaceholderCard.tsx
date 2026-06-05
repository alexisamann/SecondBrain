import clsx from "clsx";
import type { PlaceholderTone } from "@/lib/types";

type PlaceholderCardProps = {
  title: string;
  description?: string;
  tone?: PlaceholderTone;
};

const toneClassName: Record<PlaceholderTone, string> = {
  neutral: "border-black/10 bg-paper",
  warm: "border-clay/20 bg-[#FFF8F1]",
  sage: "border-sage/20 bg-[#F4F8F1]"
};

export function PlaceholderCard({
  title,
  description = "Hier erscheinen spaeter automatisch erkannte Inhalte.",
  tone = "neutral"
}: PlaceholderCardProps) {
  return (
    <section className={clsx("rounded-lg border p-4", toneClassName[tone])}>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </section>
  );
}
