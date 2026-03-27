import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderClosingSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;

  return /* html */ `
<section
  class="slide"
  id="slide-${slideNum}"
  data-notes="${escapeAttr(slide.notes || "")}"
  style="text-align:center;"
>
  <div class="bg-glow" style="top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.8;width:800px;height:800px;"></div>
  <div class="bg-grid"></div>
  <div class="slide-inner" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;">
    <img src="https://ppt.guio.ai/images/logo-branca.png" alt="GUIO" class="anim-fade-in" style="width:180px;height:auto;margin-bottom:24px;" data-delay="0">
    <h2 class="t-display t-display-xl anim-fade-up" data-delay="1">
      ${highlightTitle(slide.title, slide.highlightWords)}
    </h2>
    ${
      slide.subtitle
        ? `<p class="t-body anim-fade-up" data-delay="2" style="color:var(--gray-400);max-width:600px;">${slide.subtitle}</p>`
        : ""
    }
    ${
      slide.body
        ? `<div class="anim-fade-up" data-delay="4" style="margin-top:32px;font-size:13px;color:var(--gray-600);">${slide.body}</div>`
        : ""
    }
  </div>
</section>`;
}
