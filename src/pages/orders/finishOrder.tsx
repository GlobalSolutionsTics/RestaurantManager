import OrderReviewTour from "@/components/orders/OrderReviewTour";
import DishBreakdownDialog from "@/components/orders/DishBreakdownDialog";
import { orderSecondaryButton } from "@/components/orders/WaiterOrderLayout";
import {
  OrderNoteField,
  VariablePriceLabel,
} from "@/components/orders/DishReviewFields";
import { useFinishOrder } from "@/hooks/Wainters/useFinishOrder";
import ProtectPage from "@/pages/admin/components/protectPage";
import type { IOrderSlice } from "@/store/slices/orders.slice";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat } from "@/utils/formats";
import { CHECKS } from "@/utils/users";
import { ArrowBack, SendRounded } from "@mui/icons-material";
import { TextField } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import type { Dispatch } from "react";

function ReviewDish({
  dish,
  onPriceChange,
  disabled,
}: {
  dish: IOrderSlice["dishesDescription"][number];
  onPriceChange: Dispatch<number>;
  disabled: boolean;
}) {
  const [editablePrice] = useState(dish.isUniquePrice || dish.price === 0);
  const [priceDraft, setPriceDraft] = useState(String(dish.price));
  const quantity = dish.number ?? 0;

  return (
    <li className='space-y-3 border-b border-slate-200 px-4 py-3 last:border-0'>
      <div className='flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='break-words font-semibold'>{dish.name}</p>
            {dish.isUniquePrice === true && <VariablePriceLabel />}
          </div>
          <p className='text-sm text-slate-600'>
            {quantity} × {currencyFormat(dish.price)}
          </p>
        </div>
        <p className='shrink-0 font-semibold tabular-nums'>
          {currencyFormat(quantity * dish.price)}
        </p>
      </div>
      {editablePrice && (
        <TextField
          size='small'
          type='number'
          label='Precio unitario'
          value={priceDraft}
          disabled={disabled}
          required
          inputProps={{
            min: 0,
            step: "0.01",
            "aria-label": `Precio unitario de ${dish.name}`,
          }}
          onChange={(event) => {
            const value = event.target.value;
            setPriceDraft(value);
            if (value !== "") onPriceChange(Number(value));
          }}
        />
      )}
    </li>
  );
}

export default function FinishOrderPage() {
  const router = useRouter();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const {
    handleChangeName,
    handleSendOrder,
    handleChangeDiners,
    changeDish,
    reviewedDishes,
    changeNotes,
    updateDishes,
    loading,
    orderStore,
    nameClient,
    diners,
  } = useFinishOrder();
  const { tableNumber, dishesDescription, dishes } = orderStore;
  const takeout = tableNumber === DEFAULT_TABLE_LLEVAR;
  const total = dishesDescription.reduce(
    (sum, dish) => sum + dish.price * (dish.number ?? 0),
    0,
  );

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Revisar orden | Meseros</title>
      </Head>
      <main className='min-h-screen bg-slate-100 px-4 py-5 text-slate-900 sm:px-8'>
        <div className='mx-auto max-w-4xl space-y-5'>
          <header className='rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
            <Link
              href={tableNumber ? "/orders/typeSelect" : "/orders/tableSelect"}
              className='mb-3 inline-flex items-center gap-2 rounded text-sm font-semibold focus-visible:outline focus-visible:outline-2'
            >
              <ArrowBack fontSize='small' />{" "}
              {tableNumber ? "Volver a platillos" : "Elegir mesa"}
            </Link>
            <h1
              id='order-review-tour-title'
              className='text-3xl font-semibold tracking-tight'
            >
              Revisar orden
            </h1>
          </header>
          {!tableNumber || !dishesDescription.length ? (
            <p className='rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600'>
              Añade platillos para continuar.
            </p>
          ) : (
            <form
              className='space-y-5'
              onSubmit={(event) => {
                event.preventDefault();
                void handleSendOrder();
              }}
            >
              <section
                data-review-tour='details'
                className='space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <h2 className='text-lg font-semibold'>
                    {takeout ? "Para llevar" : `Mesa ${tableNumber}`}
                  </h2>
                  <Link
                    href='/orders/tableSelect'
                    className='text-sm font-semibold text-blue-dark underline'
                  >
                    Cambiar mesa
                  </Link>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <TextField
                    label='Número de comensales'
                    size='small'
                    type='number'
                    inputProps={{ min: 1, step: 1 }}
                    value={diners}
                    onChange={handleChangeDiners}
                    disabled={loading}
                  />
                  {takeout && (
                    <TextField
                      label='Nombre del cliente'
                      size='small'
                      value={nameClient}
                      onChange={handleChangeName}
                      disabled={loading}
                    />
                  )}
                </div>
                <div data-review-tour='notes'>
                  <OrderNoteField
                    value={orderStore.notes ?? ""}
                    disabled={loading}
                    onChange={changeNotes}
                  />
                </div>
              </section>

              <section
                aria-labelledby='review-dishes'
                className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
              >
                <div className='flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3'>
                  <h2
                    data-review-tour='dishes'
                    id='review-dishes'
                    className='font-semibold'
                  >
                    Platillos
                  </h2>
                  <div className='flex flex-wrap items-center justify-end gap-2'>
                    <p className='text-sm text-slate-600'>
                      {dishes} {dishes === 1 ? "unidad" : "unidades"}
                    </p>
                    <button
                      type='button'
                      data-review-tour='breakdown'
                      className={orderSecondaryButton}
                      disabled={loading}
                      onClick={() => setShowBreakdown(true)}
                    >
                      Desglosar platillos
                    </button>
                    <OrderReviewTour
                      screen='finish'
                      disabled={loading || showBreakdown}
                    />
                  </div>
                </div>
                <ul>
                  {reviewedDishes.map((dish, index) => (
                    <ReviewDish
                      key={`${dish.uuid ?? "platillo"}-${dish.name}-${index}`}
                      dish={dish}
                      disabled={loading}
                      onPriceChange={(price) => changeDish(index, { price })}
                    />
                  ))}
                </ul>
              </section>

              <div
                className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
                aria-busy={loading}
                data-review-tour='submit'
              >
                <div>
                  <p className='text-sm text-slate-600'>Total</p>
                  <p className='text-xl font-semibold tabular-nums'>
                    {currencyFormat(total)}
                  </p>
                </div>
                <button
                  type='submit'
                  disabled={loading || dishes <= 0}
                  className='inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark disabled:bg-slate-200 disabled:text-slate-600'
                >
                  <SendRounded fontSize='small' />{" "}
                  {loading ? "Enviando orden…" : "Enviar orden"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      {showBreakdown && (
        <DishBreakdownDialog
          dishes={reviewedDishes}
          onClose={() => setShowBreakdown(false)}
          onSave={(dishes) => {
            updateDishes(dishes);
            setShowBreakdown(false);
          }}
        />
      )}
    </ProtectPage>
  );
}
