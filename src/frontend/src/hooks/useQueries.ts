import { songsByMood } from "../data/songs";
import type { LocalSong } from "../data/songs";

export type { LocalSong };

export function useGetSongsByMood(mood: string | null): {
  data: LocalSong[];
  isLoading: boolean;
} {
  return {
    data: mood ? songsByMood(mood) : [],
    isLoading: false,
  };
}
