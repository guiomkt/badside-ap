import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_SESSION_KEY || "";

// OAuth tokens from Claude Code (sk-ant-oat01-*) need Authorization: Bearer header
// Regular API keys (sk-ant-api*) use the default x-api-key header
const isOAuthToken = apiKey.startsWith("sk-ant-oat01-");

export const anthropic = new Anthropic({
  apiKey: isOAuthToken ? undefined : apiKey,
  ...(isOAuthToken
    ? {
        defaultHeaders: {
          Authorization: `Bearer ${apiKey}`,
        },
        // OAuth tokens may need the api.claude.ai endpoint
        baseURL: "https://api.anthropic.com",
      }
    : {}),
});
