import React, { FC, useCallback, useReducer, useMemo } from "react";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select, { ValueType } from "react-select";
import { Cell } from "react-table";

import axios from "../../../lib/axios";
import GridTable, {
  initialTableState,
  reducer as tableReducer,
} from "../../../components/grid-table";
import ModalManager, {
  reducer as modalReducer,
  initialModalState,
} from "../../../lib/modal-manager";

import SearchField from "../../../components/SearchField";
import NewTaskModal from "./NewTaskModal";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "../../../components/ConfirmModal";

import { searchUsersByRole } from "../../../api/user";
import { SelectOptionType } from "../../../types";
import { Status, Task } from "../../../types/models";
import { enumKeys } from "../../../lib/utils";

const MODAL_COMPONENTS = {
  NEW_MODAL: NewTaskModal,
  EDIT_MODAL: EditTaskModal,
  CONFIRM_MODAL: ConfirmModal,
};

type stateType = {
  projectId: string;
};

const TasksPage: FC = () => {
  const { projectId } = useParams<stateType>();
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );
  const [tableState, tableDispatch] = useReducer(
    tableReducer,
    initialTableState
  );

  const { data, mutate } = useSWR([
    `admin/projects/${projectId}/tasks`,
    tableState,
  ]);

  const onHide = useCallback(
    async (refresh?: boolean) => {
      if (refresh) {
        await mutate();
      }

      modalDispatch({ type: "HIDE_MODAL" });
    },
    [mutate]
  );

  const handleDeleteConfirm = useCallback(
    async (id: number, summary: string) => {
      axios.delete(`admin/tasks/${id}`).then(() => {
        onHide(true);
      });
    },
    [onHide]
  );

  const handleCreate = useCallback(() => {
    modalDispatch({
      type: "SHOW_MODAL",
      modalType: "NEW_MODAL",
      modalProps: {
        onHide: onHide,
      },
    });
  }, [onHide]);

  const handleEdit = useCallback(
    (id: number) => {
      modalDispatch({
        type: "SHOW_MODAL",
        modalType: "EDIT_MODAL",
        modalProps: {
          id,
          onHide: onHide,
        },
      });
    },
    [onHide]
  );

  const handleDelete = useCallback(
    (id: number, summary: string) => {
      modalDispatch({
        type: "SHOW_MODAL",
        modalType: "CONFIRM_MODAL",
        modalProps: {
          message: "Are you sure you want to delete this task?",
          onHide: onHide,
          onConfirm: () => handleDeleteConfirm(id, summary),
        },
      });
    },
    [onHide, handleDeleteConfirm]
  );

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      tableDispatch({ type: "SET_PAGE_INDEX", pageIndex });
    },
    [tableDispatch]
  );

  const handleSortChange = useCallback(
    ({ column, direction }) => {
      tableDispatch({ type: "SET_SORT", column, direction });
    },
    [tableDispatch]
  );

  const handleSearch = useCallback(
    (searchText: string) => {
      tableDispatch({ type: "SET_QUERY", query: searchText });
    },
    [tableDispatch]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Summary",
        accessor: "summary",
        sortable: false,
      },
      {
        Header: "Status",
        accessor: "status_fmt",
        sortable: false,
      },
      {
        Header: "Assignee",
        Cell: (row: Cell) => {
          const { assignee } = row.row.original as Task;
          return (
            <div>
              {assignee ? <p>{assignee.first_name}</p> : <p>Unassigned</p>}
            </div>
          );
        },
      },
      {
        Header: " ",
        Cell: (row: Cell) => {
          const { id, summary } = row.row.original as Task;
          return (
            <div className="text-right">
              <Button
                variant="success"
                size="sm"
                className="mr-3"
                onClick={() => handleEdit(id)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="mr-2"
                onClick={() => handleDelete(id, summary)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h4>Tasks</h4>

        <div>
          <Button onClick={handleCreate} variant="success" size="sm">
            New Task
          </Button>
        </div>
      </div>

      <div className="d-inline-flex  mt-2">
        <div className="mr-4">
          <SearchField onSubmit={handleSearch} />
        </div>

        <div className="mr-4">
          <Select
            closeMenuOnSelect={true}
            placeholder="Status"
            options={enumKeys(Status).map((key) => {
              return {
                value: key,
                label: Status[key],
              } as SelectOptionType;
            })}
            inputId="status"
            styles={{
              container: (base) => ({
                ...base,
                width: 250,
              }),
            }}
            isClearable={true}
            onChange={(
              selectedOption?: ValueType<SelectOptionType, false> | null
            ) => {
              tableDispatch({
                type: "SET_STATUS",
                status: selectedOption ? (selectedOption.value as Status) : "",
              });
            }}
          />
        </div>

        <AsyncSelect
          closeMenuOnSelect={true}
          cacheOptions
          defaultOptions
          placeholder="Assignee"
          inputId="assignee"
          name="assignee"
          loadOptions={(inputValue: string) =>
            searchUsersByRole({
              query: inputValue,
              role: "staff",
            })
          }
          styles={{
            container: (base) => ({
              ...base,
              width: 250,
            }),
          }}
          isClearable={true}
          onChange={(value) => {
            tableDispatch({
              type: "SET_ASSIGNED_TO",
              assignedTo: value ? value["value"] : "",
            });
          }}
        />
      </div>

      <GridTable<Task>
        columns={columns}
        loading={!data}
        data={data}
        setPageIndex={handlePageChange}
        setSort={handleSortChange}
      />

      <ModalManager components={MODAL_COMPONENTS} {...modalState} />
    </div>
  );
};

export default TasksPage;
