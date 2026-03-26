"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const ALLOWED_DOMAIN = "2be.com.br";

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setError(`Apenas emails @${ALLOWED_DOMAIN} podem acessar.`);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            GUIO Presentations
          </h1>
          <p className="text-sm text-white/50 mt-1">AI-Powered</p>
        </div>

        {magicLinkSent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#ac0015]/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[#d12429] text-[28px]">
                mark_email_read
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Verifique seu email
            </h2>
            <p className="text-sm text-white/50">
              Enviamos um link de acesso para{" "}
              <span className="text-white font-medium">{email}</span>
            </p>
            <button
              onClick={() => {
                setMagicLinkSent(false);
                setEmail("");
              }}
              className="mt-6 text-sm text-[#d12429] hover:text-[#ac0015] transition-colors"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/70 mb-1.5"
              >
                Email corporativo
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@2be.com.br"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#ac0015]/50 focus:border-[#ac0015] transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-[#d12429]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#ac0015] hover:bg-[#d12429] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Entrar com Magic Link"}
            </button>

            <p className="text-xs text-white/30 text-center pt-2">
              Acesso restrito a emails @2be.com.br
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
