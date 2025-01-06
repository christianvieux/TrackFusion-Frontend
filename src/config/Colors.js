// src/app/components/TrackList/Colors.js
// Desc: Colors for the track list

const colorClasses = [
    'default',
    'primary',  // bg-primary would be a custom class in your CSS
    'secondary',
    'success',
    'warning',
    'danger',
    // green: 'green',
    // info: 'bnfo',
    // light: 'light',
    // dark: 'bdark',
];

// Save the original length of the colorClasses array
const originalColorClassLength = colorClasses.length;

const manualColorClasses = {
    instrumental: colorClasses[1],
    song: colorClasses[4],
    angry: colorClasses[5],
    happy: colorClasses[2],
    // 'rock': colorClasses.primary,
    // 'pop': colorClasses.secondary,
    // Add other manual assignments here
};

// Hashing function to convert string to hash
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char; // Bitwise operations
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

// Function to normalize the attribute (e.g., convert to lowercase, trim spaces)
function normalizeAttribute(attribute) {
    return attribute.trim().toLowerCase(); // Normalize to lowercase and remove extra spaces
}

export function getColorForAttribute(attribute) {
    try {
        if (typeof attribute !== 'string') {
            throw new Error('Attribute must be a string');
        }

        // Normalize the attribute string to avoid issues with case or extra spaces
        const normalizedAttribute = normalizeAttribute(attribute);

        // Check if a manual color is assigned first
        if (manualColorClasses[normalizedAttribute]) {
            return manualColorClasses[normalizedAttribute];
        }

        const hash = Math.abs(hashCode(normalizedAttribute)); // Ensure a positive hash
        const colorIndex = hash % originalColorClassLength; // Map to valid index based on the original length

        return colorClasses[colorIndex];
    } catch (error) {
        console.error('Error in getColorForAttribute:', error.message);
        return 'default'; // Return a default color class if something goes wrong
    }
}

export default colorClasses;
