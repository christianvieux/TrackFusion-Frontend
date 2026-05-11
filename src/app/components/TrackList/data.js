export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "FAVORITE", uid: "age", sortable: true },
  { name: "ARTIST", uid: "role", sortable: true },
  { name: "GENRE", uid: "team" },
  { name: "MOOD", uid: "email" },
  { name: "DURATION", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export const tracks = [
  {
    id: 1,
    name: "Whispers of Dawn",
    artist: "Luna S.",
    genre: "Ambient",
    mood: "Calm",
    duration: "3:45",
    actions: "Play",
    url: "./sounds/Track_1.ogg",
  },
  {
    id: 2,
    name: "Electric Dreams",
    artist: "DJ Pulse",
    genre: "Electronic",
    mood: "Energetic",
    duration: "4:20",
    actions: "Play",
    url: "./sounds/Track_2.mp3",
  },
  {
    id: 3,
    name: "Serenade in Blue",
    artist: "The Harmony Group",
    genre: "Jazz",
    mood: "Relaxed",
    duration: "5:10",
    actions: "Play",
    url: "./sounds/Track_3.mp3",
  },
];