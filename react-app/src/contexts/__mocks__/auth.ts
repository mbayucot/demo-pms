import { rest } from "msw";

import { client as data } from "../../fixtures/user";

const token = "Bearer __token__";

const handlers = [
  rest.post(`/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set("authorization", token),
      ctx.json(data)
    );
  }),
  rest.post(`/signup`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set("authorization", token),
      ctx.json(data)
    );
  }),
  rest.delete(`/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export { handlers, data };
