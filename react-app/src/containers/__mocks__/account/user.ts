import { rest } from "msw";
import { data } from "../../../fixtures/user";

export const handlers = [
  rest.get("/users/show", (req, res, ctx) => {
    return res(ctx.json(data.entries[0]));
  }),
  rest.patch("/users/update", (req, res, ctx) => {
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
  rest.post("/users/update_password", (req, res, ctx) => {
    const { current_password } = req.body as {
      current_password: string;
    };
    if (current_password === "__test_error_input__") {
      return res(
        ctx.status(422),
        ctx.json({ current_password: "__test_error_description__" })
      );
    }

    return res(ctx.status(200));
  }),
  rest.delete("/users/destroy_avatar", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
