export default function AuthCard({ title, children, footer }) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5 rounded-xl border-2 border-accent/50 bg-secondary p-5 text-foreground shadow-card">
      <h1 className="text-center text-2xl font-bold text-foreground">
        {title}
      </h1>

      {children}

      {footer && (
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}