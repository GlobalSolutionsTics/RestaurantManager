import { orderPrimaryButton, orderSecondaryButton } from "./WaiterOrderLayout";
import type { IOrderSlice } from "@/store/slices/orders.slice";
import { groupRenamedDishes } from "@/utils/orderDishNotes";
import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState, type Dispatch } from "react";

type Dishes = IOrderSlice["dishesDescription"];

export default function DishBreakdownDialog({
  dishes,
  onClose,
  onSave,
}: {
  dishes: Dishes;
  onClose: () => void;
  onSave: Dispatch<Dishes>;
}) {
  const [units, setUnits] = useState(() =>
    dishes.flatMap((dish) =>
      Array.from({ length: dish.number ?? 0 }, () => ({ ...dish, number: 1 })),
    ),
  );
  const valid = units.length > 0 && units.every((dish) => dish.name.trim());
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth='md'
      aria-labelledby='dish-breakdown-title'
    >
      <DialogTitle id='dish-breakdown-title'>Desglosar platillos</DialogTitle>
      <DialogContent>
        <form
          className='space-y-4 pt-2'
          onSubmit={(event) => {
            event.preventDefault();
            if (valid)
              onSave(
                groupRenamedDishes(
                  units.map((dish) => ({ ...dish, name: dish.name.trim() })),
                ),
              );
          }}
        >
          <div className='flex gap-3 overflow-x-auto pb-2'>
            {units.map((dish, index) => (
              <section
                key={index}
                className='w-56 shrink-0 space-y-2 rounded-xl border border-slate-200 p-3'
              >
                <h3 className='break-words text-sm font-semibold'>
                  {dishes.length > 0 ? `Platillo ${index + 1}` : "Platillo"}
                </h3>
                <TextField
                  label='Título'
                  size='small'
                  fullWidth
                  autoFocus={index === 0}
                  value={dish.name}
                  required
                  onChange={(event) => {
                    const name = event.target.value;
                    setUnits((current) =>
                      current.map((unit, position) =>
                        position === index ? { ...unit, name } : unit,
                      ),
                    );
                  }}
                />
              </section>
            ))}
          </div>
          <div className='flex flex-wrap justify-end gap-2'>
            <button
              type='button'
              className={orderSecondaryButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className={orderPrimaryButton}
              disabled={!valid}
            >
              Actualizar platillos
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
