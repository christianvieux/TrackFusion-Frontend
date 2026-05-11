export default function ActiveIndicator({ isActive }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div
        className={`aspect-square h-full rounded-full bg-player-accent transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}