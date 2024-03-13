import { TOKEN_ID } from "./strings";

export const ADMIN = "admin";
export const CASHER = "caja";
export const CHECKS = "mesero";
export const KITCHEN = "cocina";

export var TOKEN: any;
if (typeof sessionStorage !== "undefined") {
  TOKEN = sessionStorage!.getItem(TOKEN_ID);
}
