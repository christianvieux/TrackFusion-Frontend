import React from "react";

import {
  StaticPageCard,
  StaticPageShell,
} from "../components/StaticPage";

const usageTerms = [
  "This is a demonstration project and not a commercial service.",
  "Features are provided for demonstration purposes only.",
  "User data may not be permanently stored or secured.",
  "The service may be modified or terminated at any time.",
];

const contentGuidelines = [
  "Users are responsible for the content they upload.",
  "Copyrighted material should not be uploaded without permission.",
  "Inappropriate or illegal content is strictly prohibited.",
];

function NumberedList({ items }) {
  return (
    <ol className="list-decimal space-y-4 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export default function TermsPage() {
  return (
    <StaticPageShell title="Terms of Service">
      <div className="space-y-6 text-lg">
        <p>
          This is a portfolio project created for
          demonstration purposes. By using this service, you acknowledge that:
        </p>

        <StaticPageCard title="Usage Terms">
          <NumberedList items={usageTerms} />
        </StaticPageCard>

        <StaticPageCard title="Content Guidelines">
          <NumberedList items={contentGuidelines} />
        </StaticPageCard>
      </div>
    </StaticPageShell>
  );
}