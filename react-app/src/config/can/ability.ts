import { Ability, AbilityClass, AbilityBuilder } from "@casl/ability";

import { User, Role } from "../../types";

const manage = ["create", "read", "update", "delete"];
type Actions = typeof manage[number];
export type Subjects =
  | "AdminProject"
  | "AdminTask"
  | "Project"
  | "Task"
  | "User"
  | "all";

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbilityClass = Ability as AbilityClass<AppAbility>;

export const defineAbilityFor = (user?: User): AppAbility => {
  const { can, rules } = new AbilityBuilder<AppAbility>();
  const role = Role[user?.role as keyof typeof Role];

  switch (role) {
    case Role.admin:
      can(manage, "AdminProject");
      can(manage, "AdminTask");
      can(manage, "User");
      break;
    case Role.staff:
      can(["read"], "AdminProject");
      can(manage, "AdminTask");
      break;
    case Role.client:
      can(manage, "Project");
      can(manage, "Task");
      break;
  }

  return new AppAbilityClass(rules);
};

export default defineAbilityFor;
