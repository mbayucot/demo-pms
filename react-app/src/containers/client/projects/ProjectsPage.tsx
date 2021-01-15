import React, { FC, useCallback, useReducer, useMemo } from "react";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { Cell } from "react-table";
import Button from "react-bootstrap/Button";

import axios from "../../../lib/axios";
import GridTable, {
  reducer as tableReducer,
  initialTableState,
} from "../../../components/grid-table";
import ModalManager, {
  reducer as modalReducer,
  initialModalState,
} from "../../../lib/modal-manager";

import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import ConfirmModal from "../../../components/ConfirmModal";

import SearchField from "../../../components/SearchField";

import { Project } from "../../../types";

type ProjectItem = Omit<Project, "created_by" | "user">;

const MODAL_COMPONENTS = {
  NEW_MODAL: NewProjectModal,
  EDIT_MODAL: EditProjectModal,
  CONFIRM_MODAL: ConfirmModal,
};

const ProjectsPage: FC = () => {
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );
  const [tableState, tableDispatch] = useReducer(
    tableReducer,
    initialTableState
  );

  const { data, mutate } = useSWR(["projects", tableState]);

  const handleModalClose = useCallback(
    async (refresh?: boolean) => {
      if (refresh) {
        await mutate();
      }
      modalDispatch({ type: "HIDE_MODAL" });
    },
    [mutate]
  );

  const handleCreate = () => {
    modalDispatch({
      type: "SHOW_MODAL",
      modalType: "NEW_MODAL",
      modalProps: {
        onHide: handleModalClose,
      },
    });
  };

  const handleEdit = useCallback(
    (id: number) => {
      modalDispatch({
        type: "SHOW_MODAL",
        modalType: "EDIT_MODAL",
        modalProps: {
          id,
          onHide: handleModalClose,
        },
      });
    },
    [handleModalClose]
  );

  const handleConfirmedDelete = useCallback(
    async (id: number) => {
      await axios.delete(`projects/${id}`);
      await handleModalClose(true);
    },
    [handleModalClose]
  );

  const handleDelete = useCallback(
    (id: number, name: string) => {
      modalDispatch({
        type: "SHOW_MODAL",
        modalType: "CONFIRM_MODAL",
        modalProps: {
          message: `Are you sure you want to delete <span class="font-weight-bold">${name}</span>?`,
          onHide: async (isOk: boolean) => {
            if (isOk) {
              await handleConfirmedDelete(id);
            } else {
              modalDispatch({ type: "HIDE_MODAL" });
            }
          },
        },
      });
    },
    [handleConfirmedDelete]
  );

  const handleSearch = useCallback((searchText: string) => {
    tableDispatch({ type: "SET_QUERY", query: searchText });
  }, []);

  const handlePageChange = useCallback((pageIndex: number) => {
    tableDispatch({ type: "SET_PAGE_INDEX", pageIndex });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortable: false,
        Cell: (row: Cell) => {
          const { id, name } = row.row.original as Project;
          return <NavLink to={`/projects/${id}/tasks`}>{name}</NavLink>;
        },
      },
      {
        Header: " ",
        Cell: (row: Cell) => {
          const { id, name } = row.row.original as Project;
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
                onClick={() => handleDelete(id, name)}
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
    <>
      <div className="d-flex justify-content-between">
        <h4>Projects</h4>

        <div>
          <Button onClick={handleCreate} variant="success" size="sm">
            New Project
          </Button>
        </div>
      </div>

      <div className="d-flex mt-2">
        <SearchField onSubmit={handleSearch} />
      </div>

      <GridTable<ProjectItem>
        columns={columns}
        loading={!data}
        data={data}
        onPageChange={handlePageChange}
      />

      <ModalManager components={MODAL_COMPONENTS} {...modalState} />
    </>
  );
};

export default ProjectsPage;
