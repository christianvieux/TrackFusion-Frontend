import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import IsTrackPublic_Checkbox from "./isTrackPublic_Checkbox";

function getInputTemplate(
  name,
  label,
  placeholder,
  value,
  onChange,
  variant = "underlined"
) {
  return (
    <Input
      name={name}
      classNames={{ label: "!text-green" }}
      variant={variant}
      placeholder={placeholder}
      color="secondary"
      label={label}
      labelPlacement="outside"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
export default function TrackConfigurationWindow({
  trackDetails,
  setIsSaveDisabled,
}) {
  const [name, setName] = useState(trackDetails?.name);
  const [description, setDescription] = useState(trackDetails?.description);

  useEffect(() => {
    setIsSaveDisabled(name.trim() === "");
  }, [name]);

  return (
    <div className="flex flex-col gap-4 text-green">
      <div>
        {getInputTemplate(
          "name",
          "Name",
          "Please enter a name for your track.",
          name,
          setName
        )}{" "}
      </div>
      <div>
        {getInputTemplate(
          "description",
          "Description",
          "Enter a description for your track.",
          description,
          setDescription
        )}
      </div>
      <div className="flex flex-col gap-2 text-current">
        <IsTrackPublic_Checkbox value={!trackDetails?.is_private} />
      </div>
    </div>
  );
}
