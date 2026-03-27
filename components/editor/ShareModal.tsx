"use client";

import { useState, useEffect, useCallback } from "react";

interface ShareModalProps {
  presentationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ presentationId, isOpen, onClose }: ShareModalProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchShareStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/share?presentationId=${presentationId}`);
      const json = await res.json();
      if (json.success) {
        setIsPublic(json.data.is_public);
        setPublicToken(json.data.public_token);
      }
    } catch (err) {
      console.error("Failed to fetch share status", err);
    } finally {
      setLoading(false);
    }
  }, [presentationId]);

  useEffect(() => {
    if (isOpen) {
      fetchShareStatus();
    }
  }, [isOpen, fetchShareStatus]);

  const handleToggle = async () => {
    try {
      setToggling(true);
      const newValue = !isPublic;
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId, isPublic: newValue }),
      });
      const json = await res.json();
      if (json.success) {
        setIsPublic(json.data.is_public);
        setPublicToken(json.data.public_token);
      }
    } catch (err) {
      console.error("Failed to toggle share", err);
    } finally {
      setToggling(false);
    }
  };

  const shareLink = publicToken ? `https://ppt.guio.ai/view/${publicToken}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Compartilhar apresentacao
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Controle quem pode visualizar esta apresentacao.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-[#d12429] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Toggle */}
            <div className="flex items-center justify-between py-4 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Tornar publico</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Qualquer pessoa com o link pode visualizar
                </p>
              </div>
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  isPublic ? "bg-[#d12429]" : "bg-gray-200"
                } ${toggling ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Share link */}
            {isPublic && publicToken && (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link de compartilhamento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 truncate focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      copied
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-[#d12429] text-white hover:bg-[#b81f24]"
                    }`}
                  >
                    {copied ? "Copiado!" : "Copiar link"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
