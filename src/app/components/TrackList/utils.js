import { getColorForAttribute } from "../../../config/Colors";

export function getTrackKey(track, fallbackKey) {
  return track.uniqueId ?? track.id ?? fallbackKey;
}

export function parseAttributes(attributes = "") {
  return String(attributes)
    .replace(/[{}]/g, "")
    .split(",")
    .map((attribute) => attribute.trim())
    .filter(Boolean);
}

export function sortAttributesByColor(attributes = []) {
  return [...attributes].sort((a, b) =>
    getColorForAttribute(a).localeCompare(getColorForAttribute(b))
  );
}

export function getSortedAttributes(attributes = "") {
  return sortAttributesByColor(parseAttributes(attributes));
}

export function trackMatchesFilters(track, includes = {}, excludes = {}) {
  return Object.keys(includes).every((type) => {
    const includeValues = includes[type] || [];
    const excludeValues = excludes[type] || [];
    const trackValue = String(track[type] || "").toLowerCase();

    return (
      includeValues.every((value) => trackValue.includes(value.toLowerCase())) &&
      !excludeValues.some((value) => trackValue.includes(value.toLowerCase()))
    );
  });
}

export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}