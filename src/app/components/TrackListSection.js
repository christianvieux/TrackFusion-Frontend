import TrackList from "./TrackList";

export default function TrackListSection({
  trackList,
  setTrackList,
  emptyMessage,
  className = "",
}) {
  return (
    <div className={`min-h-0 h-max overflow-hidden ${className}`}>
      <TrackList
        trackList={trackList}
        setTrackList={setTrackList}
        emptyMessage={emptyMessage}
        className="min-h-0 flex-1"
      />
    </div>
  );
}