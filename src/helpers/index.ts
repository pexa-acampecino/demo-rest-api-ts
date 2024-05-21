import crypto from "crypto";

const SECRET = "demo-rest-api-ts";

export const random = (length: number) =>
  crypto.randomBytes(length).toString("base64");
export const authentication = (password: string, salt: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};
