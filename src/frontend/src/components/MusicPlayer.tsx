import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LocalSong } from "../data/songs";
import { MusicVisualizer } from "./MusicVisualizer";

const LANG_COLORS: Record<string, string> = {
  Tamil: "#ff6b9d",
  English: "#00e5ff",
  Hindi: "#ffd700",
  Telugu: "#7c3aed",
  Malayalam: "#22d3ee",
  Kannada: "#f97316",
};

interface MusicPlayerProps {
  currentSong: LocalSong | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function formatTime(secs: number): string {
  if (!Number.isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MusicPlayer({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onNextRef = useRef(onNext);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => onNextRef.current();
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.src = currentSong.streamUrl;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const seekTo = ratio * duration;
    audio.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  const handleSeekKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    if (e.key === "ArrowRight") {
      audio.currentTime = Math.min(audio.currentTime + 5, duration);
    } else if (e.key === "ArrowLeft") {
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }
  };

  if (!currentSong) return null;

  const langColor = LANG_COLORS[currentSong.language] || "#00e5ff";
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${langColor}33, ${langColor}11)`,
              border: `1px solid ${langColor}44`,
            }}
          >
            <Music2 className="w-5 h-5" style={{ color: langColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-white truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentSong.artist}
            </p>
            {currentSong.album && (
              <p className="text-xs text-muted-foreground/50 truncate hidden sm:block">
                {currentSong.album} · {currentSong.year}
              </p>
            )}
          </div>
          <Badge
            className="hidden sm:flex flex-shrink-0 text-xs border-0 font-semibold"
            style={{ background: `${langColor}22`, color: langColor }}
          >
            {currentSong.language}
          </Badge>
          {/* YouTube Music link */}
          <a
            href={currentSong.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex flex-shrink-0 items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors hover:bg-white/10"
            style={{ color: "#ff0000", opacity: 0.8 }}
            title="Listen on YouTube Music"
            data-ocid="player.secondary_button"
          >
            <ExternalLink className="w-3 h-3" />
            <span>YouTube</span>
          </a>
        </div>

        {/* Visualizer */}
        <div className="hidden md:flex">
          <MusicVisualizer isPlaying={isPlaying} color={langColor} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-foreground"
            onClick={onPrev}
            data-ocid="player.prev_button"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="w-10 h-10 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${langColor}, ${langColor}88)`,
              boxShadow: `0 0 15px ${langColor}66`,
            }}
            onClick={onTogglePlay}
            data-ocid="player.toggle"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-foreground"
            onClick={onNext}
            data-ocid="player.next_button"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-xs hidden lg:flex flex-col gap-1">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled via onKeyDown */}
          <div
            className="h-1.5 rounded-full overflow-hidden cursor-pointer"
            style={{ background: `${langColor}22` }}
            onClick={handleSeek}
            onKeyDown={handleSeekKey}
            role="slider"
            tabIndex={0}
            aria-label="Song progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            data-ocid="player.canvas_target"
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${langColor}, ${langColor}88)`,
                boxShadow: `0 0 6px ${langColor}`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>
              {duration > 0 ? formatTime(duration) : currentSong.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
