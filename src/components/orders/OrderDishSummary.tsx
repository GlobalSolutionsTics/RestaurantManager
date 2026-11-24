import type { TResponseOrders } from "@/types/menu.types";
import { groupOrderDishes } from "@/utils/groupOrderDishes";

export default function OrderDishSummary({
  dishes,
}: {
  dishes?: TResponseOrders["dishesDescription"];
}) {
  const rows = groupOrderDishes(dishes);
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
          <th scope='col' className='p-2 text-right'>
            Listos
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key} className='border-b border-neutral-100'>
            <th scope='row' className='p-2 text-left font-normal'>
              {row.name}
            </th>
            <td className='p-2 text-right tabular-nums'>{row.pending}</td>
            <td className='p-2 text-right tabular-nums'>{row.ready}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
