import React from "react";
import {
  Pagination,
  PaginationItemType,
  usePagination,
} from "@nextui-org/react";
import { ChevronIcon } from "./ChevronIcon";

// Define a simple function to conditionally join class names
const cn = (...classNames) => {
  return classNames.filter(Boolean).join(" ");
};

export default function (props) {
  const {page, total, onChange, ...args} = props
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onPrevious}
        >
          <ChevronIcon />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          className,
          isActive &&
            "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold" || ""
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <Pagination
      disableCursorAnimation
      showControls
      total={total}
      page={page}
      onChange={onChange}
      initialPage={1}
      
      className="gap-2 overflow-x-auto"
      classNames={{
        base: "overflow-visible",
        wrapper: "flex-wrap",
        item: "hover:bg-green-dark/50 bg-gray-darkest border-gray-dark text-green",
      }}
      // radius="full"
      renderItem={renderItem}
      variant="faded"
      siblings={1}
      {...args} // Spread the rest of the props
    />
  );
}
