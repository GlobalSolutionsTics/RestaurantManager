import { EMeasurementProducts } from "@/enums/measurement.enum";

export type TInventoryProduct = {
  uuid?: string;
  name: string;
  cant: number;
  measurement: EMeasurementProducts | string;
  createAt?: string;
  updateAt?: string;
  isDeleted?: boolean;
};
