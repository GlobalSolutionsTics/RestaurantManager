export const MAX_DISH_NOTE_LENGTH = 300;

export function isValidDishNote(note: unknown) {
  return (
    note === undefined ||
    (typeof note === "string" && note.length <= MAX_DISH_NOTE_LENGTH)
  );
}

export function trimDishNote<T extends { notes?: string }>(dish: T): T {
  const next = { ...dish };
  const note = next.notes?.trim();
  if (note) next.notes = note;
  else delete next.notes;
  return next;
}

export function separateVariablePriceUnits<
  T extends { isUniquePrice: boolean; number?: number },
>(dishes: T[]): T[] {
  return dishes.flatMap((dish) =>
    dish.isUniquePrice && (dish.number ?? 0) > 1
      ? Array.from({ length: dish.number ?? 0 }, () => ({ ...dish, number: 1 }))
      : [dish],
  );
}

export function groupRenamedDishes<
  T extends {
    uuid?: string;
    type: string;
    name: string;
    price: number;
    isUniquePrice: boolean;
    number?: number;
    notes?: string;
  },
>(dishes: T[]): T[] {
  const positions = new Map<string, number>();
  const result: T[] = [];
  for (const dish of dishes) {
    if (dish.isUniquePrice) {
      result.push(dish);
      continue;
    }
    const key = JSON.stringify([
      dish.uuid,
      dish.type,
      dish.name,
      dish.price,
      dish.notes,
    ]);
    const position = positions.get(key);
    if (position === undefined) {
      positions.set(key, result.length);
      result.push(dish);
    } else {
      result[position] = {
        ...result[position],
        number: (result[position].number ?? 0) + (dish.number ?? 0),
      };
    }
  }
  return result;
}
