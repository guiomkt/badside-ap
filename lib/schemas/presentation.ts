import { z } from "zod";

export const SlideType = z.enum([
  "cover",
  "content",
  "two-column",
  "metrics",
  "cards-row",
  "chart-bar",
  "checklist",
  "kpi-table",
  "funnel",
  "closing",
]);

export type SlideType = z.infer<typeof SlideType>;

export const BrandColors = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  text: z.string().optional(),
});

export type BrandColors = z.infer<typeof BrandColors>;

export const MetricItem = z.object({
  value: z.string(),
  label: z.string(),
  change: z.string().optional(),
});

export const CardItem = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const ChartBarItem = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
});

export const ChecklistItem = z.object({
  text: z.string(),
  checked: z.boolean().optional(),
});

export const KpiRow = z.object({
  label: z.string(),
  current: z.string(),
  target: z.string(),
  status: z.enum(["on-track", "at-risk", "behind"]).optional(),
});

export const FunnelStep = z.object({
  label: z.string(),
  value: z.string(),
  percentage: z.number().optional(),
});

export const Slide = z.object({
  type: SlideType,
  title: z.string(),
  subtitle: z.string().optional(),
  highlightWords: z.array(z.string()).optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  leftColumn: z
    .object({
      title: z.string().optional(),
      body: z.string().optional(),
      bullets: z.array(z.string()).optional(),
    })
    .optional(),
  rightColumn: z
    .object({
      title: z.string().optional(),
      body: z.string().optional(),
      bullets: z.array(z.string()).optional(),
    })
    .optional(),
  metrics: z.array(MetricItem).optional(),
  cards: z.array(CardItem).optional(),
  chartBars: z.array(ChartBarItem).optional(),
  checklist: z.array(ChecklistItem).optional(),
  kpiRows: z.array(KpiRow).optional(),
  funnelSteps: z.array(FunnelStep).optional(),
  notes: z.string(),
});

export type Slide = z.infer<typeof Slide>;

export const PresentationData = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  brandColors: BrandColors.optional(),
  slides: z.array(Slide),
});

export type PresentationData = z.infer<typeof PresentationData>;
