import { Suspense } from "react";
import PaypalCompleted from "./PaypalComplete ";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaypalCompleted />
    </Suspense>
  );
}
