"use client";

import { useState } from "react";
import FloatingToolbar from "./FloatingToolbar";
import ThumbnailStrip from "./ThumbnailStrip";
import SlideIndicator from "./SlideIndicator";

interface PreviewPanelProps {
  htmlContent?: string;
  currentSlide: number;
  totalSlides: number;
}

export default function PreviewPanel({
  htmlContent,
  currentSlide,
  totalSlides,
}: PreviewPanelProps) {
  const [activeSlide, setActiveSlide] = useState(currentSlide);

  return (
    <div className="flex-1 bg-[#f3f3f3] flex flex-col items-center justify-center relative h-full overflow-hidden">
      {/* Floating toolbar */}
      <FloatingToolbar />

      {/* Slide canvas area */}
      <div className="flex items-stretch w-full max-w-[90%] flex-1 py-16 gap-0">
        {/* Thumbnail strip */}
        <ThumbnailStrip
          totalSlides={totalSlides}
          activeSlide={activeSlide}
          onSlideClick={setActiveSlide}
        />

        {/* Main slide canvas */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full aspect-[16/9] bg-white rounded-lg shadow-2xl overflow-hidden relative">
            {htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                title="Slide Preview"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-[--color-primary]/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px] text-[--color-primary-container]">
                    slideshow
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[--color-on-surface] tight-tracking mb-1">
                  Preview da Apresentação
                </h3>
                <p className="text-sm text-[--color-on-surface-variant] max-w-xs">
                  Descreva sua apresentação no chat e a IA irá gerar os slides
                  automaticamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <SlideIndicator
          current={activeSlide}
          total={totalSlides}
          statusText="Editando"
        />
      </div>
    </div>
  );
}
