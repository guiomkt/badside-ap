import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderFunnelSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;
  const steps = slide.funnelSteps ?? [];

  const stepsHtml = steps
    .map((step, i) => {
      const pctHtml =
        step.percentage != null
          ? `<div class="progress-bar" style="margin-top:12px;">
              <div class="progress-bar-fill red" data-width="${step.percentage}" style="width:0%;"></div>
            </div>`
          : "";

      const arrowHtml =
        i < steps.length - 1
          ? /* html */ `
      <div class="funnel-arrow anim-fade-in" data-delay="${(i + 1) * 2}">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>`
          : "";

      return /* html */ `
      <div class="card card-red-top anim-scale-in" data-delay="${i * 2 + 1}" style="flex:1;min-width:0;">
        <div class="t-caption" style="margin-bottom:8px;">${step.label}</div>
        <div class="t-metric t-metric-sm text-red">${step.value}</div>
        ${pctHtml}
      </div>
      ${arrowHtml}`;
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
    <div style="display:flex;align-items:stretch;gap:16px;">
      ${stepsHtml}
    </div>
  </div>
</section>`;
}
