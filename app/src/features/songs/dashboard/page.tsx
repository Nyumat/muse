import { Suspense } from "react";
import { SongsPageSkeleton } from "./skeleton";
import { SongsView } from "./view";

export function SongsPage() {
  return (
    <Suspense fallback={<SongsPageSkeleton />}>
      <SongsView />
    </Suspense>
  );
}
