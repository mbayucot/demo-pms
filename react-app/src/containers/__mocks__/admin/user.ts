import { rest } from "msw";

import {
  data,
  paginationData,
  searchData,
  sortData,
} from "../../../fixtures/user";

export const handlers = [
  rest.get("/admin/users", (req, res, ctx) => {
    const page = req.url.searchParams.get("page");
    if (page) {
      return res(ctx.json(paginationData));
    }

    const byQuery = req.url.searchParams.get("by_query");
    if (byQuery) {
      return res(ctx.json(searchData));
    }

    const byRole = req.url.searchParams.get("by_role");
    if (byRole) {
      return res(ctx.json(searchData));
    }

    const bySort = req.url.searchParams.get("by_sort");
    if (bySort) {
      return res(ctx.json(sortData));
    }

    return res(ctx.json(data));
  }),
  rest.post("/admin/users", (req, res, ctx) => {
    const { first_name } = req.body as {
      first_name: string;
    };
    if (first_name === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ first_name: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.get("/admin/users/:id", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/admin/users/:id", (req, res, ctx) => {
    const { first_name } = req.body as {
      first_name: string;
    };
    if (first_name === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ first_name: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.delete("/admin/users/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
