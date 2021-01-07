import faker from "faker";
import { client } from "./user";

const projects = Array.from(Array(11), (_, i) => ({
  id: i,
  name: `${faker.random.number()} ${faker.lorem.word()}`,
  client: client,
}));

export const data = {
  entries: projects,
  meta: {
    current_page: 1,
    total_count: 11,
    total_pages: 2,
  },
};
