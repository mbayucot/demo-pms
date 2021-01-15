import { rest } from "msw";

import { client as data } from "../../fixtures/user";
import { User } from "../../types";

const token = "__test_token__";

const handlers = [
  rest.post(`/signup`, (req, res, ctx) => {
    const { user } = req.body as {
      user: User;
    };
    if (user.email === "invalid@email.com") {
      return res(
        ctx.status(422),
        ctx.json({ email: "__test_error_description__" })
      );
    }

    return res(
      ctx.status(200),
      ctx.set("authorization", token),
      ctx.json(data)
    );
  }),
  rest.post(`/login`, (req, res, ctx) => {
    const { user } = req.body as {
      user: User;
    };
    if (user.email === "invalid@email.com") {
      return res(
        ctx.status(422),
        ctx.json({ email: "__test_error_description__" })
      );
    }

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
