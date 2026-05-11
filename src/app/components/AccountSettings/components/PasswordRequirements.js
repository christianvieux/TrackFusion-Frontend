const REQUIREMENTS = [
  { key: "minLength", label: "Minimum 8 characters" },
  { key: "hasLowercase", label: "At least one lowercase character" },
  { key: "hasUppercase", label: "At least one uppercase character" },
  { key: "notSameAsCurrent", label: "Can't be the same as the previous password" },
];

export default function PasswordRequirements({ requirements }) {
  return (
    <aside
      id="Requirements"
      className="w-80 rounded-lg bg-muted p-4"
    >
      <h3 className="mb-2 font-bold text-primary">Password requirements</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Keep the password simple enough to remember, but not easy to guess.
      </p>
      <ul className="space-y-1.5 text-sm">
        {REQUIREMENTS.map((requirement) => {
          const isValid = requirements[requirement.key];
          return (
            <li key={requirement.key} className={`flex items-center gap-2 ${isValid ? "text-success" : "text-muted-foreground"}`}>
              <span className={`size-1.5 shrink-0 rounded-full ${isValid ? "bg-success" : "bg-muted-foreground"}`} />
              {requirement.label}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}