import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderKpiTableSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;
  const rows = slide.kpiRows ?? [];

  const statusColor = (status?: string) => {
    switch (status) {
      case "on-track":
        return "var(--green)";
      case "at-risk":
        return "#FFA000";
      case "behind":
        return "var(--red)";
      default:
        return "var(--gray-400)";
    }
  };

  const rowsHtml = rows
    .map(
      (row) => /* html */ `
      <div class="metric-row">
        <span class="metric-label">${row.label}</span>
        <span class="metric-value" style="color:var(--gray-300);">${row.current}</span>
        <span class="metric-value">${row.target}</span>
        ${
          row.status
            ? `<span class="badge" style="background:${statusColor(row.status)}22;color:${statusColor(row.status)};">${row.status}</span>`
            : ""
        }
      </div>`
    )
    .join("\n");

  return /* html */ `
<section
  class="slide"
  id="slide-${slideNum}"
  data-notes="${escapeAttr(slide.notes || "")}"
>
  <div class="bg-grid"></div>
  <div class="slide-inner">
    <h2 class="t-display t-display-lg anim-fade-up mb-32" data-delay="0">
      ${highlightTitle(slide.title, slide.highlightWords)}
    </h2>
    <div class="card anim-scale-in" data-delay="1">
      <div class="metric-row" style="border-bottom:1px solid var(--gray-800);padding-bottom:12px;margin-bottom:8px;">
        <span class="metric-label" style="font-weight:700;color:var(--white);">Metric</span>
        <span class="metric-value" style="font-weight:700;color:var(--white);">Current</span>
        <span class="metric-value" style="font-weight:700;color:var(--white);">Target</span>
        <span style="width:80px;"></span>
      </div>
      <div class="metric-table">
        ${rowsHtml}
      </div>
    </div>
  </div>
</section>`;
}
