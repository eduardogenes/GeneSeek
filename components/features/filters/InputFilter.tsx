// components/features/filters/InputFilter.tsx
'use client';

interface InputFilterProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
}

/**
 * Um componente de filtro genérico que renderiza um label e um input.
 */
export function InputFilter({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: InputFilterProps) {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 bg-background border rounded-md text-sm"
      />
    </div>
  );
}