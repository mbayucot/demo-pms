import { rest } from "msw";

import {
  data,
  paginationData,
  searchData,
  sortData,
} from "../../../fixtures/task";

export const handlers = [
  rest.get(`/projects/:projectId/tasks`, (req, res, ctx) => {
    const page = req.url.searchParams.get("page");
    if (page) {
      return res(ctx.json(paginationData));
    }

    const byQuery = req.url.searchParams.get("by_query");
    if (byQuery) {
      return res(ctx.json(searchData));
    }

    const bySort = req.url.searchParams.get("by_sort");
    if (bySort) {
      return res(ctx.json(sortData));
    }

    return res(ctx.json(data));
  }),
  rest.post("/projects/:projectId/tasks", (req, res, ctx) => {
    const { summary } = req.body as {
      summary: string;
    };
    if (summary === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ summary: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.get("/tasks/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/tasks/:id", (req, res, ctx) => {
    const { summary } = req.body as {
      summary: string;
    };
    if (summary === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ summary: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.delete("/tasks/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
