"use client";

import React, { useState } from "react";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<{ valid: boolean; timestamp?: number; hash?: string; message?: string } | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(null);
    setError("");
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const onVerify = async () => {
    try {
      if (!file) {
        setError("Please choose a PDF file to verify.");
        return;
      }
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/verifyReport", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }
      setResult(data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Verification failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const formattedTime = (ts?: number) => {
    if (!ts) return "";
    try {
      return new Date(ts * 1000).toLocaleString();
    } catch {
      return String(ts);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur rounded-2xl shadow p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Verify PDF on Chain</h1>
        <p className="text-sm text-gray-600 mt-1">Upload a PDF. We compute its SHA-256 and check if it was stored on Avalanche C-Chain.</p>

        <div className="mt-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onVerify}
            disabled={loading || !file}
            className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify PDF"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {result && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
            {result.valid ? (
              <>
                <p className="text-green-700 font-medium">Verified ✅</p>
                {result.hash && (
                  <p className="mt-2 break-all"><span className="font-medium">Hash:</span> {result.hash}</p>
                )}
                {result.timestamp && (
                  <p className="mt-1"><span className="font-medium">Timestamp:</span> {formattedTime(result.timestamp)}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-yellow-800 font-medium">Not Found ❌</p>
                <p className="mt-1 text-gray-700">{result.message || "This PDF hash is not stored on chain."}</p>
              </>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          Tip: Use the Generate page to create a report. It uploads to IPFS via Pinata and stores the file hash on Avalanche automatically.
        </div>
      </div>
    </div>
  );
}
