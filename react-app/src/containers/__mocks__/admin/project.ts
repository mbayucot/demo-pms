import { rest } from "msw";

import { data } from "../../../fixtures/project";

export const handlers = [
  rest.get("/admin/projects", (req, res, ctx) => {
    return res(ctx.json(data));
  }),
  rest.post("/admin/projects", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/admin/projects/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/admin/projects/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("/admin/projects/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
