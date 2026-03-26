export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl text-red-500">block</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.022em" }}>
          Acesso não autorizado
        </h1>
        <p className="text-zinc-400 mb-8">
          Apenas emails <strong className="text-white">@2be.com.br</strong> podem acessar esta plataforma.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#d12429] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar ao login
        </a>
      </div>
    </div>
  );
}
