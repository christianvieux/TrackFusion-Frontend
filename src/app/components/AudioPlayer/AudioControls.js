export default function AudioControlIcon({
  Component,
  isActive = false,
  className = "",
  ...props
}) {
  return (
    <Component
      className={`relative z-10 size-full transition-all duration-200 ${
        isActive ? "scale-110 text-player-accent" : "text-player-muted"
      } ${className}`}
      strokeWidth={isActive ? "2" : "1.5"}
      {...props}
    />
  );
}