const columns = [
    {name: "NAME", uid: "name", sortable: true},
    {name: "FAVORITE", uid: "age", sortable: true},
    {name: "ARTIST", uid: "role", sortable: true},
    {name: "GENRE", uid: "team"},
    {name: "MOOD", uid: "email"},
    {name: "DURATION", uid: "status", sortable: true},
    {name: "ACTIONS", uid: "actions"},
  ];

  // {["NAME", "FAVORITE", "ARTIST", "GENRE", "MOOD", "DURATION", "OPTIONS",].map((text, index) => (

  
  const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "Paused", uid: "paused"},
    {name: "Vacation", uid: "vacation"},
  ];
  
  const tracks = [
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
    {
      id: 4,
      name: "Midnight Shadows",
      artist: "Avery Ray",
      genre: "Rock",
      mood: "Mysterious",
      duration: "4:05",
      actions: "Play",
      url: "./sounds/Track_4.mp3",
    },
    {
      id: 5,
      name: "Rhythm of the Night",
      artist: "Beats by K",
      genre: "Dance",
      mood: "Upbeat",
      duration: "3:50",
      actions: "Play",
      url: "./sounds/Track_5.mp3",
    },
    {
      id: 6,
      name: "Echoes",
      artist: "S. R. Beats",
      genre: "Hip-Hop",
      mood: "Chill",
      duration: "4:30",
      actions: "Play",
      url: "./sounds/Track_6.mp3",
    },
    {
      id: 7,
      name: "A New Dawn",
      artist: "Celestial Vibes",
      genre: "Classical",
      mood: "Inspiring",
      duration: "5:00",
      actions: "Play",
      url: "./sounds/Track_7.mp3",
    },
    {
      id: 8,
      name: "Fleeting Moments",
      artist: "Indigo",
      genre: "Pop",
      mood: "Happy",
      duration: "3:35",
      actions: "Play",
      url: "./sounds/Track_8.mp3",
    },
    {
      id: 9,
      name: "Journey's End",
      artist: "V. Nightingale",
      genre: "Folk",
      mood: "Reflective",
      duration: "4:15",
      actions: "Play",
      url: "./sounds/Track_9.mp3",
    },
  ];
  
  export {columns, tracks, statusOptions};