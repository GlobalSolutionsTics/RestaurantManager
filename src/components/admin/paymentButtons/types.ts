export type Props = {
  onSave: () => Promise<void>;
  onPrint: any;
  onAddClient: () => Promise<void>;
  disabledSave: boolean;
};
