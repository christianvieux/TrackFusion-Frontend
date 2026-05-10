import React from "react";

export default function ContactItem({
  icon: Icon,
  href,
  label,
  isExternal = false,
}) {
  return (
    <div className="flex items-center space-x-4">
      <Icon className="h-6 w-6 text-primary" />

      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="transition hover:text-primary"
      >
        {label}
      </a>
    </div>
  );
}