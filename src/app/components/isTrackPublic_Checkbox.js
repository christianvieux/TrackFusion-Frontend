import React from "react";
import { Checkbox, Label } from "@heroui/react";

export default function IsTrackPublicCheckbox({
  isPublic = false,
  setIsPublic = () => {},
  isDisabled = false,
}) {
  return (
    <Checkbox
      id="track-public"
      name="is_public"
      checked={isPublic}
      disabled={isDisabled}
      onCheckedChange={(checked) => setIsPublic(checked === true)}
      className="items-start text-foreground"
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>

      <Checkbox.Content>
        <Label
          htmlFor="track-public"
          className="cursor-pointer text-sm font-medium text-primary"
        >
          Public
        </Label>

        <p className="mt-1 text-xs text-muted-foreground">
          This track will be{" "}
          {isPublic ? "visible to other users" : "hidden from other users"}.
        </p>
      </Checkbox.Content>
    </Checkbox>
  );
}