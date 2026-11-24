import type { KitchenType } from "@/types/kitchen.types";

export type ExcelEditorProps = {
  kitchens: KitchenType[];
  kitchensDisabled: boolean;
  handleBackEditSection: () => void;
};
