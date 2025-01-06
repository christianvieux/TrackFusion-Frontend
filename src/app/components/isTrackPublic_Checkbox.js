import React, { useState } from "react";
import { Checkbox } from "@nextui-org/react";

export default function isTrackPublicCheckBox({
  value=false,
  setIsPublic=()=>{},
  ...rest
}) {
  const [isChecked, setIsChecked] = useState(value);
  // Function to be called when "Delete this track" button is clicked
  const handleSelectedChange = (value) => {
    setIsChecked(value);
    setIsPublic(value);
  };

  return (
    <div className="flex gap-2 text-green">
      <Checkbox
        name="is_public"
        label="is_public"
        classNames={{ label: "text-" }}
        value={isChecked}
        defaultSelected={isChecked}
        onValueChange={handleSelectedChange}
        {...rest}
      >
        <div className="">
        <p className="float-start mr-2">Public</p>
        <p className="text-default-500">
        This track will be{" "}
        {isChecked ? "seen from other users" : "hidden from other users"}
      </p>
        </div>
      </Checkbox>
      
    </div>
  );
}
