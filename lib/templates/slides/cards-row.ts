import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr, gridClass } from "../utils";

export function renderCardsRowSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;
  const cards = slide.cards ?? [];

  const cardsHtml = cards
    .map((card, i) => {
      const iconHtml = card.icon
        ? `<div style="font-size:28px;margin-bottom:12px;">${card.icon}</div>`
        : "";

      return /* html */ `
      <div class="card card-red-top anim-scale-in" data-delay="${i + 1}">
        ${iconHtml}
        <h3 class="t-heading-sm" style="margin-bottom:8px;">${card.title}</h3>
        <div class="divider"></div>
        <p class="t-body-sm" style="margin-top:8px;">${card.description}</p>
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
    <div class="${gridClass(cards.length)}">
      ${cardsHtml}
    </div>
  </div>
</section>`;
}
