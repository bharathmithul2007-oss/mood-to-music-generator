interface MusicVisualizerProps {
  isPlaying: boolean;
  color?: string;
}

export function MusicVisualizer({
  isPlaying,
  color = "#00e5ff",
}: MusicVisualizerProps) {
  const bars = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex items-end gap-[3px] h-10">
      {bars.map((i) => (
        <div
          key={i}
          className={`w-[4px] rounded-full transition-all ${isPlaying ? `viz-bar-${i}` : ""}`}
          style={{
            height: isPlaying ? undefined : "6px",
            backgroundColor: color,
            boxShadow: isPlaying ? `0 0 6px ${color}` : "none",
            minHeight: "6px",
          }}
        />
      ))}
    </div>
  );
}
