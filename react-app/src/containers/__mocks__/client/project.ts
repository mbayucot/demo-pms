import { rest } from "msw";

import { data } from "../../../fixtures/project";

export const handlers = [
  rest.get("/projects", (req, res, ctx) => {
    return res(ctx.json(data));
  }),
  rest.post("/projects", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/projects/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/projects/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("/projects/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
