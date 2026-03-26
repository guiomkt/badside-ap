import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderTwoColumnSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;

  const renderColumn = (col?: {
    title?: string;
    body?: string;
    bullets?: string[];
  }): string => {
    if (!col) return "";
    const parts: string[] = [];
    if (col.title) {
      parts.push(`<h3 class="t-heading-sm" style="margin-bottom:12px;">${col.title}</h3>`);
    }
    if (col.body) {
      parts.push(`<p class="t-body-sm">${col.body}</p>`);
    }
    if (col.bullets?.length) {
      parts.push(
        `<ul class="checklist" style="margin-top:12px;">${col.bullets.map((b) => `<li>${b}</li>`).join("\n")}</ul>`
      );
    }
    return parts.join("\n");
  };

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
    <div class="grid-2">
      <div class="card card-red-left anim-slide-left" data-delay="1">
        ${renderColumn(slide.leftColumn)}
      </div>
      <div class="card anim-slide-right" data-delay="2">
        ${renderColumn(slide.rightColumn)}
      </div>
    </div>
  </div>
</section>`;
}
