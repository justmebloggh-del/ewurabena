import { FanCard } from "@/components/fan/fan-card";
import { getFanDirectory } from "@/lib/data/fan-hub";
import { getViewer } from "@/lib/data/fan-viewer";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function FansPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const viewer = await getViewer();
  const fans = await getFanDirectory(viewer?.id ?? null, q);

  return (
    <div className="fh-stack">
      <form className="fh-card fh-row" role="search" action="/fan/people">
        <input name="q" defaultValue={q} placeholder="Search fans by name…" aria-label="Search fans" className="fh-search" maxLength={40} />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {fans.length === 0 ? (
        <div className="fh-card fh-empty">
          <p>{q ? `No fans found for “${q}”.` : "No fans here yet — you could be the first!"}</p>
        </div>
      ) : (
        fans.map((fan) => <FanCard key={fan.id} fan={fan} signedIn={Boolean(viewer)} />)
      )}
    </div>
  );
}
