import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import faker from "faker";

import GridTable, { GridTableProps } from "../components/grid-table";
import { Project } from "../types/models";

export default {
  title: "Example/GridTable",
  component: GridTable,
  argTypes: {
    setPageIndex: { action: "clicked" },
    setSort: { action: "clicked" },
  },
} as Meta;

const Template: Story<GridTableProps<Project>> = (args) => (
  <GridTable<Project> {...args} />
);

export const Default = Template.bind({});
Default.args = {
  columns: [
    {
      Header: "Name",
      accessor: "name",
    },
  ],
  data: {
    entries: Array.from(Array(10), (_, i) => ({
      id: i,
      name: `${faker.random.number()} ${faker.lorem.word()}`,
    })),
    meta: {
      current_page: 1,
      total_count: 11,
      total_pages: 2,
    },
  },
};

export const Loading = Template.bind({});
Loading.args = {
  columns: Default.args.columns,
  loading: true,
};

export const NoData = Template.bind({});
NoData.args = {
  columns: Default.args.columns,
};
