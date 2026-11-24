import { MAX_DISH_NOTE_LENGTH } from "@/utils/orderDishNotes";
import { TextField } from "@mui/material";
import type { Dispatch } from "react";

export function VariablePriceLabel() {
  return (
    <span className='inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800'>
      Precio variable
    </span>
  );
}

export function OrderNoteField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: Dispatch<string>;
  disabled?: boolean;
}) {
  return (
    <TextField
      label='Notas de la orden para cocina'
      placeholder='Ej. Sin cebolla o con la salsa aparte'
      size='small'
      fullWidth
      multiline
      value={value}
      disabled={disabled}
      inputProps={{ maxLength: MAX_DISH_NOTE_LENGTH }}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
