import { useRef, useState, type FormEvent } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { StatusEnum } from "@/enums/states.enum";
import { updateDinersDivisionService } from "@/services/order";
import type { TResponseOrders } from "@/types/menu.types";
import { currencyFormat } from "@/utils/formats";
import { getOrderDishKey, groupOrderDishes } from "@/utils/groupOrderDishes";
import { TOKEN_ID } from "@/utils/strings";

type Quantities = Record<string, number>;
type Selections = Record<number, Quantities>;

function savedSelections(order: TResponseOrders): Selections {
  return Object.fromEntries(
    (order.dinersDivisionTotal ?? []).map(({ diner, dishes }) => [
      diner,
      Object.fromEntries(
        dishes.map((dish) => [getOrderDishKey(dish), dish.number]),
      ),
    ]),
  );
}

export default function DinersDivisionForm({
  order,
}: {
  order: TResponseOrders;
}) {
  const storedDiners = Number(order.diners);
  const hasDiners = Number.isSafeInteger(storedDiners) && storedDiners > 0;
  const [count, setCount] = useState("");
  const [selectedDiner, setSelectedDiner] = useState(1);
  const [selections, setSelections] = useState<Selections>(() =>
    savedSelections(order),
  );
  const [message, setMessage] = useState<{ error: boolean; message: string }>();
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);

  const diners = hasDiners ? storedDiners : Number(count);
  const validCount = Number.isSafeInteger(diners) && diners > 0;
  const diner = validCount ? Math.min(selectedDiner, diners) : 1;
  const dishes = groupOrderDishes(order.dishesDescription).filter(
    (dish) => dish.number > 0,
  );
  const dishByKey = new Map(dishes.map((dish) => [dish.key, dish]));
  const quantities = selections[diner] ?? {};
  const allocations = Object.entries(selections)
    .filter(([id]) => Number(id) <= diners)
    .map(([id, selected]) => ({
      diner: Number(id),
      dishes: Object.entries(selected)
        .filter(([, number]) => number > 0)
        .map(([key, number]) => ({ key, number })),
    }))
    .filter((allocation) => allocation.dishes.length > 0);

  const assigned = new Map<string, number>();
  const totals = new Map<number, number>();
  let invalidSelection = false;
  for (const allocation of allocations) {
    let total = 0;
    for (const { key, number } of allocation.dishes) {
      const dish = dishByKey.get(key);
      const unitsAssigned = (assigned.get(key) ?? 0) + number;
      assigned.set(key, unitsAssigned);
      if (!dish || unitsAssigned > dish.number) invalidSelection = true;
      if (dish) total += Math.round(dish.price * 100) * number;
    }
    totals.set(allocation.diner, total / 100);
  }

  const readOnly =
    order.status === StatusEnum.CLOSED || order.status === StatusEnum.CANCELED;

  const changeQuantity = (key: string, number: number, available: number) => {
    if (
      !Number.isSafeInteger(number) ||
      number < 0 ||
      (number > available && number > (quantities[key] ?? 0))
    )
      return;
    setMessage(undefined);
    setSelections((previous) => ({
      ...previous,
      [diner]: { ...previous[diner], [key]: number },
    }));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validCount || readOnly || invalidSelection || inFlight.current) return;

    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) {
      setMessage({
        error: true,
        message: "Inicia sesión para guardar la división.",
      });
      return;
    }

    inFlight.current = true;
    setSaving(true);
    setMessage(undefined);
    try {
      setMessage(
        await updateDinersDivisionService(token, order.uuid, {
          diners,
          allocations,
        }),
      );
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className='my-4 space-y-4 rounded-lg border border-neutral-200 p-4'
    >
      {!hasDiners && (
        <TextField
          label='Número de comensales'
          type='number'
          size='small'
          value={count}
          inputProps={{ min: 1, step: 1 }}
          required
          disabled={saving || readOnly}
          onChange={(event) => {
            setCount(event.target.value);
            setMessage(undefined);
          }}
        />
      )}
      {validCount && (
        <>
          <label className='flex flex-wrap items-center justify-between gap-2 font-semibold'>
            Comensal
            {diners > 1000 ? (
              <input
                className='w-32 rounded border border-neutral-300 p-2'
                type='number'
                min={1}
                max={diners}
                step={1}
                defaultValue={diner}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isSafeInteger(next) && next >= 1 && next <= diners)
                    setSelectedDiner(next);
                }}
              />
            ) : (
              <select
                className='rounded border border-neutral-300 p-2'
                value={diner}
                onChange={(event) =>
                  setSelectedDiner(Number(event.target.value))
                }
              >
                {Array.from({ length: diners }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Comensal {index + 1} ·{" "}
                    {currencyFormat(totals.get(index + 1) ?? 0)}
                  </option>
                ))}
              </select>
            )}
          </label>

          <ul className='divide-y divide-neutral-200'>
            {dishes.map((dish) => {
              const quantity = quantities[dish.key] ?? 0;
              const available =
                dish.number - (assigned.get(dish.key) ?? 0) + quantity;
              return (
                <li key={dish.key} className='py-2'>
                  <label className='flex items-center justify-between gap-4'>
                    <span>
                      {dish.name}
                      <span className='block text-sm text-neutral-600'>
                        {currencyFormat(dish.price)} c/u ·{" "}
                        {Math.max(0, available)} disponibles
                      </span>
                    </span>
                    {dish.number === 1 && quantity <= 1 ? (
                      <input
                        type='checkbox'
                        checked={quantity > 0}
                        disabled={
                          saving || readOnly || (available < 1 && !quantity)
                        }
                        onChange={(event) =>
                          changeQuantity(
                            dish.key,
                            Number(event.target.checked),
                            available,
                          )
                        }
                      />
                    ) : (
                      <input
                        className='w-20 rounded border border-neutral-300 p-2'
                        type='number'
                        min={0}
                        max={Math.max(0, available)}
                        step={1}
                        inputMode='numeric'
                        value={quantity}
                        disabled={
                          saving || readOnly || (available < 1 && !quantity)
                        }
                        onChange={(event) =>
                          changeQuantity(
                            dish.key,
                            Number(event.target.value),
                            available,
                          )
                        }
                      />
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
          <p className='text-right font-semibold'>
            Total del comensal {diner} ·{" "}
            {currencyFormat(totals.get(diner) ?? 0)}
          </p>
        </>
      )}
      {invalidSelection && (
        <Alert severity='warning'>
          Hay cantidades que ya no están disponibles. Revisa las asignaciones.
          <Button
            onClick={() => setSelections({})}
            disabled={saving || readOnly}
          >
            Limpiar asignaciones
          </Button>
        </Alert>
      )}
      {message && (
        <Alert severity={message.error ? "error" : "success"} role='status'>
          {message.message}
        </Alert>
      )}
      {!readOnly && (
        <button
          type='submit'
          className='rounded bg-blue-dark px-4 py-2 font-secondary font-semibold text-white enabled:hover:bg-blue disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-600'
          disabled={!validCount || invalidSelection || saving}
        >
          {saving ? "Guardando…" : "Actualizar pago"}
        </button>
      )}
    </form>
  );
}
