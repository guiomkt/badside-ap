import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderChartBarSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;
  const bars = slide.chartBars ?? [];

  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  const barsHtml = bars
    .map((bar, i) => {
      const pct = Math.round((bar.value / maxVal) * 100);

      return /* html */ `
      <div class="bar-row anim-fade-up" data-delay="${i + 1}">
        <div class="bar-label">${bar.label}</div>
        <div class="bar-track">
          <div class="bar-fill" data-width="${pct}" style="width:0%;${bar.color ? `background:${bar.color};` : ""}">
            <span>${bar.value}</span>
          </div>
        </div>
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
    <div class="bar-chart">
      ${barsHtml}
    </div>
  </div>
</section>`;
}
