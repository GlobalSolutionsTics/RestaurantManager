import DinersDivisionForm from "@/components/orders/DinersDivisionForm";
import WaiterOrderLayout, {
  orderPanel,
  orderSecondaryButton,
} from "@/components/orders/WaiterOrderLayout";
import { useWaiterName } from "@/components/waiter/useWaiterName";
import type { TResponseOrders } from "@/types/menu.types";
import {
  currencyFormat,
  formatDateTime,
  getActualDateDB,
} from "@/utils/formats";
import { groupOrderDishes } from "@/utils/groupOrderDishes";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { OpenInNew, QrCode2, Splitscreen } from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

type BillOrder = TResponseOrders & { creatAt?: string };

function OrderBill({ orderId }: { orderId: string }) {
  const [information, setInformation] = useState<BillOrder | null>();
  const [attempt, setAttempt] = useState(0);
  const [showDivision, setShowDivision] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState("");
  const waiterName = useWaiterName(information?.waiter);
  const diners = Number(information?.diners);
  const canSplitBill = Number.isSafeInteger(diners) && diners > 1;
  const dishes = groupOrderDishes(information?.dishesDescription).filter(
    (dish) => dish.number > 0,
  );
  const total = dishes.reduce((sum, dish) => sum + dish.price * dish.number, 0);
  const subtotal = total / 1.16;

  useEffect(() => {
    let active = true;
    let unsubscribe: Unsubscribe | undefined;
    const fail = () => {
      if (active) setInformation(null);
    };
    const subscribe = async () => {
      await signInAnonymously(getAuth());
      if (!active) return;
      const { fullDate } = getActualDateDB();
      unsubscribe = onValue(
        ref(realtimeDB, `${RT_ORDER_TABLE_NAME}/${fullDate}/${orderId}`),
        (snapshot) => {
          if (!active) return;
          const order: BillOrder | null = snapshot.val();
          setInformation(order?.uuid === orderId ? order : null);
        },
        fail,
      );
    };
    void subscribe().catch(fail);
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [orderId, attempt]);

  const toggleTracking = () => {
    if (!showTracking)
      setTrackingUrl(
        new URL(
          `/checks/${encodeURIComponent(orderId)}`,
          window.location.origin,
        ).href,
      );
    setShowTracking(!showTracking);
  };

  return (
    <WaiterOrderLayout title='Cuenta' order={information}>
      {information === undefined && (
        <p className={orderPanel} role='status'>
          Cargando cuenta…
        </p>
      )}
      {information === null && (
        <div
          className={`${orderPanel} flex flex-wrap items-center justify-between gap-2`}
          role='alert'
        >
          <p>No se pudo cargar la cuenta.</p>
          <button
            type='button'
            className={orderSecondaryButton}
            onClick={() => {
              setInformation(undefined);
              setAttempt((current) => current + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      )}
      {information && (
        <>
          <div className='grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(15rem,2fr)]'>
            <section className={orderPanel} aria-labelledby='bill-items'>
              <h2 id='bill-items' className='text-lg font-semibold'>
                Platillos
              </h2>
              {dishes.length ? (
                <ul className='mt-2 divide-y divide-slate-200'>
                  {dishes.map((dish) => (
                    <li
                      key={dish.key}
                      className='flex items-center justify-between gap-3 py-3'
                    >
                      <div className='min-w-0'>
                        <p className='break-words font-semibold'>{dish.name}</p>
                        <p className='text-sm text-slate-600'>
                          {dish.number} × {currencyFormat(dish.price)}
                        </p>
                      </div>
                      <p className='shrink-0 font-semibold tabular-nums'>
                        {currencyFormat(dish.number * dish.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='mt-3 text-sm text-slate-600'>
                  La orden no tiene platillos.
                </p>
              )}
            </section>
            <section className={orderPanel} aria-labelledby='bill-total'>
              <h2 id='bill-total' className='text-lg font-semibold'>
                Resumen
              </h2>
              <dl className='mt-3 space-y-2 text-sm'>
                <div className='flex justify-between gap-3'>
                  <dt className='text-slate-600'>Atiende</dt>
                  <dd>{waiterName || "—"}</dd>
                </div>
                {information.creatAt && (
                  <div className='flex justify-between gap-3'>
                    <dt className='text-slate-600'>Fecha</dt>
                    <dd className='text-right'>
                      {formatDateTime(information.creatAt)}
                    </dd>
                  </div>
                )}
                <div className='flex justify-between gap-3 border-t border-slate-200 pt-3'>
                  <dt className='text-slate-600'>Subtotal</dt>
                  <dd>{currencyFormat(subtotal)}</dd>
                </div>
                <div className='flex justify-between gap-3'>
                  <dt className='text-slate-600'>IVA</dt>
                  <dd>{currencyFormat(total - subtotal)}</dd>
                </div>
                <div className='flex justify-between gap-3 border-t border-slate-200 pt-3 text-lg font-semibold'>
                  <dt>Total</dt>
                  <dd>{currencyFormat(total)}</dd>
                </div>
              </dl>
              <div className='mt-4 flex flex-wrap gap-2'>
                {canSplitBill && (
                  <button
                    type='button'
                    aria-expanded={showDivision}
                    onClick={() => setShowDivision(!showDivision)}
                    className={orderSecondaryButton}
                  >
                    <Splitscreen fontSize='small' />{" "}
                    {showDivision ? "Ocultar división" : "Dividir cuenta"}
                  </button>
                )}
                <button
                  type='button'
                  aria-expanded={showTracking}
                  onClick={toggleTracking}
                  className={orderSecondaryButton}
                >
                  <QrCode2 fontSize='small' />{" "}
                  {showTracking ? "Ocultar QR" : "Ver QR"}
                </button>
              </div>
              {showTracking && (
                <div className='mt-4 flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-4'>
                  <QRCode
                    value={trackingUrl}
                    size={160}
                    role='img'
                    aria-label='Código QR de seguimiento'
                  />
                  <a
                    href={trackingUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-sm font-semibold text-blue-dark underline'
                  >
                    Abrir seguimiento <OpenInNew fontSize='small' />
                  </a>
                </div>
              )}
            </section>
          </div>
          {canSplitBill && showDivision && (
            <section className={orderPanel} aria-labelledby='bill-division'>
              <h2 id='bill-division' className='mb-3 text-lg font-semibold'>
                División de la cuenta
              </h2>
              <DinersDivisionForm order={information} />
            </section>
          )}
        </>
      )}
    </WaiterOrderLayout>
  );
}

export default function NotePage() {
  const { query } = useRouter();
  return typeof query.id === "string" ? (
    <OrderBill key={query.id} orderId={query.id} />
  ) : null;
}
