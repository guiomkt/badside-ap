import Anthropic from "@anthropic-ai/sdk";

// Supports both:
// 1. ANTHROPIC_API_KEY (pay-per-token API key)
// 2. CLAUDE_SESSION_KEY (OAuth token from Claude subscription - uses monthly credits)
const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_SESSION_KEY;

export const anthropic = new Anthropic({
  apiKey,
});
