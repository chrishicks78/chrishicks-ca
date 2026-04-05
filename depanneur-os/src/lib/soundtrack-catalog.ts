import type { TrackId } from "./types";

export interface SoundtrackTrack {
  id: TrackId;
  title: string;
  subtitle: string;
  relativePath: string;
}

export const soundtrackTracks: readonly SoundtrackTrack[] = [
  {
    id: "investigation",
    title: "Investigation",
    subtitle: "Calm problem-solving loop",
    relativePath: "/audio/investigation.mp3",
  },
  {
    id: "sunset-drive",
    title: "Konoha Sunset Drive",
    subtitle: "Gentle closeout and reset",
    relativePath: "/audio/01_Konoha_Sunset_Drive.mp3",
  },
];

export function getTrackById(trackId: TrackId | null | undefined) {
  return soundtrackTracks.find((track) => track.id === trackId) ?? null;
}
