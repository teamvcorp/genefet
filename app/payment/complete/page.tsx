// app/payment/complete/page.tsx
import PayCompleteClient from "@/app/components/PayCompleteClient";
export const dynamic = "force-dynamic"; // avoid prerender errors

import { Suspense } from "react";

export default function PayCompletePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl p-6 pt-20">Checking payment status…</div>}>
      <PayCompleteClient />
    </Suspense>
  );
}
