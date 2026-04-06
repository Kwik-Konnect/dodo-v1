import { ShieldCheck } from "lucide-react";

export function NoticeBanner() {
  return (
    <section className="border-b border-border bg-card/50 py-4">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex flex-col items-center gap-2 sm:flex-row">
          <span className="text-lg">🚨</span>
          <span className="text-sm font-semibold text-foreground">Client Notice</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          To protect all users and ensure trusted experiences:
        </p>
        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-center sm:gap-4">
          <span className="flex items-center gap-1">
            ✅ <strong>PLEASE</strong> Confirm all users with a video call
          </span>
          <span className="flex items-center gap-1">
            🚗 Provide transportation fare upfront before any meet
          </span>
        </div>
        <p className="mt-1.5 text-xs font-medium text-primary">
          Report any suspicious profiles immediately.
        </p>
      </div>
    </section>
  );
}
