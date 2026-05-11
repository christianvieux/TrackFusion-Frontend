import React from "react";
import { Button } from "@heroui/react";
import { XCircle } from "lucide-react";

import { getFileInputName } from "./utils";

export default function FileUploadField({
  type,
  file,
  label,
  icon,
  allowedTypes,
  onFileChange,
  onRemove,
  isDisabled,
}) {
  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-accent bg-muted p-4 transition hover:border-primary hover:bg-secondary-hover">
        <input
          name={getFileInputName(type)}
          className="hidden"
          type="file"
          accept={allowedTypes.join(",")}
          onChange={onFileChange}
          disabled={isDisabled}
        />

        <div className="flex items-center gap-2 text-primary">
          {icon}
          <span>{label}</span>
        </div>
      </label>

      {file && (
        <div className="flex items-center justify-between gap-3 rounded-md bg-secondary p-2">
          <p className="truncate text-sm text-foreground">{file.name}</p>

          <Button
            isIconOnly
            variant="light"
            className="text-danger"
            type="button"
            onClick={onRemove}
            isDisabled={isDisabled}
          >
            <XCircle size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}