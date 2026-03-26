import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhdykhfxwaqzkpsbhbzk.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZHlraGZ4d2Fxemtwc2JoYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDEyNjgsImV4cCI6MjA5MDExNzI2OH0.-eoczYwfXrv90Wi0N3AOWPk6fYxZjwV_cDmQ4AQZVz8";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
