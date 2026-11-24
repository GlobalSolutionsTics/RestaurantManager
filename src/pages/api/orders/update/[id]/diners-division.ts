import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { validate as validateUuid } from "uuid";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import type { UpdateDinersDivisionRequest } from "@/pages/api/types/Order/order.type";
import { CHECKS } from "@/utils/users";
import { updateDinersDivision } from "../../controllers/updateDinersDivision";

function isDivisionRequest(
  body: UpdateDinersDivisionRequest | undefined,
): body is UpdateDinersDivisionRequest {
  if (
    !body ||
    !Number.isSafeInteger(body.diners) ||
    body.diners < 1 ||
    !Array.isArray(body.allocations)
  )
    return false;

  const diners = new Set<number>();
  for (const allocation of body.allocations) {
    if (
      !Number.isSafeInteger(allocation?.diner) ||
      allocation.diner < 1 ||
      allocation.diner > body.diners ||
      diners.has(allocation.diner) ||
      !Array.isArray(allocation.dishes)
    )
      return false;

    diners.add(allocation.diner);
    const keys = new Set<string>();
    for (const dish of allocation.dishes) {
      if (
        typeof dish?.key !== "string" ||
        keys.has(dish.key) ||
        !Number.isSafeInteger(dish.number) ||
        dish.number < 1
      )
        return false;
      keys.add(dish.key);
    }
  }
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ error: true, message: "Método no permitido" });
  }

  let waiter: string;
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/, "") ?? "";
    const user = jwt.verify(token, SEED_OF_JWT);
    if (
      typeof user === "string" ||
      user.type !== CHECKS ||
      typeof user.uuid !== "string"
    ) {
      return res.status(403).json({ error: true, message: "Sin autorización" });
    }
    waiter = user.uuid;
  } catch {
    return res.status(403).json({ error: true, message: "Sin autorización" });
  }

  const { id } = req.query;
  if (
    typeof id !== "string" ||
    !validateUuid(id) ||
    !isDivisionRequest(req.body)
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Revisa los comensales y las cantidades" });
  }

  try {
    const result = await updateDinersDivision(id, waiter, req.body);
    if (result === "missing") {
      return res
        .status(404)
        .json({ error: true, message: "No se encontró el pedido" });
    }
    if (result === "conflict") {
      return res.status(409).json({
        error: true,
        message:
          "El pedido cambió o las cantidades superan las disponibles. Revisa la cuenta.",
      });
    }
    return res.status(200).json({ error: false, message: "Cuenta dividida" });
  } catch (error) {
    console.error("Error al guardar la división:", error);
    return res
      .status(500)
      .json({ error: true, message: "No se pudo guardar la división" });
  }
}
