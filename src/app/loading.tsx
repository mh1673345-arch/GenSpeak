import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="h-4 w-32 animate-pulse rounded bg-canvas-subtle" />
      <div className="mt-6 h-14 w-2/3 animate-pulse rounded-xl bg-canvas-subtle" />
      <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-canvas-subtle" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-canvas-subtle" />
        ))}
      </div>
    </Container>
  );
}
