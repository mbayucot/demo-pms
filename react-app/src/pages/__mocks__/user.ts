import { rest } from "msw";

export const handlers = [
  rest.get("/confirmation", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post("/password", (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.put("/password", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
