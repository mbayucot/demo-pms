import { rest } from "msw";

import { data } from "../../../fixtures/user";

export const handlers = [
  rest.get("/admin/users", (req, res, ctx) => {
    return res(ctx.json(data));
  }),
  rest.post("/admin/users", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/admin/users/1", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/admin/users/1", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("/admin/users/1", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
