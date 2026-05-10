import React from "react";
import Link from "next/link";

export default function StaticPageButton({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-lg border-2 border-accent bg-secondary px-6 py-3 font-semibold text-primary shadow-inner transition hover:bg-secondary-hover hover:text-accent-hover"
    >
      {children}
    </Link>
  );
}