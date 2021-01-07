import { createContext } from "react";
import { createContextualCan } from "@casl/react";
import { AppAbility } from "./ability";

export const AbilityContext = createContext<AppAbility>(
  (null as unknown) as AppAbility
);

export const Can = createContextualCan(AbilityContext.Consumer);
