import type { IOrderSlice } from "@/store/slices/orders.slice";
import { VariablePriceLabel } from "./DishReviewFields";
import { currencyFormat } from "@/utils/formats";
import { EditOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useState } from "react";
import {
  orderPanel,
  orderPrimaryButton,
  orderSecondaryButton,
} from "./WaiterOrderLayout";

type OrderDish = IOrderSlice["dishesDescription"][number];
type DishChanges = { name: string; number: number; price: number };

export default function OrderDishLine({
  dish,
  badge,
  editable,
  editing,
  onEdit,
  onCancel,
  onSave,
  lockQuantity,
}: {
  dish: OrderDish;
  badge?: string;
  editable: boolean;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: React.Dispatch<DishChanges>;
  lockQuantity?: boolean;
}) {
  const [name, setName] = useState(dish.name);
  const [quantity, setQuantity] = useState(String(dish.number ?? 0));
  const [price, setPrice] = useState(String(dish.price));
  const [editablePrice] = useState(dish.isUniquePrice || dish.price === 0);
  const number = Number(quantity);
  const amount = Number(price);
  const valid =
    !!name.trim() &&
    quantity !== "" &&
    Number.isSafeInteger(number) &&
    number >= 0 &&
    price !== "" &&
    Number.isFinite(amount) &&
    amount >= 0;

  return (
    <li className={orderPanel}>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='break-words font-semibold'>{dish.name}</h3>
            {dish.isUniquePrice === true && <VariablePriceLabel />}
          </div>
          <p className='text-sm text-slate-600'>
            {dish.number ?? 0} × {currencyFormat(dish.price)}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {badge && (
            <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700'>
              {badge}
            </span>
          )}
          {editable && !editing && (
            <button
              type='button'
              className={orderSecondaryButton}
              aria-label={`Editar ${dish.name}`}
              onClick={() => {
                setName(dish.name);
                setQuantity(String(dish.number ?? 0));
                setPrice(String(dish.price));
                onEdit();
              }}
            >
              <EditOutlined fontSize='small' /> Editar
            </button>
          )}
        </div>
      </div>
      {dish.notes && (
        <p className='mt-3 break-words text-sm text-slate-700'>
          Nota para cocina: {dish.notes}
        </p>
      )}
      {editing && (
        <form
          className='mt-4 space-y-3 border-t border-slate-200 pt-4'
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) onSave({ name: name.trim(), number, price: amount });
          }}
        >
          <div className='grid gap-3 sm:grid-cols-3'>
            <TextField
              label='Nombre del platillo'
              size='small'
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <TextField
              label='Cantidad'
              size='small'
              type='number'
              value={quantity}
              disabled={lockQuantity}
              onChange={(event) => setQuantity(event.target.value)}
              inputProps={{ min: 0, step: 1 }}
              required
            />
            <TextField
              label='Precio unitario'
              size='small'
              type='number'
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputProps={{ min: 0, step: "0.01" }}
              disabled={!editablePrice}
              required={editablePrice}
            />
          </div>
          <div className='flex flex-wrap justify-end gap-2'>
            <button
              type='button'
              className={orderSecondaryButton}
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className={orderPrimaryButton}
              disabled={!valid}
            >
              Aplicar cambios
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
