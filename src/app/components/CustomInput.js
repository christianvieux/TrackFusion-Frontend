import React from "react";
import { Input } from "@nextui-org/react";

export default function CustomInput({ classNames, ...props }) {
  const baseClassNames = {
    base: "w-auto",
    inputWrapper: "",
    input: "!bg-clip-padding",
  };

  const mergeClassNames = (base, additional) => {
    if (!additional) return base;
    return Object.keys(base).reduce((merged, key) => {
      const baseClass = base[key];
      const additionalClass = additional[key] || '';
      // Only add base class if it's not already in additional
      merged[key] = additionalClass.includes(baseClass) 
        ? additionalClass 
        : `${baseClass} ${additionalClass}`.trim();
      return merged;
    }, {});
  };

  const mergedClassNames = mergeClassNames(baseClassNames, classNames);

  return (
    <Input
      variant="bordered"
      classNames={mergedClassNames}
      {...props}
    />
  );
}