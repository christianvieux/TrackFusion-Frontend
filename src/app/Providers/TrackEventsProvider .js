// app/providers.js
"use client";

import { TrackEventsProvider } from "./context/TrackEventsContext";

export default function Providers({ children }) {
  return (
    <TrackEventsProvider>
      {children}
    </TrackEventsProvider>
  );
}