export default function DropIndicator({
  isHovered,
  itemBeingDragged,
  className = "",
  ...props
}) {
  const canShow = isHovered && itemBeingDragged;

  if (!canShow) return null;

  return (
    <div
      className={`pointer-events-none absolute z-10 flex w-[90%] items-center justify-center rounded-full ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute left-0 z-10 flex size-3 -translate-x-1/2 items-center justify-center rounded-full bg-primary">
        <div className="pointer-events-none size-1/2 rounded-full bg-white/50" />
      </div>

      <div className="pointer-events-none absolute z-0 h-1 w-full rounded-full bg-primary" />
    </div>
  );
}