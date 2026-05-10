export const DEFAULT_AVATAR = "/images/default-avatar.jpg";

export function formatJoinDate(date) {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString();
}