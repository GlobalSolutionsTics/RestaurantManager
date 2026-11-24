export type ModalOptionsProps = {
  title: string;
  description: string;
  show: boolean;
  onAccept: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
};
