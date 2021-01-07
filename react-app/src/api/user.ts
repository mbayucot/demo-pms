import axios from "../lib/axios";
import { User } from "../types/models";

type OptionsType = {
  value: number;
  label: string;
};

type Params = {
  query: string;
  role: string;
};

export const searchUsersByRole = async ({
  query,
  role,
}: Params): Promise<OptionsType[]> => {
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
      } as OptionsType)
  );
};
