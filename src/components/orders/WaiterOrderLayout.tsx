import { StatusEnum } from "@/enums/states.enum";
import ProtectPage from "@/pages/admin/components/protectPage";
import type { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { CHECKS } from "@/utils/users";
import { ArrowBack } from "@mui/icons-material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export const orderPanel =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
export const orderPrimaryButton =
  "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark disabled:bg-slate-200 disabled:text-slate-600";
export const orderSecondaryButton =
  "inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-blue-dark hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:opacity-60";

export function orderTableLabel(order: TResponseOrders) {
  return order.tableNumber === DEFAULT_TABLE_LLEVAR
    ? order.name
      ? `Para llevar · ${order.name}`
      : "Para llevar"
    : `Mesa ${order.tableNumber}`;
}

export function canModifyOrder(order: TResponseOrders) {
  return (
    order.status !== StatusEnum.CLOSED && order.status !== StatusEnum.CANCELED
  );
}

export function OrderStatus({ status }: { status: string }) {
  const labels: Record<string, { label: string; colors: string }> = {
    [StatusEnum.SEND]: {
      label: "Enviada",
      colors: "bg-blue-50 text-blue-dark",
    },
    [StatusEnum.IN_PROGRESS]: {
      label: "En preparación",
      colors: "bg-amber-50 text-amber-800",
    },
    [StatusEnum.EDITED]: {
      label: "Actualizada",
      colors: "bg-amber-50 text-amber-800",
    },
    [StatusEnum.ORDER_READY]: {
      label: "Lista",
      colors: "bg-emerald-50 text-emerald-700",
    },
    [StatusEnum.CLOSED]: {
      label: "Cerrada",
      colors: "bg-slate-100 text-slate-700",
    },
    [StatusEnum.CANCELED]: {
      label: "Cancelada",
      colors: "bg-rose-50 text-rose-700",
    },
  };
  const { label, colors } = labels[status] ?? {
    label: status,
    colors: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors}`}
    >
      {label}
    </span>
  );
}

export default function WaiterOrderLayout({
  title,
  order,
  backHref,
  backLabel = "Mis órdenes",
  children,
}: {
  title: string;
  order?: TResponseOrders | null;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const returnPath =
    backHref ??
    (order?.status === StatusEnum.ORDER_READY
      ? "/orders/myOrders?vista=listas"
      : "/orders/myOrders");
  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>{title} | Meseros</title>
      </Head>
      <main className='min-h-screen bg-slate-100 px-4 py-5 text-slate-900 sm:px-8 lg:py-8'>
        <div className='mx-auto max-w-5xl space-y-5'>
          <header
            data-review-tour='details'
            className='rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'
          >
            <Link
              href={returnPath}
              className='mb-3 inline-flex items-center gap-2 rounded text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2'
            >
              <ArrowBack fontSize='small' /> {backLabel}
            </Link>
            <h1
              id='order-review-tour-title'
              className='text-3xl font-semibold tracking-tight'
            >
              {title}
            </h1>
            {order && (
              <div className='mt-3 flex flex-wrap items-center gap-3'>
                <p className='break-words text-sm font-semibold text-slate-200'>
                  {orderTableLabel(order)}
                </p>
                <OrderStatus status={order.status} />
              </div>
            )}
          </header>
          {children}
        </div>
      </main>
    </ProtectPage>
  );
}
