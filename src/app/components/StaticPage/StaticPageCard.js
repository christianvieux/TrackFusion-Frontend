import React from "react";

export default function StaticPageCard({
  title,
  children,
  titleClassName = "text-2xl text-primary",
  className = "",
}) {
  return (
    <section className={`rounded-lg bg-muted p-6 shadow-inner ${className}`}>
      {title && (
        <h2 className={`mb-4 font-semibold ${titleClassName}`}>
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}