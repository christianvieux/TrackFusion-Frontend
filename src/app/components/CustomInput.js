// src/app/components/CustomInput.js

import React from "react";
import { Input } from "@nextui-org/react";

export default function CustomInput({ ...props }) {
  const baseClassNames = {
    base: "w-auto",
    inputWrapper: "",
    input: "bg-clip-padding",
  };

  return (
    <Input
      variant="bordered"
      classNames={{
        ...baseClassNames,
        ...(props.classNames || {}),
      }}
      {...props}
    />
  );
}