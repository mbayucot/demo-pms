import { rest } from "msw";

import { data } from "../../../fixtures/task";

export const handlers = [
  rest.get("/projects/:projectId/tasks/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.post("/projects/:projectId/tasks", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/tasks/:id", (req, res, ctx) => {
    return res(ctx.json(data));
  }),
  rest.patch("/tasks/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete("/tasks/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
