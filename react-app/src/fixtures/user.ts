import faker from "faker";
import { User, Role } from "../types";

const roles = Object.keys(Role);
const roleNames = Object.values(Role);

export const data = {
  entries: Array.from(Array(11), (_, i) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.firstName();
    const rand = Math.floor(Math.random() * roles.length);
    return {
      id: i,
      email: faker.internet.email(),
      role: roles[rand],
      role_fmt: roleNames[rand],
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
    };
  }),
  meta: {
    current_page: 1,
    total_count: 11,
    total_pages: 2,
  },
};

export const paginationData = data;
export const searchData = data;
export const sortData = data;

export const admin: User = {
  id: 1,
  email: faker.internet.email(),
  role: "admin",
  role_fmt: "Admin",
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
};

export const staff: User = {
  id: 2,
  email: faker.internet.email(),
  role: "staff",
  role_fmt: "Staff",
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
};

export const client: User = {
  id: 3,
  email: faker.internet.email(),
  role: "client",
  role_fmt: "Client",
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
};
