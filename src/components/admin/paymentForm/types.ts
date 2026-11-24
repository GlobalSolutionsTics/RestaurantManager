export type Payment = {
  subtotal: number;
  total: number;
  total_payed: number;
  efective: number;
  tdd: number;
  tdc: number;
  vales: number;
  cortesia: number;
  discount: number;
  cambio: number;
  propina: number;
};

export type PaymentChange = Payment & { isIncomplete: boolean };

export type Props = {
  total: number;
  paymentInfo?: Payment;
  onChange: (prm: PaymentChange) => void;
};
