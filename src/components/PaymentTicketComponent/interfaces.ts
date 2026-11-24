import type { TDirectory } from "@/types/directory.types";
import type { TResponseOrders } from "@/types/menu.types";

export interface PaymentTicketProps {
  information: TResponseOrders & { creatAt: string };
  total: number;
  waiterName: string;
  selectedClients: TDirectory[];
  showPaymentInfo: boolean;
  showDiscount: boolean;
}
