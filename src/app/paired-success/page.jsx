import { Suspense } from "react";
import PairedSuccessClient from "./PairedSuccessClient";

export default function PairedSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PairedSuccessClient />
    </Suspense>
  );
}