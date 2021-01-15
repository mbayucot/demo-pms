import faker from "faker";

export const data = {
  entries: Array.from(Array(11), (_, i) => ({
    id: i,
    summary: `${faker.random.number()} ${faker.lorem.word()}`,
    description: faker.lorem.words(),
    status: "pending",
    status_fmt: "To Do",
    assignee: {
      id: 1,
      email: faker.internet.email(),
      role: "staff",
      role_fmt: "Staff",
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    },
  })),
  meta: {
    current_page: 1,
    total_count: 11,
    total_pages: 2,
  },
};

export const paginationData = data;
export const searchData = data;
export const sortData = data;
