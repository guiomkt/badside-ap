import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderChecklistSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;
  const items = slide.checklist ?? [];

  const itemsHtml = items
    .map(
      (item) =>
        `<li class="${item.checked !== false ? "checked" : ""}">${item.text}</li>`
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
      <ul class="checklist">
        ${itemsHtml}
      </ul>
    </div>
  </div>
</section>`;
}
