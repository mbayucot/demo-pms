import axios from "../lib/axios";
import { User, SelectOptionType } from "../types";

export const searchUsersByRole = async (
  query: string,
  role: string
): Promise<SelectOptionType[]> => {
  const response = await axios.get(`users/index`, {
    params: {
      by_query: query,
      by_role: role,
    },
  });

  return response.data.entries.map(
    (x: User) =>
      ({
        value: x.id,
        label: x.full_name,
      } as SelectOptionType)
  );
};
