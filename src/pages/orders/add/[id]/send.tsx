import OrderReviewTour from "@/components/orders/OrderReviewTour";
import DishBreakdownDialog from "@/components/orders/DishBreakdownDialog";
import { OrderNoteField } from "@/components/orders/DishReviewFields";
import OrderDishLine from "@/components/orders/OrderDishLine";
import WaiterOrderLayout, {
  canModifyOrder,
  orderPanel,
  orderPrimaryButton,
  orderSecondaryButton,
} from "@/components/orders/WaiterOrderLayout";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import { sendApplicationOrderAdd } from "@/services/order";
import {
  clearAdditionDraft,
  setAdditionDraft,
} from "@/store/slices/orders.slice";
import type { RootRedux } from "@/store/store";
import { currencyFormat } from "@/utils/formats";
import { getOrderDishKey } from "@/utils/groupOrderDishes";
import {
  separateVariablePriceUnits,
  trimDishNote,
} from "@/utils/orderDishNotes";
import { TOKEN_ID } from "@/utils/strings";
import { SendRounded } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ReviewAddition({ orderId }: { orderId: string }) {
  const router = useRouter();
  const order = useOrderForEditing(orderId);
  const waiter = useSelector((state: RootRedux) => state.user.uuid);
  const stored = useSelector(
    (state: RootRedux) => state.ordersDishes.additionDraft,
  );
  const draft = stored?.orderId === orderId ? stored : undefined;
  const dispatch = useDispatch();
  const sending = useRef(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [error, setError] = useState("");
  const dishes = separateVariablePriceUnits(draft?.dishes ?? []);
  const existingKeys = new Set(order?.dishesDescription?.map(getOrderDishKey));
  const repeated = dishes.some((dish) =>
    existingKeys.has(getOrderDishKey(dish)),
  );
  const total = dishes.reduce(
    (sum, dish) => sum + dish.price * (dish.number ?? 0),
    0,
  );

  const send = async () => {
    if (
      !draft ||
      !order ||
      !canModifyOrder(order) ||
      !dishes.length ||
      sending.current ||
      completed ||
      editing !== null ||
      showBreakdown
    )
      return;
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) {
      setError("Inicia sesión para enviar la adición.");
      return;
    }

    sending.current = true;
    setSaving(true);
    setError("");
    if (!draft.submitted)
      dispatch(setAdditionDraft({ ...draft, submitted: true }));
    try {
      const confirmed = await sendApplicationOrderAdd(token, orderId, {
        modifications: {
          dishesDescription: dishes.map(trimDishNote),
          orderUUID: orderId,
          submissionId: draft.submissionId,
          ...(draft.notes?.trim() && { notes: draft.notes.trim() }),
        },
        waiter,
      });
      if (!confirmed) {
        setError(
          "No se pudo enviar la adición. Puedes volver a intentar el mismo envío.",
        );
        return;
      }
      setCompleted(true);
      dispatch(clearAdditionDraft(draft.submissionId));
      await router.replace("/orders/myOrders");
    } finally {
      sending.current = false;
      setSaving(false);
    }
  };

  return (
    <WaiterOrderLayout
      title='Revisar adición'
      order={order}
      backHref={
        completed || draft?.submitted
          ? "/orders/myOrders"
          : `/orders/add/${orderId}`
      }
      backLabel={
        completed || draft?.submitted ? "Mis órdenes" : "Volver a platillos"
      }
    >
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
          Platillos enviados.
        </p>
      )}
      {order &&
        !completed &&
        (!canModifyOrder(order) ? (
          <p className={orderPanel}>Esta orden ya no admite adiciones.</p>
        ) : !dishes.length ? (
          <p className={orderPanel}>Añade platillos para continuar.</p>
        ) : (
          <>
            {repeated && (
              <p className={`${orderPanel} text-sm text-slate-700`}>
                Las unidades nuevas de platillos que ya están en la orden se
                sumarán a los pendientes.
              </p>
            )}
            <section className={orderPanel} data-review-tour='notes'>
              {order.notes && (
                <p className='mb-3 whitespace-pre-wrap text-sm text-slate-700'>
                  Notas actuales: {order.notes}
                </p>
              )}
              <OrderNoteField
                value={draft?.notes ?? ""}
                disabled={saving || draft?.submitted}
                onChange={(notes) => {
                  if (draft && !draft.submitted && !sending.current)
                    dispatch(setAdditionDraft({ ...draft, notes }));
                }}
              />
            </section>
            <div
              className={`${orderPanel} flex flex-wrap items-center justify-between gap-3`}
            >
              <h2 data-review-tour='dishes' className='font-semibold'>
                Platillos nuevos
              </h2>
              <div className='flex flex-wrap items-center gap-2'>
                <button
                  data-review-tour='breakdown'
                  type='button'
                  className={orderSecondaryButton}
                  disabled={saving || draft?.submitted || editing !== null}
                  onClick={() => setShowBreakdown(true)}
                >
                  Desglosar platillos
                </button>
                <OrderReviewTour
                  screen='addition'
                  disabled={saving || showBreakdown || editing !== null}
                />
              </div>
            </div>
            <ul className='space-y-3' aria-label='Platillos nuevos'>
              {dishes.map((dish, index) => (
                <OrderDishLine
                  key={`${dish.type}-${dish.uuid ?? dish.name}-${index}`}
                  dish={dish}
                  lockQuantity={dish.isUniquePrice}
                  editable={!saving && !draft?.submitted && editing === null}
                  editing={editing === index}
                  onEdit={() => setEditing(index)}
                  onCancel={() => setEditing(null)}
                  onSave={(changes) => {
                    if (!draft) return;
                    const updated = dishes
                      .map((item, position) =>
                        position === index ? { ...item, ...changes } : item,
                      )
                      .filter((item) => (item.number ?? 0) > 0);
                    dispatch(setAdditionDraft({ ...draft, dishes: updated }));
                    setEditing(null);
                  }}
                />
              ))}
            </ul>
            {error && (
              <p className={`${orderPanel} text-rose-800`} role='alert'>
                {error}
              </p>
            )}
            <div
              className={`${orderPanel} flex flex-wrap items-center justify-between gap-3`}
              data-review-tour='submit'
            >
              <div>
                <p className='text-sm text-slate-600'>Subtotal de la adición</p>
                <p className='text-xl font-semibold'>{currencyFormat(total)}</p>
              </div>
              <button
                type='button'
                className={orderPrimaryButton}
                disabled={saving || editing !== null || showBreakdown}
                onClick={send}
              >
                <SendRounded fontSize='small' />{" "}
                {saving ? "Enviando…" : "Enviar adición"}
              </button>
            </div>
            {showBreakdown && draft && !draft.submitted && (
              <DishBreakdownDialog
                dishes={dishes}
                onClose={() => setShowBreakdown(false)}
                onSave={(updatedDishes) => {
                  dispatch(
                    setAdditionDraft({ ...draft, dishes: updatedDishes }),
                  );
                  setShowBreakdown(false);
                }}
              />
            )}
          </>
        ))}
    </WaiterOrderLayout>
  );
}

export default function AdditionReviewPage() {
  const { query } = useRouter();
  return typeof query.id === "string" ? (
    <ReviewAddition key={query.id} orderId={query.id} />
  ) : null;
}
