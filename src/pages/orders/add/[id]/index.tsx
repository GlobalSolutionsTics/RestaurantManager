import DishCatalogPicker from "@/components/orders/DishCatalogPicker";
import WaiterOrderLayout, {
  canModifyOrder,
  orderPanel,
  orderPrimaryButton,
} from "@/components/orders/WaiterOrderLayout";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import { setAdditionDraft } from "@/store/slices/orders.slice";
import type { RootRedux } from "@/store/store";
import { currencyFormat } from "@/utils/formats";
import { ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

function AddOrderDishes({ orderId }: { orderId: string }) {
  const order = useOrderForEditing(orderId);
  const router = useRouter();
  const dispatch = useDispatch();
  const stored = useSelector(
    (state: RootRedux) => state.ordersDishes.additionDraft,
  );
  const draft = stored?.orderId === orderId ? stored : undefined;
  const dishes = draft?.dishes ?? [];
  const quantity = dishes.reduce((sum, dish) => sum + (dish.number ?? 0), 0);
  const subtotal = dishes.reduce(
    (sum, dish) => sum + dish.price * (dish.number ?? 0),
    0,
  );

  return (
    <WaiterOrderLayout title='Añadir platillos' order={order}>
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
      {order && !canModifyOrder(order) && (
        <p className={orderPanel}>Esta orden ya no admite adiciones.</p>
      )}
      {order && canModifyOrder(order) && (
        <>
          {draft?.submitted ? (
            <p className={orderPanel}>
              Hay una adición pendiente de confirmar. Abre la revisión para
              volver a enviar los mismos platillos.
            </p>
          ) : (
            <DishCatalogPicker
              selection={dishes}
              onChange={(selection) => {
                dispatch(
                  setAdditionDraft({
                    ...draft,
                    orderId,
                    submissionId: draft?.submissionId ?? uuidv4(),
                    dishes: selection,
                  }),
                );
              }}
            />
          )}
          <div className='pb-24' />
          <footer className='fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-3 shadow-lg'>
            <div className='mx-auto flex max-w-5xl items-center justify-between gap-3'>
              <div aria-live='polite'>
                <p className='text-sm text-slate-600'>
                  {quantity}{" "}
                  {quantity === 1 ? "unidad nueva" : "unidades nuevas"}
                </p>
                <p className='font-semibold'>{currencyFormat(subtotal)}</p>
              </div>
              <button
                type='button'
                className={orderPrimaryButton}
                disabled={!quantity}
                onClick={() => router.push(`/orders/add/${orderId}/send`)}
              >
                Revisar adición <ArrowForward fontSize='small' />
              </button>
            </div>
          </footer>
        </>
      )}
    </WaiterOrderLayout>
  );
}

export default function AddOrderPage() {
  const { query } = useRouter();
  return typeof query.id === "string" ? (
    <AddOrderDishes key={query.id} orderId={query.id} />
  ) : null;
}
