import {
  Description,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";

export default function AuthTextField({
  label,
  name,
  type = "text",
  placeholder,
  description,
  value,
  onChange,
  validate,
  isRequired = false,
  autoComplete,
  minLength,
  isDisabled = false,
}) {
  return (
    <TextField
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      validate={validate}
      isRequired={isRequired}
      minLength={minLength}
      isDisabled={isDisabled}
    >
      <Label className="text-sm text-foreground">{label}</Label>

      <Input
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-lg  bg-muted px-3 py-2 text-foreground placeholder:text-muted-foreground"
      />

      {description && (
        <Description className="text-xs text-muted-foreground">
          {description}
        </Description>
      )}

      <FieldError className="text-xs text-danger" />
    </TextField>
  );
}