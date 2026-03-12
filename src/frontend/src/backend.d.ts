import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Song {
    id: bigint;
    moods: Array<string>;
    title: string;
    duration: string;
    language: string;
    genre: string;
    artist: string;
}
export interface backendInterface {
    getAvailableMoods(): Promise<Array<string>>;
    getSongsByLanguage(language: string): Promise<Array<Song>>;
    getSongsByMood(mood: string): Promise<Array<Song>>;
}
