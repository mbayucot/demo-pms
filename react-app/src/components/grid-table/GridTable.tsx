import React, { ReactElement, useEffect } from "react";
import {
  useTable,
  Column,
  usePagination,
  useSortBy,
  Row,
  HeaderGroup,
} from "react-table";
import Pagination from "rc-pagination";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

import "rc-pagination/assets/index.css";

import { SortDirection } from "./state";

interface SortProps {
  column: string;
  direction: SortDirection;
}

export interface DataProps<T> {
  entries: T[];
  meta: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface GridTableProps<T> {
  columns: Column[];
  error?: Error;
  loading?: boolean;
  data?: DataProps<T>;
  onPageChange: (pageIndex: number) => void;
  onSort?: ({ column, direction }: SortProps) => void;
}

type ObjectOf<T> = { [P in keyof T]: T[P] };

const GridTable = <T extends ObjectOf<T>>({
  columns,
  loading = true,
  data: { entries, meta } = {
    entries: [],
    meta: {
      current_page: 0,
      total_count: 0,
      total_pages: 0,
    },
  },
  onPageChange,
  onSort,
}: GridTableProps<T>): ReactElement => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageSize, sortBy },
  } = useTable(
    {
      columns,
      data: entries,
      manualPagination: true,
      manualSortBy: true,
      pageCount: meta.total_pages,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (onSort && sortBy !== undefined && sortBy.length > 0) {
      onSort({
        column: sortBy[0].id,
        direction: !sortBy[0].desc ? "asc" : "desc",
      });
    }
  }, [onSort, sortBy]);

  const textItemRender = (
    current: number,
    type: string,
    element: React.ReactNode
  ): React.ReactNode => {
    if (type === "prev") {
      return "Prev";
    }
    if (type === "next") {
      return "Next";
    }
    return element;
  };

  return (
    <div className="my-4">
      <Table
        hover
        {...getTableProps()}
        style={{
          border: "2px solid #eee",
        }}
      >
        <thead>
          {headerGroups.map(
            (headerGroup: HeaderGroup, headerGroupIndex: number) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={`grid-table--headerGroup${headerGroupIndex}`}
              >
                {headerGroup.headers.map((column, columnIndex) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    title={column.Header as string}
                    key={`grid-table--column${columnIndex}`}
                  >
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            )
          )}
        </thead>

        {loading ? (
          <tbody key="grid-table--loading">
            <tr>
              <td colSpan={columns.length}>
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </td>
            </tr>
          </tbody>
        ) : (
          [
            entries.length === 0 ? (
              <tbody key="grid-table--no-entries">
                <tr>
                  <td colSpan={columns.length}>No records found.</td>
                </tr>
              </tbody>
            ) : (
              <tbody {...getTableBodyProps()} key="grid-table--with-entries">
                {page.map((row: Row, rowIndex: number) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={`grid-table--row${rowIndex}`}
                    >
                      {row.cells.map((cell, cellIndex) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={`grid-table--cell${cellIndex}`}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ),
          ]
        )}
      </Table>

      {meta.total_count > 10 && (
        <div className="text-center">
          <Pagination
            onChange={onPageChange}
            current={meta.current_page}
            total={meta.total_count}
            pageSize={pageSize}
            itemRender={textItemRender}
            showLessItems={true}
            showQuickJumper={false}
            hideOnSinglePage={true}
          />
        </div>
      )}
    </div>
  );
};

export default GridTable;
