import Anthropic from "@anthropic-ai/sdk";

const key = process.env.ANTHROPIC_API_KEY || "";
const isOAuthToken = key.startsWith("sk-ant-oat01-");

export const anthropic = new Anthropic({
  // OAuth tokens use authToken (sent as Authorization: Bearer)
  // Regular API keys use apiKey (sent as x-api-key)
  apiKey: isOAuthToken ? null : key,
  authToken: isOAuthToken ? key : null,
});
