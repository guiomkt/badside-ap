import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr, gridClass } from "../utils";

export function renderMetricsSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;
  const metrics = slide.metrics ?? [];

  const metricsHtml = metrics
    .map((m, i) => {
      // Extract numeric part for counter animation
      const numericValue = m.value.replace(/[^0-9]/g, "");
      const prefix = m.value.replace(/[0-9].*/g, "");
      const suffix = m.value.replace(/.*[0-9]/, "");
      const animate = !!numericValue;

      const changeHtml = m.change
        ? `<div class="t-body-sm" style="margin-top:4px;color:var(--green);">${m.change}</div>`
        : "";

      return /* html */ `
      <div class="card card-red-top anim-scale-in" data-delay="${i + 1}">
        <div class="t-metric t-metric-lg text-red" style="margin-bottom:12px;"${
          animate
            ? ` data-count="${numericValue}" data-prefix="${prefix}" data-suffix="${suffix}"`
            : ""
        }>
          ${animate ? prefix + "0" + suffix : m.value}
        </div>
        <div class="t-body-sm">${m.label}</div>
        ${changeHtml}
      </div>`;
    })
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
    <div class="${gridClass(metrics.length)}">
      ${metricsHtml}
    </div>
  </div>
</section>`;
}
