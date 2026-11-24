import { HttpMethodsEnum } from "@/enums/http.enum";
import { StatusEnum } from "@/enums/states.enum";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import { getKitchenIdentity } from "@/utils/kitchenOrder";
import { KITCHEN } from "@/utils/users";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { validate as isUuid } from "uuid";
import { advanceKitchenStatus } from "../../../controllers/advanceKitchenStatus";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== HttpMethodsEnum.PUT) {
    res.setHeader("Allow", HttpMethodsEnum.PUT);
    return res
      .status(405)
      .json({ error: true, message: "Método no permitido." });
  }

  let kitchenIdentity: string | undefined;
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = jwt.verify(token ?? "", SEED_OF_JWT);
    if (typeof session === "string" || session.type !== KITCHEN) {
      return res
        .status(403)
        .json({ error: true, message: "Se requiere un usuario de cocina." });
    }
    kitchenIdentity = getKitchenIdentity(
      typeof session.kitchenType === "string" ? session.kitchenType : undefined,
      typeof session.uuid === "string" ? session.uuid : undefined,
    );
  } catch {
    return res
      .status(401)
      .json({ error: true, message: "La sesión no es válida." });
  }

  if (!kitchenIdentity) {
    return res
      .status(403)
      .json({
        error: true,
        message: "No se pudo identificar la cocina de la sesión.",
      });
  }

  const { id } = req.query;
  const { expectedStatus, expectedAction } = req.body ?? {};
  if (
    typeof id !== "string" ||
    !isUuid(id) ||
    (expectedStatus !== undefined &&
      expectedStatus !== StatusEnum.SEND &&
      expectedStatus !== StatusEnum.EDITED &&
      expectedStatus !== StatusEnum.IN_PROGRESS) ||
    (expectedAction !== undefined &&
      expectedAction !== "prepare" &&
      expectedAction !== "finish")
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Solicitud de actualización inválida." });
  }

  try {
    const result = await advanceKitchenStatus(
      id,
      kitchenIdentity,
      expectedStatus,
      expectedAction,
    );
    if (result === "missing") {
      return res
        .status(404)
        .json({ error: true, message: "No se encontró la orden." });
    }
    if (result === "conflict") {
      return res.status(409).json({
        error: true,
        message:
          "La orden cambió o no hay platillos de esta cocina por actualizar.",
      });
    }
    return res
      .status(200)
      .json({ error: false, message: "Orden actualizada." });
  } catch (error) {
    console.error("Error al actualizar los platillos de cocina:", error);
    return res
      .status(500)
      .json({ error: true, message: "No se pudo actualizar la orden." });
  }
}
