import React from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";

export default function (props) {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      name="password"
      fullWidth
      label="Password"
      variant="faded"
      placeholder="Enter your password"
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className=""
      classNames={{
        inputWrapper:
          "data-[hover=true]:border-gray-darkest data-[hover=true]:bg-gray-darker/50 group-data-[focus=true]:bg-gray-darker/50 bg-black border-4 border-gray-darkest group-data-[has-value=true]:text-green",
      }}
    />
  );
}
