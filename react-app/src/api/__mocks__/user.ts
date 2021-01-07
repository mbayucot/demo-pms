import { rest } from "msw";

import { data } from "../../fixtures/user";

export const handlers = [
  rest.get("/users/index", (req, res, ctx) => {
    return res(ctx.json(data));
  }),
];
