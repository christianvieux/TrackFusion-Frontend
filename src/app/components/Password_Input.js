import React from "react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "./Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon";

export default function (props) {
  const { color, className, isRequired, placeholder, label, variant, ...rest } = props;
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      className={`${className}`}
      classNames={
        {
          input: "bg-clip-padding",
      }
    }
      name="password"
      color={color}
      variant={variant}
      isRequired={isRequired}
      type={isVisible ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      {...rest} // Spread the rest of the props
    />
  );
  // return (<Login />);
}
