import OrderDishLine from "@/components/orders/OrderDishLine";
import WaiterOrderLayout, {
  canModifyOrder,
  orderPanel,
  orderPrimaryButton,
  orderSecondaryButton,
} from "@/components/orders/WaiterOrderLayout";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import type { DishesWithOrder } from "@/pages/api/types/Order/order.type";
import { sendApplicationOrderEdit } from "@/services/order";
import type { RootRedux } from "@/store/store";
import { currencyFormat } from "@/utils/formats";
import { isDishFinished, isDishSent } from "@/utils/kitchenOrder";
import { TOKEN_ID } from "@/utils/strings";
import { SaveOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

function EditOrder({ orderId }: { orderId: string }) {
  const router = useRouter();
  const order = useOrderForEditing(orderId);
  const waiter = useSelector((state: RootRedux) => state.user.uuid);
  const sending = useRef(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [updated, setUpdated] = useState<DishesWithOrder[]>();
  const [error, setError] = useState("");
  const original = order?.dishesDescription ?? [];
  const dishes = updated ?? original;
  const modifiable = !!order && canModifyOrder(order);
  const canEditDishes =
    modifiable && original.some((dish) => isDishSent(dish.status));
  const hasChanges = dishes.some((dish, index) => {
    const previous = original[index];
    return (
      previous &&
      (dish.name !== previous.name ||
        dish.number !== previous.number ||
        dish.price !== previous.price)
    );
  });
  const total = dishes.reduce((sum, dish) => sum + dish.price * dish.number, 0);

  const save = async () => {
    if (
      !order ||
      !canEditDishes ||
      !hasChanges ||
      sending.current ||
      completed ||
      editing !== null
    )
      return;
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) {
      setError("Inicia sesión para guardar los cambios.");
      return;
    }
    sending.current = true;
    setSaving(true);
    setError("");
    try {
      const result = await sendApplicationOrderEdit(token, orderId, {
        modifications: {
          dishesDescription: dishes,
          orderUUID: orderId,
          originalDishes: original,
        },
        waiter,
      });
      if (!result) {
        setError(
          "No se pudieron guardar los cambios. Si la orden cambió en cocina, vuelve a cargarla antes de editar.",
        );
        return;
      }
      setCompleted(true);
      await router.replace("/orders/myOrders");
    } finally {
      sending.current = false;
      setSaving(false);
    }
  };

  return (
    <WaiterOrderLayout title='Editar orden' order={order}>
      {order === undefined && (
        <p className={orderPanel} role='status'>
          Cargando orden…
        </p>
      )}
      {order === null && (
        <p className={orderPanel} role='alert'>
          No se pudo cargar la orden.
        </p>
      )}
      {completed && (
        <p className={orderPanel} role='status'>
          Orden actualizada.
        </p>
      )}
      {order && !completed && (
        <>
          <p className={`${orderPanel} text-sm text-slate-700`}>
            {canEditDishes
              ? "Puedes modificar los platillos pendientes."
              : "No hay platillos pendientes que se puedan editar."}
          </p>
          <ul className='space-y-3' aria-label='Platillos de la orden'>
            {dishes.map((dish, index) => {
              const pending = isDishSent(original[index]?.status);
              const badge = pending
                ? "Pendiente"
                : isDishFinished(dish.status)
                  ? "Listo"
                  : "En preparación";
              return (
                <OrderDishLine
                  key={`${dish.uuid ?? "platillo"}-${index}`}
                  dish={dish}
                  badge={badge}
                  editable={
                    modifiable && pending && !saving && editing === null
                  }
                  editing={editing === index}
                  onEdit={() => setEditing(index)}
                  onCancel={() => setEditing(null)}
                  onSave={(changes) => {
                    setUpdated(
                      dishes.map((item, position) =>
                        position === index ? { ...item, ...changes } : item,
                      ),
                    );
                    setEditing(null);
                  }}
                />
              );
            })}
          </ul>
          {error && (
            <div
              className={`${orderPanel} flex flex-wrap items-center justify-between gap-2 text-rose-800`}
              role='alert'
            >
              <p>{error}</p>
              <button
                type='button'
                className={orderSecondaryButton}
                onClick={() => router.reload()}
              >
                Recargar orden
              </button>
            </div>
          )}
          <div
            className={`${orderPanel} flex flex-wrap items-center justify-between gap-3`}
          >
            <div>
              <p className='text-sm text-slate-600'>Total de la orden</p>
              <p className='text-xl font-semibold'>{currencyFormat(total)}</p>
            </div>
            <button
              type='button'
              className={orderPrimaryButton}
              disabled={
                !hasChanges || !canEditDishes || saving || editing !== null
              }
              onClick={save}
            >
              <SaveOutlined fontSize='small' />{" "}
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </>
      )}
    </WaiterOrderLayout>
  );
}

export default function EditOrderPage() {
  const { query } = useRouter();
  return typeof query.id === "string" ? (
    <EditOrder key={query.id} orderId={query.id} />
  ) : null;
}
