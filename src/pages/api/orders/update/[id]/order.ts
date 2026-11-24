import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { validate as validateUuid } from "uuid";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";
import type { EditDishesRequest } from "@/pages/api/types/Order/order.type";
import { updateDishesAndNumber } from "../../controllers/updateOrder";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authorization =
    req.headers.authorization || req.headers["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  try {
    if (!token) throw new Error("Falta el token");
    jwt.verify(token, SEED_OF_JWT);
  } catch {
    return res.status(403).send({ error: true, message: "Sin autorización" });
  }

  if (req.method !== HttpMethodsEnum.PUT) {
    return res
      .status(405)
      .send({ error: true, message: "Método no permitido" });
  }

  const orderId = req.query.id;
  const modifications: EditDishesRequest["modifications"] | undefined =
    req.body?.modifications;
  const dishes = modifications?.dishesDescription;
  if (
    typeof orderId !== "string" ||
    !validateUuid(orderId) ||
    modifications?.orderUUID !== orderId ||
    !Array.isArray(dishes) ||
    dishes.length === 0 ||
    dishes.some(
      (dish) =>
        typeof dish?.name !== "string" ||
        !Number.isFinite(dish.price) ||
        !Number.isInteger(dish.number) ||
        (dish.number ?? 0) < 0,
    ) ||
    !Array.isArray(modifications.originalDishes) ||
    modifications.originalDishes.length !== dishes.length ||
    modifications.originalDishes.some(
      (dish, index) =>
        !dish || typeof dish !== "object" || dish.uuid !== dishes[index].uuid,
    )
  ) {
    return res
      .status(400)
      .send({ error: true, message: "Modificación inválida para este pedido" });
  }

  try {
    const applied = await updateDishesAndNumber(orderId, modifications);
    if (!applied) {
      return res
        .status(409)
        .send({
          error: true,
          message: "El pedido no existe o cambió desde que se abrió",
        });
    }
    return res
      .status(200)
      .send({ error: false, message: "Actualización completada" });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return res
      .status(500)
      .send({ error: true, message: "Error al actualizar la orden" });
  }
};

export default handler;
