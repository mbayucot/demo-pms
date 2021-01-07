import faker from "faker";

import { staff } from "./user";

const tasks = Array.from(Array(11), (_, i) => ({
  id: i,
  summary: `${faker.random.number()} ${faker.lorem.word()}`,
  description: faker.lorem.words(),
  status: "pending",
  status_fmt: "To Do",
  assignee: staff,
}));

export const data = {
  entries: tasks,
  meta: {
    current_page: 1,
    total_count: 11,
    total_pages: 2,
  },
};
