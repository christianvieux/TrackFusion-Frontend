import { TextArea } from "@heroui/react";

import AttributeList from "./AttributeList";
import { formatUploadDate } from "../utils";

export default function TrackInfoPanel({ track }) {
  return (
    <div className="flex max-w-[300px] flex-col gap-3">
      <div>
        <h1 className="w-full overflow-x-auto text-pretty pb-3 text-2xl font-bold">
          {track.name}
        </h1>

        <p className="text-xl">{track.artist}</p>

        <p className="text-sm text-muted-foreground">
          Uploaded on {formatUploadDate(track.created_at)}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">
          Description
        </span>

        <TextArea
          readOnly
          aria-label="Track description"
          className="min-h-24 w-full rounded-lg border border-accent bg-muted p-3 text-foreground"
          defaultValue={track.description || "No description provided"}
        />
      </div>

      <div className="space-y-2">
        <AttributeList attribute="category" values={track.category} />
        <AttributeList attribute="mood" values={track.mood} />
        <AttributeList attribute="genre" values={track.genre} />

        {track.bpm && <AttributeList attribute="bpm" values={[track.bpm]} />}
      </div>
    </div>
  );
}