import { rest } from "msw";

import {
  data,
  paginationData,
  searchData,
  sortData,
} from "../../../fixtures/project";

export const handlers = [
  rest.get("/admin/projects", (req, res, ctx) => {
    const page = req.url.searchParams.get("page");
    if (page) {
      return res(ctx.json(paginationData));
    }

    const byQuery = req.url.searchParams.get("by_query");
    if (byQuery) {
      return res(ctx.json(searchData));
    }

    const byCreatedBy = req.url.searchParams.get("by_created_by");
    if (byCreatedBy) {
      return res(ctx.json(searchData));
    }

    const bySort = req.url.searchParams.get("by_sort");
    if (bySort) {
      return res(ctx.json(sortData));
    }

    return res(ctx.json(data));
  }),
  rest.post("/admin/projects", (req, res, ctx) => {
    const { name } = req.body as {
      name: string;
    };
    if (name === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ name: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.get("/admin/projects/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/admin/projects/:id", (req, res, ctx) => {
    const { name } = req.body as {
      name: string;
    };
    if (name === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ name: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.delete("/admin/projects/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
