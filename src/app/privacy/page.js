import React from "react";

import {
  StaticPageCard,
  StaticPageShell,
} from "../components/StaticPage";

const collectedData = [
  "Basic account information, such as username and email.",
  "Usage data and preferences.",
  "Uploaded content history.",
];

const dataUsage = [
  "To demonstrate user authentication functionality.",
  "To showcase content management features.",
  "To display platform usage statistics.",
];

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-4 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <StaticPageShell title="Privacy Policy">
      <div className="space-y-6 text-lg">
        <p>
          TrackFusion is committed to demonstrating good privacy practices as
          part of this portfolio project. This policy outlines how user data
          would be handled in a production environment.
        </p>

        <StaticPageCard title="Data Collection">
          <div className="space-y-4">
            <p>For demonstration purposes, we may collect:</p>
            <BulletList items={collectedData} />
          </div>
        </StaticPageCard>

        <StaticPageCard title="Data Usage">
          <BulletList items={dataUsage} />
        </StaticPageCard>

        <p className="mt-6 text-sm">
          Note: This is a portfolio project, and no actual user data is stored
          or processed for commercial purposes.
        </p>
      </div>
    </StaticPageShell>
  );
}