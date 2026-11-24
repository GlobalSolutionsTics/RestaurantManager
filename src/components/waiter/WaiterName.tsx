import { useWaiterName } from "./useWaiterName";

export default function WaiterName({ waiterId }: { waiterId?: string }) {
  const name = useWaiterName(waiterId);
  return <span>{name}</span>;
}
