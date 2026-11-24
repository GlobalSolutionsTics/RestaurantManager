import { Unsubscribe } from "firebase/auth";
import { ParsedUrlQuery } from "querystring";

export type OrderAdminActions = {
  query: ParsedUrlQuery;
  onReset: () => Promise<Unsubscribe | undefined>;
};
