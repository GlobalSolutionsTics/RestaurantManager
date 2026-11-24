import { PaymentChange } from "@/components/admin/paymentForm/types";
import { editPaymentInformationServiceV2 } from "@/services/order";
import { TOKEN_ID } from "@/utils/strings";
import { useState } from "react";
import { OrderAdminActions } from "./types";

export const useOrderAdminActions = ({ onReset, query }: OrderAdminActions) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentChange>();
  const [isSaved, setIsSaved] = useState(false);
  const handleSavePaymentInfo = async () => {
    if (paymentInfo && paymentInfo.isIncomplete !== true) {
      const paymentReal = { ...paymentInfo, version: 2 };

      const token = sessionStorage.getItem(TOKEN_ID);
      const save = await editPaymentInformationServiceV2(
        token || "",
        query.id as string,
        paymentReal,
      );
      if (save) {
        setIsSaved(true);
        await onReset();
      }
    }
  };

  const handleChangePaymentInfo = (prm: PaymentChange) => {
    setPaymentInfo(prm);
  };

  return {
    handleSavePaymentInfo,
    handleChangePaymentInfo,
    setPaymentInfo,
    isSaved,
    paymentInfo,
  };
};
