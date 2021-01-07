import faker from "faker";
import { Role } from "../types/models";

const roles = Object.keys(Role);

const users = Array.from(Array(11), (_, i) => ({
  id: i,
  email: faker.internet.email(),
  role: roles[Math.floor(Math.random() * roles.length)],
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
}));

export const data = {
  entries: users,
  meta: {
    current_page: 1,
    total_count: 11,
    total_pages: 2,
  },
};

export const client = users.find((x) => x.role === Role.client);
export const staff = users.find((x) => x.role === Role.staff);
