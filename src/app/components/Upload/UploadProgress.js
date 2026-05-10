import React from "react";
import { Label, ProgressBar } from "@heroui/react";

import { UPLOAD_STATE_MESSAGES } from "./utils";

export default function UploadProgress({ state, progress }) {
  if (!state) return null;

  const message = UPLOAD_STATE_MESSAGES[state] || "Uploading...";

  return (
    <ProgressBar
      aria-label={message}
      className="max-w-md space-y-2"
      value={progress}
    >
      <div className="flex items-center justify-between gap-4 text-sm text-success">
        <Label>{message}</Label>
        <ProgressBar.Output />
      </div>

      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  );
}