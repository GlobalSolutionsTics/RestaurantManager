import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import jwt from "jsonwebtoken";
export const isValidJWT = (token: string) => {
  jwt.verify(token, SEED_OF_JWT, async (err) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};
