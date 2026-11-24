import type { Dispatch } from "react";
import type { KitchenType } from "@/types/kitchen.types";

type KitchenSelectProps = {
  kitchens: KitchenType[];
  value: string;
  onChange: Dispatch<string>;
  disabled?: boolean;
  label: string;
};

export function KitchenSelect({
  kitchens,
  value,
  onChange,
  disabled,
  label,
}: KitchenSelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className='w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:text-slate-600'
    >
      <option value=''>Todas las cocinas</option>
      {value && !kitchens.some(({ id }) => id === value) && (
        <option value={value}>Cocina asignada ({value})</option>
      )}
      {kitchens.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  );
}
