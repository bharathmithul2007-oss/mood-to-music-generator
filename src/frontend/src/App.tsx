import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CloudRain,
  Flame,
  Heart,
  Moon,
  Music2,
  Radio,
  Search,
  Sun,
  Target,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { MusicPlayer } from "./components/MusicPlayer";
import type { LocalSong } from "./data/songs";
import { useGetSongsByMood } from "./hooks/useQueries";

const MOODS = [
  {
    id: "happy",
    label: "Happy",
    icon: Sun,
    color: "#ffd700",
    glow: "#ffd70066",
    keywords: ["happy", "joyful", "excited", "joy", "cheerful", "elated"],
  },
  {
    id: "sad",
    label: "Sad",
    icon: CloudRain,
    color: "#60a5fa",
    glow: "#60a5fa66",
    keywords: ["sad", "down", "depressed", "unhappy", "gloomy", "cry"],
  },
  {
    id: "energetic",
    label: "Energetic",
    icon: Zap,
    color: "#fb923c",
    glow: "#fb923c66",
    keywords: ["energetic", "pumped", "workout", "energy", "active", "hype"],
  },
  {
    id: "calm",
    label: "Relax",
    icon: Waves,
    color: "#2dd4bf",
    glow: "#2dd4bf66",
    keywords: ["calm", "relax", "chill", "peaceful", "serene", "quiet"],
  },
  {
    id: "romantic",
    label: "Romantic",
    icon: Heart,
    color: "#f472b6",
    glow: "#f472b666",
    keywords: ["romantic", "love", "crush", "affection", "sweet", "darling"],
  },
  {
    id: "angry",
    label: "Party",
    icon: Flame,
    color: "#ef4444",
    glow: "#ef444466",
    keywords: [
      "angry",
      "party",
      "frustrated",
      "mad",
      "rage",
      "furious",
      "annoyed",
    ],
  },
  {
    id: "focused",
    label: "Motivational",
    icon: Target,
    color: "#a855f7",
    glow: "#a855f766",
    keywords: [
      "focus",
      "study",
      "work",
      "concentrate",
      "productive",
      "focused",
      "motivat",
    ],
  },
  {
    id: "melancholic",
    label: "Focus",
    icon: Moon,
    color: "#818cf8",
    glow: "#818cf866",
    keywords: ["melancholic", "nostalgic", "bittersweet", "wistful", "longing"],
  },
];

const LANGUAGES = [
  "All",
  "Tamil",
  "English",
  "Hindi",
  "Telugu",
  "Malayalam",
  "Kannada",
];

const LANG_COLORS: Record<string, string> = {
  Tamil: "#ff6b9d",
  English: "#00e5ff",
  Hindi: "#ffd700",
  Telugu: "#7c3aed",
  Malayalam: "#22d3ee",
  Kannada: "#f97316",
};

function detectMoodFromText(text: string): string | null {
  const lower = text.toLowerCase();
  for (const mood of MOODS) {
    if (mood.keywords.some((kw) => lower.includes(kw))) {
      return mood.id;
    }
  }
  return null;
}

function SongCardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <Skeleton
        className="w-12 h-12 rounded-lg flex-shrink-0"
        style={{ background: "oklch(0.2 0.03 260)" }}
      />
      <div className="flex-1 space-y-2">
        <Skeleton
          className="h-4 w-3/4"
          style={{ background: "oklch(0.2 0.03 260)" }}
        />
        <Skeleton
          className="h-3 w-1/2"
          style={{ background: "oklch(0.18 0.02 260)" }}
        />
      </div>
      <Skeleton
        className="w-8 h-8 rounded-full"
        style={{ background: "oklch(0.2 0.03 260)" }}
      />
    </div>
  );
}

export default function App() {
  const [moodText, setMoodText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("All");
  const [currentSong, setCurrentSong] = useState<LocalSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: songs = [], isLoading } = useGetSongsByMood(selectedMood);

  const sortedAndFilteredSongs = useMemo(() => {
    let filtered = songs;
    if (activeLanguage !== "All") {
      filtered = songs.filter((s) => s.language === activeLanguage);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [songs, activeLanguage, searchQuery]);

  const handleDetectMood = () => {
    if (!moodText.trim()) return;
    const mood = detectMoodFromText(moodText);
    if (mood) {
      setDetectedMood(mood);
      setSelectedMood(mood);
      setActiveLanguage("All");
      setSearchQuery("");
    } else {
      setDetectedMood("unknown");
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setDetectedMood(null);
    setActiveLanguage("All");
    setCurrentSong(null);
    setIsPlaying(false);
    setSearchQuery("");
  };

  const handlePlaySong = (song: LocalSong, index: number) => {
    if (currentSong?.id === song.id) {
      setIsPlaying((p) => !p);
    } else {
      setCurrentSong(song);
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (sortedAndFilteredSongs.length === 0) return;
    const next = (currentIndex + 1) % sortedAndFilteredSongs.length;
    setCurrentSong(sortedAndFilteredSongs[next]);
    setCurrentIndex(next);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (sortedAndFilteredSongs.length === 0) return;
    const prev =
      (currentIndex - 1 + sortedAndFilteredSongs.length) %
      sortedAndFilteredSongs.length;
    setCurrentSong(sortedAndFilteredSongs[prev]);
    setCurrentIndex(prev);
    setIsPlaying(true);
  };

  const currentMoodData = MOODS.find((m) => m.id === selectedMood);
  const detectedMoodData = MOODS.find((m) => m.id === detectedMood);

  return (
    <div className="min-h-screen font-body" style={{ background: "#080810" }}>
      {/* Hero background */}
      <div
        className="absolute inset-0 h-80 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/assets/generated/hero-music-bg.dim_1600x400.jpg)",
        }}
      />
      <div
        className="absolute inset-0 h-80"
        style={{
          background:
            "linear-gradient(to bottom, transparent 40%, #080810 100%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-10 pb-6 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Radio
              className="w-8 h-8 neon-pulse"
              style={{ color: "oklch(0.82 0.18 195)" }}
            />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
              Mood-to-Music
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-body">
            Discover songs that match your soul — Tamil, English, Hindi & more
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-32 space-y-8">
        {/* Mood Text Detection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Search
              className="w-4 h-4"
              style={{ color: "oklch(0.82 0.18 195)" }}
            />
            <h2 className="font-display font-semibold text-white">
              How are you feeling?
            </h2>
          </div>
          <div className="flex gap-3">
            <Input
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDetectMood()}
              placeholder="e.g. I'm feeling happy and energetic today..."
              className="flex-1 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-neon-cyan focus-visible:ring-0"
              data-ocid="mood.input"
            />
            <Button
              onClick={handleDetectMood}
              disabled={!moodText.trim()}
              className="font-semibold px-5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.18 195), oklch(0.68 0.24 295))",
                boxShadow: "0 0 20px oklch(0.82 0.18 195 / 0.3)",
                color: "#080810",
              }}
              data-ocid="mood.primary_button"
            >
              Detect Mood
            </Button>
          </div>
          <AnimatePresence>
            {detectedMood && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {detectedMood === "unknown" ? (
                  <Badge className="bg-white/10 text-muted-foreground border-0">
                    Could not detect mood — try being more specific
                  </Badge>
                ) : detectedMoodData ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Detected mood:
                    </span>
                    <Badge
                      className="font-semibold border-0"
                      style={{
                        background: `${detectedMoodData.color}22`,
                        color: detectedMoodData.color,
                      }}
                    >
                      <detectedMoodData.icon className="w-3 h-3 mr-1" />
                      {detectedMoodData.label}
                    </Badge>
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Mood Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-widest">
              Or choose a mood
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOODS.map((mood, i) => {
              const Icon = mood.icon;
              const isActive = selectedMood === mood.id;
              return (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleMoodSelect(mood.id)}
                  className="relative glass rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer group"
                  style={
                    isActive
                      ? {
                          border: `1px solid ${mood.color}66`,
                          boxShadow: `0 0 20px ${mood.glow}, 0 0 40px ${mood.color}22`,
                          background: `${mood.color}11`,
                        }
                      : {
                          border: "1px solid oklch(0.22 0.04 250 / 0.5)",
                        }
                  }
                  data-ocid={`mood.card.${i + 1}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${mood.color}22`,
                      boxShadow: isActive ? `0 0 15px ${mood.color}66` : "none",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: mood.color }} />
                  </div>
                  <span
                    className="font-display font-semibold text-sm"
                    style={{
                      color: isActive ? mood.color : "oklch(0.8 0.02 200)",
                    }}
                  >
                    {mood.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Songs Section */}
        <AnimatePresence mode="wait">
          {selectedMood && (
            <motion.section
              key={selectedMood}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Language Tabs */}
              <div className="mb-4">
                <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                  <TabsList className="bg-white/5 border border-white/10 h-auto p-1 flex-wrap gap-1 w-full sm:w-auto">
                    {LANGUAGES.map((lang) => (
                      <TabsTrigger
                        key={lang}
                        value={lang}
                        className="text-xs font-semibold text-white data-[state=active]:text-foreground rounded-md"
                        style={{
                          ...(activeLanguage === lang && lang !== "All"
                            ? {
                                background: `${LANG_COLORS[lang] || "#00e5ff"}22`,
                                color: LANG_COLORS[lang] || "#00e5ff",
                              }
                            : {}),
                        }}
                        data-ocid="language.tab"
                      >
                        {lang}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Search Bar */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by song name or artist..."
                  className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-neon-cyan focus-visible:ring-0"
                  data-ocid="song.search_input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Song Header */}
              {currentMoodData && (
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${currentMoodData.color}22` }}
                  >
                    <currentMoodData.icon
                      className="w-4 h-4"
                      style={{ color: currentMoodData.color }}
                    />
                  </div>
                  <h2
                    className="font-display font-bold text-lg"
                    style={{ color: currentMoodData.color }}
                  >
                    {currentMoodData.label} Vibes
                  </h2>
                  {!isLoading && (
                    <Badge className="bg-white/10 text-muted-foreground border-0 text-xs">
                      {sortedAndFilteredSongs.length} songs
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge
                      className="border-0 text-xs"
                      style={{
                        background: "oklch(0.82 0.18 195 / 0.15)",
                        color: "oklch(0.82 0.18 195)",
                      }}
                    >
                      Search: &ldquo;{searchQuery}&rdquo;
                    </Badge>
                  )}
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="space-y-3" data-ocid="song.loading_state">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SongCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && sortedAndFilteredSongs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
                  data-ocid="song.empty_state"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.82 0.18 195 / 0.1)",
                      border: "1px solid oklch(0.82 0.18 195 / 0.3)",
                    }}
                  >
                    <Music2
                      className="w-7 h-7"
                      style={{ color: "oklch(0.82 0.18 195)" }}
                    />
                  </div>
                  <p className="font-display font-semibold text-foreground">
                    No songs found
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {searchQuery
                      ? `No results for "${searchQuery}" — try a different search term`
                      : "Try a different mood or language filter"}
                  </p>
                  {searchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-white"
                    >
                      Clear search
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Song list */}
              {!isLoading && sortedAndFilteredSongs.length > 0 && (
                <div className="space-y-2" data-ocid="song.list">
                  {sortedAndFilteredSongs.map((song, i) => {
                    const langColor = LANG_COLORS[song.language] || "#00e5ff";
                    const isCurrentPlaying =
                      currentSong?.id === song.id && isPlaying;
                    return (
                      <motion.div
                        key={String(song.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.01, 0.3) }}
                        className="glass rounded-xl p-4 flex items-center gap-4 group transition-all duration-300 hover:border-white/20 cursor-pointer"
                        style={
                          isCurrentPlaying
                            ? {
                                border: `1px solid ${langColor}44`,
                                background: `${langColor}08`,
                                boxShadow: `0 0 20px ${langColor}22`,
                              }
                            : {}
                        }
                        onClick={() => handlePlaySong(song, i)}
                        data-ocid={`song.item.${i + 1}`}
                      >
                        {/* Track number / visualizer */}
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-sm font-bold"
                          style={{
                            background: `${langColor}15`,
                            color: langColor,
                          }}
                        >
                          {isCurrentPlaying ? (
                            <div className="flex items-end gap-[2px] h-5">
                              {[1, 2, 3].map((b) => (
                                <div
                                  key={b}
                                  className={`w-[3px] rounded-full viz-bar-${b}`}
                                  style={{
                                    backgroundColor: langColor,
                                    minHeight: "4px",
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </div>

                        {/* Song info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-white text-sm truncate">
                            {song.title}
                          </p>
                          <p className="text-muted-foreground text-xs truncate">
                            {song.artist}
                          </p>
                          {song.album && (
                            <p className="text-muted-foreground/60 text-xs truncate">
                              {song.album}
                            </p>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          <Badge
                            className="text-xs border-0 font-medium"
                            style={{
                              background: `${langColor}22`,
                              color: langColor,
                            }}
                          >
                            {song.language}
                          </Badge>
                          <Badge className="text-xs bg-white/5 text-muted-foreground border-white/10">
                            {song.genre}
                          </Badge>
                        </div>

                        {/* Year badge */}
                        <span className="text-xs text-muted-foreground flex-shrink-0 font-mono hidden sm:block">
                          {song.year}
                        </span>

                        {/* Duration */}
                        <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">
                          {song.duration}
                        </span>

                        {/* Play button — always visible */}
                        <Button
                          size="icon"
                          className="w-8 h-8 rounded-full flex-shrink-0 transition-all"
                          style={{
                            background: isCurrentPlaying
                              ? `${langColor}33`
                              : `${langColor}22`,
                            color: langColor,
                            boxShadow: isCurrentPlaying
                              ? `0 0 12px ${langColor}66`
                              : "none",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySong(song, i);
                          }}
                          data-ocid={`song.button.${i + 1}`}
                        >
                          {isCurrentPlaying ? (
                            <div className="w-2 h-2 flex gap-[2px]">
                              <div
                                className="w-[3px] h-full rounded-sm"
                                style={{ background: langColor }}
                              />
                              <div
                                className="w-[3px] h-full rounded-sm"
                                style={{ background: langColor }}
                              />
                            </div>
                          ) : (
                            <svg
                              role="img"
                              aria-label="Play"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3 h-3 ml-0.5"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Welcome state (no mood selected) */}
        {!selectedMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
          >
            <div className="flex items-center gap-3">
              {MOODS.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `${m.color}22`,
                    border: `1px solid ${m.color}44`,
                  }}
                >
                  <m.icon className="w-5 h-5" style={{ color: m.color }} />
                </div>
              ))}
            </div>
            <p className="font-display font-bold text-xl gradient-text-2">
              Find your soundtrack
            </p>
            <p className="text-muted-foreground text-sm max-w-sm">
              Type how you feel or click a mood card to discover music curated
              for your moment
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-muted-foreground text-xs border-t border-white/5">
        © {new Date().getFullYear()}. Built with{" "}
        <span style={{ color: "oklch(0.72 0.22 330)" }}>♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="hover:text-foreground transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Music Player */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
