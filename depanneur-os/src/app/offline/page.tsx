export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "min(42rem, 100%)",
          borderRadius: "1.6rem",
          border: "1px solid rgba(255,255,255,0.16)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 34%), rgba(10,16,25,0.78)",
          boxShadow: "0 28px 80px rgba(7,12,21,0.28)",
          backdropFilter: "blur(18px) saturate(130%)",
          padding: "2rem",
          color: "var(--text)",
        }}
      >
        <p
          style={{
            color: "var(--accent-soft)",
            fontSize: "0.82rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: "0.85rem",
            fontWeight: 700,
          }}
        >
          Offline heartbeat
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
            lineHeight: 0.94,
            marginBottom: "1rem",
            maxWidth: "12ch",
          }}
        >
          The family data pool is still here.
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: "34rem",
          }}
        >
          Lydia&apos;s Dépanneur OS keeps inventory notes, sourcing logic,
          compliance reminders, and clean handoffs on this laptop. Reconnect
          when you can, but the board is built to stay useful when the network
          is not.
        </p>
      </section>
    </main>
  );
}
