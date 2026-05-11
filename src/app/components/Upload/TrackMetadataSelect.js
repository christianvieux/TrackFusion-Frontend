import React from "react";
import { Label, ListBox, Select } from "@heroui/react";

import { formatLabel } from "./utils";

export default function TrackMetadataSelect({
  name,
  options = [],
  allowMultiple = false,
  isDisabled,
  setTrackMetadata,
}) {
  function handleSelectionChange(selectedKey) {
    const selectedValues =
      selectedKey instanceof Set ? Array.from(selectedKey) : [selectedKey];

    setTrackMetadata((currentMetadata) => ({
      ...currentMetadata,
      [name]: selectedValues.join(","),
    }));
  }

  return (
    <Select
      className="max-w-full"
      placeholder={`Select ${allowMultiple ? "one or more" : "a"} ${name}`}
      selectionMode={allowMultiple ? "multiple" : "single"}
      isDisabled={isDisabled}
      onSelectionChange={handleSelectionChange}
    >
      <Label>
        Track {formatLabel(name)}
        {name === "category" && <span className="text-danger"> *</span>}
      </Label>

      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          {options.map((item) => (
            <ListBox.Item
              key={item}
              id={item}
              textValue={formatLabel(item)}
              className="text-foreground"
            >
              {formatLabel(item)}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}