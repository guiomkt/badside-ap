import type { PresentationData, Slide } from "@/lib/schemas/presentation";
import { renderBaseTemplate } from "./base";
import { renderCoverSlide } from "./slides/cover";
import { renderMetricsSlide } from "./slides/metrics";
import { renderTwoColumnSlide } from "./slides/two-column";
import { renderCardsRowSlide } from "./slides/cards-row";
import { renderFunnelSlide } from "./slides/funnel";
import { renderChecklistSlide } from "./slides/checklist";
import { renderChartBarSlide } from "./slides/chart-bar";
import { renderKpiTableSlide } from "./slides/kpi-table";
import { renderClosingSlide } from "./slides/closing";
import { renderContentSlide } from "./slides/content";

/**
 * Render a single slide based on its type.
 */
function renderSlide(slide: Slide, index: number): string {
  switch (slide.type) {
    case "cover":
      return renderCoverSlide(slide, index);
    case "metrics":
      return renderMetricsSlide(slide, index);
    case "two-column":
      return renderTwoColumnSlide(slide, index);
    case "cards-row":
      return renderCardsRowSlide(slide, index);
    case "funnel":
      return renderFunnelSlide(slide, index);
    case "checklist":
      return renderChecklistSlide(slide, index);
    case "chart-bar":
      return renderChartBarSlide(slide, index);
    case "kpi-table":
      return renderKpiTableSlide(slide, index);
    case "closing":
      return renderClosingSlide(slide, index);
    case "content":
      return renderContentSlide(slide, index);
    default:
      // Fallback: render as generic content
      return renderContentSlide(slide, index);
  }
}

/**
 * Compile a full presentation JSON into a standalone HTML string.
 *
 * @param data - Validated presentation data matching PresentationData schema
 * @returns Complete HTML string ready to be served or loaded in an iframe
 */
export function compilePresentation(data: PresentationData): string {
  // Render all slides
  const slidesHtml = data.slides
    .map((slide, index) => renderSlide(slide, index))
    .join("\n\n");

  // Collect presenter notes
  const presenterNotes = data.slides
    .map((slide, index) => ({
      slideNum: index + 1,
      notes: slide.notes || "",
    }))
    .filter((n) => n.notes.length > 0);

  // Build the full HTML document
  return renderBaseTemplate({
    title: data.title,
    slidesHtml,
    totalSlides: data.slides.length,
    brandColors: data.brandColors
      ? {
          primary: data.brandColors.primary,
          primaryContainer: data.brandColors.secondary,
          background: data.brandColors.background,
        }
      : undefined,
    presenterNotes,
  });
}
