import { rest } from "msw";

import { User } from "../../types";

export const handlers = [
  rest.get("/confirmation", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        notice: "Your email address has been successfully confirmed.",
      })
    );
  }),
  rest.post("/password", (req, res, ctx) => {
    const { user } = req.body as {
      user: User;
    };
    if (user.email === "invalid@email.com") {
      return res(
        ctx.status(422),
        ctx.json({ email: "__test_error_description__" })
      );
    }

    return res(ctx.status(201));
  }),
  rest.put("/password", (req, res, ctx) => {
    const { user } = req.body as {
      user: {
        new_password: string;
      };
    };
    if (user.new_password === "__test_error_input__A1!") {
      return res(
        ctx.status(422),
        ctx.json({ new_password: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
];
