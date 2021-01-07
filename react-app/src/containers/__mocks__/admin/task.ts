import { rest } from "msw";

import { data } from "../../../fixtures/task";

export const handlers = [
  rest.get("/admin/projects/:projectId/tasks", (req, res, ctx) => {
    return res(ctx.json(data));
  }),
  rest.post("/admin/projects/:projectId/tasks", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/admin/projects/:projectId/tasks/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/admin/projects/:projectId/tasks/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("/admin/projects/:projectId/tasks/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
