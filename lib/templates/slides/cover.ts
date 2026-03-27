import type { Slide } from "@/lib/schemas/presentation";
import { highlightTitle, escapeAttr } from "../utils";

export function renderCoverSlide(slide: Slide, index: number): string {
  const slideNum = index + 1;

  return /* html */ `
<section
  class="slide slide-cover"
  id="slide-${slideNum}"
  data-notes="${escapeAttr(slide.notes || "")}"
>
  <div class="bg-glow" style="top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.6;"></div>
  <div class="bg-grid"></div>
  <div class="slide-inner" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:32px;">
    <img src="https://ppt.guio.ai/images/logo-branca.png" alt="GUIO" class="anim-fade-in" style="width:140px;height:auto;margin-bottom:16px;" data-delay="0">
    <h1 class="t-display t-display-xl anim-fade-up" data-delay="1">
      ${highlightTitle(slide.title, slide.highlightWords)}
    </h1>
    ${
      slide.subtitle
        ? `<p class="t-body anim-fade-up" data-delay="2" style="max-width:700px;color:var(--gray-400);font-size:clamp(16px,1.2vw,20px);">${slide.subtitle}</p>`
        : ""
    }
    ${
      slide.body
        ? `<div class="anim-fade-up" data-delay="4" style="margin-top:48px;font-size:13px;color:var(--gray-600);letter-spacing:0.05em;">${slide.body}</div>`
        : ""
    }
  </div>
</section>`;
}
