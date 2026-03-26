import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderContentSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;

  const bulletsHtml = slide.bullets?.length
    ? /* html */ `
    <ul class="checklist anim-fade-up" data-delay="2" style="margin-top:24px;">
      ${slide.bullets.map((b) => `<li>${b}</li>`).join("\n")}
    </ul>`
    : "";

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
    ${
      slide.body
        ? `<div class="t-body anim-fade-up" data-delay="1" style="max-width:900px;">${slide.body}</div>`
        : ""
    }
    ${bulletsHtml}
  </div>
</section>`;
}
