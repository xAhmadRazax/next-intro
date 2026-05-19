// components/forms/FormField.tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  className?: string
  type?: string
  placeholder?: string
  required?: boolean
  min?: number
  defaultValue?: string | number
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

export const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  min,
  defaultValue,
  value,
  onChange,
  className,
  disabled,
}: FormFieldProps) => {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        min={min}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "block rounded-sm px-2 py-2 text-base ring-1 ring-primary/40 outline-none focus-visible:ring-primary/80",
          className
        )}
        required={required}
      />
    </Field>
  )
}
