import AuthTextField from "./AuthTextField";

export default function AuthPasswordField(props) {
  return (
    <AuthTextField
      type="password"
      autoComplete="current-password"
      {...props}
    />
  );
}