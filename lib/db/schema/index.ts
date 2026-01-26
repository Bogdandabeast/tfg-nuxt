import * as auth from "./auth";

export * from "./auth";
export * from "./companies";
export * from "./customers";
export * from "./expenses";
export * from "./products";
export * from "./sales";

export const user_schema = {
  ...auth,
};
