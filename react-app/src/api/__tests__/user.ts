import { setupServer } from "msw/node";

import { searchUsersByRole } from "../user";
import { handlers } from "../__mocks__/user";
import { data as userData } from ".././../fixtures/user";

describe("getUsersByQueryAndRole", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should return users by query", async () => {
    const data = await searchUsersByRole("hey", "staff");
    const record = userData.entries[0];
    const result = {
      value: record.id,
      label: record.full_name,
    };
    expect(data[0]).toMatchObject(result);
  });
});
