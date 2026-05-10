export default function AudioControlIcon({
  Component,
  isActive = false,
  className = "",
  ...props
}) {
  return (
    <Component
      className={`relative z-10 size-7 transition-all duration-200 ${
        isActive ? "scale-110 text-player-accent" : "text-player-foreground"
      } ${className}`}
      strokeWidth={isActive ? "2" : "1.5"}
      {...props}
    />
  );
}