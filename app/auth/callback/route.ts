import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const ALLOWED_DOMAIN = "2be.com.br";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Verify email domain after session is created
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && !user.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        // Unauthorized domain — sign out immediately and block
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/unauthorized`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
