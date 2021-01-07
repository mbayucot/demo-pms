import { rest } from "msw";
import { data } from "../../../fixtures/user";

export const handlers = [
  rest.get("/users", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.post("/users", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post("/users/update_password", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
