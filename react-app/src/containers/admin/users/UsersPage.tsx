import React, { FC, useCallback, useReducer, useMemo } from "react";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import Select, { ValueType } from "react-select";
import { Cell } from "react-table";

import axios from "../../../lib/axios";
import GridTable, {
  reducer as tableReducer,
  initialTableState,
} from "../../../components/grid-table";
import ModalManager, {
  reducer as modalReducer,
  initialModalState,
} from "../../../lib/modal-manager";

import SearchField from "../../../components/SearchField";
import NewUserModal from "./NewUserModal";
import EditUserModal from "./EditUserModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { enumKeys } from "../../../lib/utils";

import { User, Role, SelectOptionType, Status } from "../../../types";


const MODAL_COMPONENTS = {
  NEW_MODAL: NewUserModal,
  EDIT_MODAL: EditUserModal,
  CONFIRM_MODAL: ConfirmModal,
};

const UsersPage: FC = () => {
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );
  const [tableState, tableDispatch] = useReducer(
    tableReducer,
    initialTableState
  );

  const { data, mutate } = useSWR(["admin/users", tableState]);

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
    async (id: number, email: string) => {
      axios.delete(`admin/users/${id}`).then((response) => {
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
    (id: number, email: string) => {
      modalDispatch({
        type: "SHOW_MODAL",
        modalType: "CONFIRM_MODAL",
        modalProps: {
          message: "Are you sure you want to delete this user?",
          onHide: onHide,
          onConfirm: () => handleDeleteConfirm(id, email),
        },
      });
    },
    [onHide, handleDeleteConfirm]
  );

  const handleSearch = useCallback(
    (searchText: string) => {
      tableDispatch({ type: "SET_QUERY", query: searchText });
    },
    [tableDispatch]
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

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: false,
      },
      {
        Header: "Name",
        accessor: "full_name",
        sortable: false,
      },
      {
        Header: "Role",
        accessor: "role",
        sortable: false,
      },
      {
        Header: " ",
        Cell: (row: Cell) => {
          const { id, email } = row.row.original as User;
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
                onClick={() => handleDelete(id, email)}
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
        <h4>Users</h4>

        <div>
          <Button onClick={handleCreate} variant="success" size="sm">
            New User
          </Button>
        </div>
      </div>

      <div className="d-flex mt-2">
        <div className="mr-4">
          <SearchField onSubmit={handleSearch} />
        </div>

        <div>
          <Select
            closeMenuOnSelect={true}
            isClearable={true}
            placeholder="Role"
            options={enumKeys(Role).map((key) => {
              return {
                value: key,
                label: Role[key],
              } as SelectOptionType;
            })}
            styles={{
              container: (base) => ({
                ...base,
                width: 250,
              }),
            }}
            onChange={(
              selectedOption?: ValueType<SelectOptionType, false> | null
            ) => {
              tableDispatch({
                type: "SET_ROLE",
                role: selectedOption ? (selectedOption.value as Role) : "",
              });
            }}
          />
        </div>
      </div>

      <GridTable<User>
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

export default UsersPage;
