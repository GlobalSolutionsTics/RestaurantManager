import { currencyFormat } from "@/utils/formats";
import { PaymentChange, Props } from "./types";
import { TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { usePaymentForm } from "./hook/usePaymentForm";

export const PaymentForm = ({ total, paymentInfo, onChange }: Props) => {
  const {
    CAMBIO_FORMAT,
    RESTA_PAGAR_FORMAT,
    SUBTOTAL_FORMAT,
    TOTAL_PROPINE,
    RESTA_PAGAR,
    IS_PAYMENT_INCOMPLETE,
    TOTAL_PAGADO_FORMAT,
    paymentObj,
    valuesForm,
    onlyShow,
    handleChangeFrom,
  } = usePaymentForm(total, paymentInfo);

  const { cortesia, discount, efective, propina, tdc, tdd, vales } = valuesForm;

  useEffect(() => {
    onChange(paymentObj);
  }, [RESTA_PAGAR]);

  return (
    <div className='w-full p-2'>
      <TextField
        label='Subtotal'
        className='w-full mb-2'
        value={SUBTOTAL_FORMAT}
        disabled
      />
      <TextField
        label='Propina'
        name='propina'
        className='w-full mb-2'
        type='number'
        value={propina}
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Pago en efectivo'
        className='w-full mb-2'
        name='efective'
        type='number'
        value={efective}
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Pago con tarjeta de crédito'
        className='w-full mb-2'
        value={tdc}
        name='tdc'
        type='number'
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Pago con tarjeta de debito'
        className='w-full mb-2'
        value={tdd}
        name='tdd'
        type='number'
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Pago con vales'
        className='w-full mb-2'
        value={vales}
        name='vales'
        type='number'
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Cortesia'
        className='w-full mb-2'
        value={cortesia}
        name='cortesia'
        type='number'
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Descuento'
        className='w-full mb-2'
        value={discount}
        name='discount'
        type='number'
        onChange={handleChangeFrom}
        disabled={onlyShow}
      />
      <TextField
        label='Total a pagar'
        className='w-full mb-2'
        value={TOTAL_PROPINE}
        disabled
      />
      <TextField
        label='Total pagado'
        className='w-full mb-2'
        value={TOTAL_PAGADO_FORMAT}
        disabled
      />
      <TextField
        label='Resta por pagar'
        className='w-full mb-2'
        value={RESTA_PAGAR_FORMAT}
        disabled
        error={IS_PAYMENT_INCOMPLETE}
      />
      <TextField
        label='Cambio'
        className='w-full mb-2'
        value={CAMBIO_FORMAT}
        disabled
      />
    </div>
  );
};
