import { currencyFormat } from "@/utils/formats";
import { useMemo } from "react";
import { Payment, PaymentChange } from "../types";
import { useFormik } from "formik";

export const usePaymentForm = (total: number, paymentInfo?: Payment) => {
  const initial_cambio = paymentInfo?.cambio || 0;
  const initial_cortesia = paymentInfo?.cortesia || 0;
  const initial_efective = paymentInfo?.efective || 0;
  const initial_propine = paymentInfo?.propina || 0;
  const initial_subtotal = paymentInfo?.subtotal || 0;
  const initial_tdc = paymentInfo?.tdc || 0;
  const initial_tdd = paymentInfo?.tdd || 0;
  const initial_total = paymentInfo?.total || 0;
  const initial_vales = paymentInfo?.vales || 0;
  const initial_discount = paymentInfo?.discount || 0;
  const initial_payed = paymentInfo?.total_payed || 0;
  const onlyShow = paymentInfo && paymentInfo?.total > 0 ? true : false;

  const INITIAL_VALUES: PaymentChange = {
    cambio: initial_cambio,
    cortesia: initial_cortesia,
    efective: initial_efective,
    isIncomplete: true,
    propina: initial_propine,
    subtotal: initial_subtotal,
    tdc: initial_tdc,
    tdd: initial_tdd,
    total: initial_total,
    vales: initial_vales,
    discount: initial_discount,
    total_payed: initial_payed,
  };

  const { handleChange, values } = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: () => {},
  });

  const { cortesia, discount, efective, propina, tdc, tdd, vales } = values;

  const TOTAL_NOTFORMAT =
    Number(total) + Number(propina) - Number(discount) - Number(cortesia);
  const TOTAL_PAGADO =
    Number(efective) + Number(tdc) + Number(tdd) + Number(vales);
  const CAMBIO = TOTAL_PAGADO - Number(TOTAL_NOTFORMAT);
  const VALID_CAMBIO = CAMBIO > 0 ? CAMBIO : 0;
  const RESTA_PAGAR = TOTAL_NOTFORMAT - TOTAL_PAGADO;
  const IS_PAYMENT_INCOMPLETE = RESTA_PAGAR > 0;
  const RESTA_PAGAR_VAL = IS_PAYMENT_INCOMPLETE ? RESTA_PAGAR : 0;

  const SUBTOTAL_FORMAT = currencyFormat(total);
  const TOTAL_PROPINE = currencyFormat(TOTAL_NOTFORMAT);
  const CAMBIO_FORMAT = currencyFormat(VALID_CAMBIO);
  const RESTA_PAGAR_FORMAT = currencyFormat(RESTA_PAGAR_VAL);
  const TOTAL_PAGADO_FORMAT = currencyFormat(TOTAL_PAGADO);

  const paymentObj = useMemo(() => {
    const payment: PaymentChange = {
      cambio: CAMBIO,
      cortesia: cortesia,
      efective: efective,
      isIncomplete: IS_PAYMENT_INCOMPLETE,
      propina: propina,
      subtotal: total,
      tdc: tdc,
      tdd: tdd,
      total: TOTAL_NOTFORMAT,
      vales: vales,
      discount: discount,
      total_payed: TOTAL_PAGADO,
    };
    return payment;
  }, [values]);

  return {
    handleChangeFrom: handleChange,
    valuesForm: values,
    paymentObj,
    SUBTOTAL_FORMAT,
    TOTAL_PROPINE,
    CAMBIO_FORMAT,
    RESTA_PAGAR_FORMAT,
    RESTA_PAGAR,
    IS_PAYMENT_INCOMPLETE,
    TOTAL_PAGADO_FORMAT,
    onlyShow,
  };
};
