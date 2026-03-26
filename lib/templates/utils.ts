/**
 * Wrap highlight words in the title with <span class="text-red">.
 * Handles an array of highlight words from the new schema.
 */
export function highlightTitle(
  title: string,
  highlightWords?: string[]
): string {
  if (!highlightWords || highlightWords.length === 0) return title;

  let result = title;
  for (const word of highlightWords) {
    const idx = result.toLowerCase().indexOf(word.toLowerCase());
    if (idx === -1) continue;
    const before = result.slice(0, idx);
    const match = result.slice(idx, idx + word.length);
    const after = result.slice(idx + word.length);
    result = `${before}<span class="text-red">${match}</span>${after}`;
  }
  return result;
}

/**
 * Escape a string for use in an HTML attribute value.
 */
export function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Returns the CSS grid class based on the number of items.
 */
export function gridClass(count: number): string {
  if (count <= 2) return "grid-2";
  if (count <= 3) return "grid-3";
  if (count <= 4) return "grid-4";
  return "grid-5";
}
