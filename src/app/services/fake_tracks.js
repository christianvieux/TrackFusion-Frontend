// Define the ENUM values as arrays (from your ENUM types)
const genres = [
    'Rock', 'Pop', 'Jazz', 'Hip-Hop', 'Rap', 'R&B', 'Electronic/Dance', 'Indie', 'Country', 
    'Reggae', 'Blues', 'Folk', 'Classical', 'Metal', 'Alternative', 'Latin', 'World Music', 
    'K-Pop', 'Gospel', 'Punk', 'Ska', 'Synthpop', 'Trap'
  ];
  
  const moods = [
    'Happy', 'Sad', 'Angry', 'Calm', 'Excited', 'Chill', 'Romantic', 'Nostalgic', 'Energetic', 
    'Melancholic', 'Motivated', 'Relaxed', 'Pensive', 'Joyful', 'Mellow', 'Playful', 'Intense', 
    'Dreamy', 'Hopeful', 'Bouncy', 'Dramatic'
  ];
  
  const categories = [
    'Sound Effect', 'Song', 'Instrumental', 'Ambient', 'Vocal', 'Podcast', 'Remix'
  ];
  
  const soundTypes = [
    'mp3', 'ogg', 'wav', 'other'
  ];
  
  // Utility function to generate random values from arrays
  function getRandomValues(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Generate 100 randomized tracks
  function generateTracks() {
    const tracks = [];
  
    for (let i = 1; i <= 100; i++) {
      const numGenres = Math.floor(Math.random() * 5) + 1; // Random between 1 and 5 genres
      const numMoods = Math.floor(Math.random() * 5) + 1; // Random between 1 and 5 moods
  
      const randomGenres = getRandomValues(genres, numGenres);
      const randomMoods = getRandomValues(moods, numMoods);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomSoundType = soundTypes[Math.floor(Math.random() * soundTypes.length)];
  
      const track = {
        name: `Track ${i}`,
        description: `This is a randomly generated track description for track ${i}.`,
        creator_id: Math.floor(Math.random() * 10) + 1, // Random creator ID between 1 and 10
        created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000), // Random date within the last year
        bpm: Math.floor(Math.random() * (180 - 60 + 1)) + 60, // Random BPM between 60 and 180
        musical_key: Math.random() > 0.5 ? 'C' : 'G', // Random key: C or G
        is_private: Math.random() > 0.5, // Random private flag
        genre: `{${randomGenres.join(', ')}}`, // Random genres
        mood: `{${randomMoods.join(', ')}}`, // Random moods
        sound_type: randomSoundType,
        url: `https://example.com/track_${i}`,
        duration: `${String(Math.floor(Math.random() * 4) + 2).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, // Random duration (MM:SS)
        updated_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000), // Random updated time (close to created_at)
        artist: `Artist ${Math.floor(Math.random() * 10) + 1}`, // Random artist name
        category: randomCategory
      };
  
      tracks.push(track);
    }
  
    return tracks;
  }
  
  // Export the function that generates the tracks
export default generateTracks;
  