import type { TResponseOrders } from "@/types/menu.types";
import { belongsToKitchen } from "@/utils/kitchenOrder";
import { groupOrderDishes } from "@/utils/groupOrderDishes";

export default function OrderDishSummary({
  dishes,
  kitchen,
}: {
  dishes?: TResponseOrders["dishesDescription"];
  kitchen?: { type?: string };
}) {
  const matching = kitchen
    ? dishes?.filter((dish) => belongsToKitchen(dish, kitchen.type))
    : dishes;
  const other = kitchen
    ? dishes?.filter((dish) => !belongsToKitchen(dish, kitchen.type))
    : [];
  const rows = [
    ...groupOrderDishes(matching, !!kitchen).map((row) => ({
      ...row,
      otherKitchen: false,
    })),
    ...groupOrderDishes(other, !!kitchen).map((row) => ({
      ...row,
      otherKitchen: true,
    })),
  ];
  if (!rows.length) return null;

  return (
    <table
      aria-label='Platillos por estado'
      className='w-full font-secondary text-sm'
    >
      <thead>
        <tr className='border-b border-neutral-200'>
          <th scope='col' className='p-2 text-left'>
            Platillo
          </th>
          <th scope='col' className='p-2 text-right'>
            Pendientes
          </th>
          {kitchen && (
            <th scope='col' className='p-2 text-right'>
              En preparación
            </th>
          )}
          <th scope='col' className='p-2 text-right'>
            Listos
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={`${row.otherKitchen}-${row.key}`}
            className={`border-b border-neutral-100 ${
              row.otherKitchen ? "bg-slate-200 text-slate-600" : ""
            }`}
          >
            <th scope='row' className='p-2 text-left font-normal'>
              {row.name}
              {row.notes && (
                <p className='mt-1 whitespace-pre-wrap break-words font-semibold'>
                  Nota: {row.notes}
                </p>
              )}
              {row.otherKitchen && (
                <span className='sr-only'> (otra cocina)</span>
              )}
            </th>
            <td className='p-2 text-right tabular-nums'>
              {kitchen ? row.pending - row.preparing : row.pending}
            </td>
            {kitchen && (
              <td className='p-2 text-right tabular-nums'>{row.preparing}</td>
            )}
            <td className='p-2 text-right tabular-nums'>{row.ready}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
