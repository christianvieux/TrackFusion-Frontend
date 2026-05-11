export default function FormMessage({ message, type = "error" }) {
  if (!message) return null;

  const className = type === "success" ? "text-success" : "text-danger";

  return <p className={`text-center text-sm ${className}`}>{message}</p>;
}