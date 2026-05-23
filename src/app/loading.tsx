export default function Loading() {
  return (
    <div className="loading-shell" aria-hidden="true">
      <div className="loading-hero">
        <div className="loading-hero-inner">
          <div className="loading-hero-label" />
          <div className="loading-hero-title" />
          <div className="loading-hero-sub" />
          <div className="loading-hero-sub" style={{ width: "60%", animationDelay: "0.25s" }} />
          <div className="loading-hero-cta">
            <div className="loading-hero-btn" />
            <div className="loading-hero-btn" style={{ width: "120px", animationDelay: "0.35s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
