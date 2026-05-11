import React from "react";

export default function StaticPageShell({ title, children }) {
  return (
    <main className="mx-auto rounded-md max-w-4xl border-2 border-accent bg-background p-8 text-foreground">
      <h1 className="mb-6 text-3xl font-semibold text-primary sm:text-4xl">
        {title}
      </h1>

      {children}
    </main>
  );
}