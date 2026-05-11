import React from "react";

const messageStyles = {
  success: "text-success",
  error: "text-danger",
};

export default function FormMessage({ type = "success", children }) {
  if (!children) return null;

  return (
    <p className={`text-center text-sm ${messageStyles[type]}`}>
      {children}
    </p>
  );
}