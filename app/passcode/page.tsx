"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PasscodePage() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sp = useSearchParams();
  const router = useRouter();
  const returnTo = sp.get("returnTo") || "/payment";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/pay/gate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Invalid passcode");
      }
      router.replace(returnTo);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm p-6 pt-20">
      <h1 className="text-xl font-semibold mb-4">Enter passcode</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Passcode"
          required
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
