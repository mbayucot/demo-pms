import { Ability, AbilityClass, AbilityBuilder } from "@casl/ability";

import { User, Role } from "../../types/models";

const actions = ["create", "read", "update", "delete"] as const;
type Actions = typeof actions[number];
export type Subjects =
  | "AdminProject"
  | "AdminTask"
  | "Project"
  | "Task"
  | "User"
  | "all";

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbilityClass = Ability as AbilityClass<AppAbility>;

export const defineAbilityFor = (user: User): AppAbility => {
  const { can, rules } = new AbilityBuilder<AppAbility>();
  const manage = Object.keys(actions) as Actions[];

  switch (user?.role) {
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
