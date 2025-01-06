import { Input } from "@nextui-org/input";
import React from "react";

const SearchIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export default function Search_Input({
  className,
  handleClear,
  ...props
}) {

  return (
    <Input
      className={className}
      size="sm"
      label="Search"
      isClearable
      radius="lg"
      variant="light"
      classNames={{
        label: "!text-current font-bold",
        input: [
          "bg-transparent",
          "text-white/90",
          "placeholder:text-currentColor",
        ],
      }}
      placeholder="Type to search..."
      startContent={
        <SearchIcon className="pointer-events-none mb-0.5 flex-shrink-0" />
      }
      onClear={handleClear}
      {...props}
    />
  );
}
