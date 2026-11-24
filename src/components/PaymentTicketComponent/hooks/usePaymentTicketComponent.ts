import { textToString } from "@/utils/formats";
import type { PaymentTicketProps } from "../interfaces";

export function usePaymentTicketComponent(
  information: PaymentTicketProps["information"],
) {
  const paymentTotal =
    information.payment?.total ??
    information.dishesDescription?.reduce(
      (sum, dish) => sum + dish.price * dish.number,
      0,
    ) ??
    0;

  return { paymentTotalInWords: textToString(paymentTotal) };
}
