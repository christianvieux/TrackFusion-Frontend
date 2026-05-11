export default function TrackPageLayout({
  title,
  children,
  className = "",
}) {
  return (
    <section
      id="track_page_layout"
      className={`h-max flex min-h-0 w-full max-w-6xl flex-col gap-5 self-center rounded-lg border-2 border-foreground/30 bg-secondary p-4 text-foreground shadow-card ${className}`}
    >
      <h1 className="shrink-0 whitespace-nowrap text-3xl font-semibold text-foreground">
        {title}
      </h1>

      {children}
    </section>
  );
}