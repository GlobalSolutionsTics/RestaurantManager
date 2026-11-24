import { NextApiRequest, NextApiResponse } from "next";
import { TOrder } from "../types/Order/order.type";
import { v4 as uuidv4, validate as validateUuid } from "uuid";
import addOrder from "./controllers/addOrder";
import { OrdersDishesStatus } from "@/enums/orders.enum";
import { isValidDishNote, trimDishNote } from "@/utils/orderDishNotes";
import { getActualDateDB } from "@/utils/formats";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(404).end();
  }

  const body: TOrder = req.body;
  if (
    !Number.isInteger(body?.tableNumber) ||
    !isValidDishNote(body.notes) ||
    !Array.isArray(body.dishesDescription) ||
    body.dishesDescription.some((dish) => !dish || !isValidDishNote(dish.notes))
  ) {
    return res.status(400).send({ error: true, message: "Pedido inválido" });
  }

  const today = getActualDateDB().fullDate;
  const key = req.headers["idempotency-key"];
  let date = today;
  let uuid = uuidv4();

  if (key !== undefined) {
    const match =
      typeof key === "string" && /^(\d{4}\/\d{2}\/\d{2}):(.+)$/.exec(key);
    if (!match || !validateUuid(match[2]) || match[1] > today) {
      return res
        .status(400)
        .send({ error: true, message: "Clave de envío inválida" });
    }
    date = match[1];
    uuid = match[2].toLowerCase();
  }

  const { name, dishes, tableNumber, waiter, diners } = body;

  try {
    const confirmed = await addOrder(
      {
        name,
        dishes,
        tableNumber,
        waiter,
        ...(diners !== undefined && { diners }),
        ...(body.notes?.trim() && { notes: body.notes.trim() }),
        dishesDescription: body.dishesDescription.map((dish) => ({
          ...trimDishNote(dish),
          status: OrdersDishesStatus.SENT,
        })),
      },
      uuid,
      date,
      date === today,
    );

    if (confirmed) return res.status(201).send({ error: false, message: uuid });

    if (date !== today) {
      return res.status(409).send({
        error: true,
        message: "El envío corresponde a un día anterior",
      });
    }

    return res.status(202).send({
      error: true,
      message: "Esta mesa ya tiene una orden, favor de verificarla",
    });
  } catch (error) {
    console.error("Error al insertar en DB:", error);
    return res
      .status(500)
      .send({ error: true, message: "Error al insertar en la bd" });
  }
};

export default handler;
