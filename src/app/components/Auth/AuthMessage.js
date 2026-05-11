export default function AuthMessage({ message, type = "danger" }) {
  if (!message) return null;

  const colorClass = type === "success" ? "text-success" : "text-danger";

  return <p className={`text-center text-sm ${colorClass}`}>{message}</p>;
}