import { Button } from "@heroui/react";

export default function AudioButton({
  ariaLabel,
  onPress,
  className = "",
  isDisabled,
  children,
  ...props
}) {
  return (
    <Button
      isIconOnly
      size="sm"
      aria-label={ariaLabel}
      onPress={onPress}
      isDisabled={isDisabled}
      className={`size-11 min-w-0 bg-transparent p-0 text-player-muted hover:bg-transparent ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}