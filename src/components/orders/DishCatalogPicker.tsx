import { getDishCatalog } from "@/services/dishes";
import type { DishCatalogCategory, TMenuResponse } from "@/types/menu.types";
import type { IOrderSlice } from "@/store/slices/orders.slice";
import { currencyFormat } from "@/utils/formats";
import { AddRounded, RemoveRounded, SearchRounded } from "@mui/icons-material";
import { useEffect, useState, type Dispatch } from "react";

const quantityButton =
  "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-blue-dark hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:text-slate-400";

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function dishKey(dish: TMenuResponse) {
  return JSON.stringify([
    dish.type,
    dish.uuid || dish.name,
    dish.uuid ? null : dish.price,
  ]);
}

type Selection = IOrderSlice["dishesDescription"];

export default function DishCatalogPicker({
  selection,
  onChange,
}: {
  selection: Selection;
  onChange: Dispatch<Selection>;
}) {
  const [catalog, setCatalog] = useState<DishCatalogCategory[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getDishCatalog(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setCatalog(data);
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const quantities = new Map<string, number>();
  const selectedItems = new Map<string, TMenuResponse>();
  for (const dish of selection) {
    const key = dishKey(dish);
    quantities.set(key, (quantities.get(key) ?? 0) + (dish.number ?? 0));
    if (!selectedItems.has(key)) selectedItems.set(key, dish);
  }
  const search = normalizeSearch(query);
  const categories = catalog
    .filter(({ id }) => showSelected || !categoryId || id === categoryId)
    .map((category) => ({
      ...category,
      dishes: showSelected
        ? Array.from(selectedItems.values()).filter(
            (dish) => dish.type === category.id,
          )
        : category.dishes.filter((dish) =>
            normalizeSearch(dish.name).includes(search),
          ),
    }))
    .filter(({ dishes }) => dishes.length > 0);
  const changeQuantity = (
    dish: TMenuResponse & { notes?: string },
    delta: number,
  ) => {
    const key = dishKey(dish);
    const matches = selection.filter((item) => dishKey(item) === key);
    const existing = matches[matches.length - 1];
    if (
      !existing ||
      (delta > 0 &&
        dish.isUniquePrice &&
        (matches.length > 1 || existing.notes))
    ) {
      if (delta > 0) {
        const newDish = { ...dish, number: delta };
        delete newDish.notes;
        onChange([...selection, newDish]);
      }
      return;
    }

    const position = selection.lastIndexOf(existing);
    const number = Math.max(0, (existing.number ?? 0) + delta);
    onChange(
      selection.flatMap((item, index) =>
        index !== position ? [item] : number ? [{ ...item, number }] : [],
      ),
    );
  };

  return (
    <>
      <div className='space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <label className='flex items-center gap-2 rounded-xl border border-slate-300 px-3 text-blue-dark focus-within:ring-2 focus-within:ring-blue-dark'>
          <SearchRounded fontSize='small' aria-hidden='true' />
          <input
            type='search'
            placeholder='Buscar platillos'
            aria-label='Buscar platillos'
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowSelected(false);
            }}
            className='min-h-[2.75rem] min-w-0 flex-1 bg-transparent text-slate-900 outline-none'
          />
        </label>
        <div className='flex flex-wrap gap-2'>
          <select
            aria-label='Categoría'
            disabled={loading || error}
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setShowSelected(false);
            }}
            className='min-h-[2.5rem] rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900'
          >
            <option value=''>Todas las categorías</option>
            {catalog.map(({ id, value }) => (
              <option key={id} value={id}>
                {value}
              </option>
            ))}
          </select>
          <button
            type='button'
            aria-pressed={showSelected}
            disabled={loading || error}
            onClick={() => setShowSelected(!showSelected)}
            className={`rounded-xl border border-blue-dark px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:opacity-60 ${
              showSelected ? "bg-blue-dark text-white" : "text-blue-dark"
            }`}
          >
            Ver selección
          </button>
        </div>
      </div>

      {loading && (
        <p role='status' className='rounded-2xl bg-white p-6 text-slate-600'>
          Cargando platillos…
        </p>
      )}
      {error && (
        <div role='alert' className='rounded-2xl bg-white p-6 text-rose-800'>
          No se pudo cargar el catálogo.{" "}
          <button
            type='button'
            className='ml-2 font-semibold underline'
            onClick={() => {
              setError(false);
              setLoading(true);
              setAttempt((current) => current + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      )}
      {!loading && !error && categories.length === 0 && (
        <p className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600'>
          {showSelected
            ? "Todavía no has añadido platillos."
            : "No se encontraron platillos."}
        </p>
      )}

      {categories.map(({ id, value, dishes }) => (
        <section key={id} className='space-y-2'>
          <h2 className='px-1 text-lg font-semibold'>{value}</h2>
          <ul className='grid gap-2 md:grid-cols-2'>
            {dishes.map((dish) => {
              const key = dishKey(dish);
              const quantity = quantities.get(key) ?? 0;
              return (
                <li
                  key={key}
                  className={`flex items-center justify-between gap-3 rounded-2xl border bg-white p-3 shadow-sm ${
                    quantity ? "border-blue-dark" : "border-slate-200"
                  }`}
                >
                  <div className='min-w-0'>
                    <h3 className='break-words font-semibold'>{dish.name}</h3>
                    <p className='text-sm text-slate-600'>
                      {currencyFormat(dish.price)}
                    </p>
                  </div>
                  <div className='flex shrink-0 items-center gap-2'>
                    <button
                      type='button'
                      disabled={!quantity}
                      aria-label={`Quitar una unidad de ${dish.name}`}
                      onClick={() => changeQuantity(dish, -1)}
                      className={quantityButton}
                    >
                      <RemoveRounded fontSize='small' />
                    </button>
                    <span
                      aria-label={`Cantidad de ${dish.name}`}
                      className='min-w-5 text-center font-semibold tabular-nums'
                    >
                      {quantity}
                    </span>
                    <button
                      type='button'
                      aria-label={`Agregar una unidad de ${dish.name}`}
                      onClick={() => changeQuantity(dish, 1)}
                      className={quantityButton}
                    >
                      <AddRounded fontSize='small' />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
