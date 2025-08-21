// app/payment/complete/page.tsx
import PassCodePage from "@/app/components/PassCodePage";
export const dynamic = "force-dynamic"; // avoid prerender errors

import { Suspense } from "react";

export default function PassPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl p-6 pt-20">Checking Passcode status…</div>}>
      <PassCodePage />
    </Suspense>
  );
}
