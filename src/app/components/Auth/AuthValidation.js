export function validateEmail(value = "") {
  if (!value.trim()) return "Email is required";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email";
  }

  return null;
}

export function validateRequired(value = "", label = "Field") {
  if (!String(value).trim()) return `${label} is required`;
  return null;
}

export function validatePassword(value = "") {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validatePasswordsMatch(password, confirmPassword) {
  if (!confirmPassword) return "Confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}