import React, { FC, useCallback, useReducer, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import { Cell } from "react-table";
import { uid } from "uid";
import AsyncSelect from "react-select/async";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Spinner from "react-bootstrap/Spinner";

import axios from "../../../lib/axios";
import GridTable, {
  reducer as tableReducer,
  initialTableState,
} from "../../../components/grid-table";
import ModalManager, {
  reducer as modalReducer,
  initialModalState,
} from "../../../lib/modal-manager";
import { Project } from "../../../types";

import SearchField from "../../../components/SearchField";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { Can } from "../../../config/can";

import { searchUsersByRole } from "../../../api/user";
import consumer, { downloadFile, ReceivedProps } from "../../../lib/cable";

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
  const [loading, showLoading] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const { data, mutate } = useSWR(["admin/projects", tableState]);

  const handleModalClose = useCallback(
    async (refresh?: boolean) => {
      if (refresh) {
        await mutate();
      }
      modalDispatch({ type: "HIDE_MODAL" });
    },
    [mutate]
  );

  const handleConfirmedDelete = useCallback(
    async (id: number) => {
      await axios.delete(`admin/projects/${id}`);
      await handleModalClose(true);
    },
    [handleModalClose]
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

  const handleSortChange = useCallback(({ column, direction }) => {
    tableDispatch({ type: "SET_SORT", column, direction });
  }, []);

  const handleClientChange = useCallback((selectedOption) => {
    tableDispatch({
      type: "SET_CREATED_BY",
      createdBy: selectedOption ? selectedOption.value : "",
    });
  }, []);

  const handleExportReceived = useCallback(
    ({ status, data }: ReceivedProps) => {
      if (status === 200 && data) {
        downloadFile(data);
      } else {
        setExportStatus("Something went wrong.");
        setTimeout(() => {
          setExportStatus(null);
        }, 3000);
      }

      showLoading(false);
    },
    []
  );

  const handleExportConnected = useCallback(async (uuid: string) => {
    showLoading(true);
    await axios.get(`admin/projects.csv`, {
      params: {
        uuid: uuid,
      },
    });
  }, []);

  const handleExportRejected = useCallback(() => {
    setExportStatus("Something went wrong.");
    setTimeout(() => {
      setExportStatus(null);
    }, 3000);
  }, []);

  const handleExport = useCallback(async () => {
    const uuid = uid();
    const subscription = consumer.subscriptions.create(
      { channel: "CsvChannel", uuid: uuid },
      {
        received(response) {
          handleExportReceived(response);
          subscription.unsubscribe();
          consumer.disconnect();
        },

        connected() {
          handleExportConnected(uuid);
        },

        rejected() {
          handleExportRejected();
        },
      }
    );
  }, [handleExportReceived, handleExportConnected, handleExportRejected]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortable: true,
        Cell: (cell: Cell) => {
          const { id, name } = cell.row.original as Project;
          return <NavLink to={`/admin/projects/${id}/tasks`}>{name}</NavLink>;
        },
      },
      {
        Header: "Client",
        Cell: (row: Cell) => {
          const { client } = row.row.original as Project;
          return <div>{client?.full_name}</div>;
        },
      },
      {
        Header: " ",
        Cell: (row: Cell) => {
          const { id, name } = row.row.original as Project;
          return (
            <div className="text-right">
              <Can I="update" a="AdminProject">
                <Button
                  variant="success"
                  size="sm"
                  className="mr-3"
                  onClick={() => handleEdit(id)}
                >
                  Edit
                </Button>
              </Can>
              <Can I="delete" a="AdminProject">
                <Button
                  variant="danger"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleDelete(id, name)}
                >
                  Delete
                </Button>
              </Can>
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
          <Can I="create" a="AdminProject">
            <Button
              onClick={handleCreate}
              variant="success"
              size="sm"
              className="mr-3"
            >
              New Project
            </Button>
          </Can>
          <OverlayTrigger
            placement={"bottom"}
            show={exportStatus !== null}
            rootClose={true}
            overlay={
              <Popover id={`popover-positioned`}>
                <Popover.Title as="h3">Export status</Popover.Title>
                <Popover.Content>{exportStatus}</Popover.Content>
              </Popover>
            }
          >
            <Button
              onClick={handleExport}
              variant="outline-info"
              size="sm"
              disabled={loading}
            >
              Export to CSV
              {loading && (
                <Spinner
                  animation="border"
                  role="status"
                  size="sm"
                  className="ml-1"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      <div className="d-flex mt-2">
        <div className="mr-4">
          <SearchField onSubmit={handleSearch} />
        </div>
        <div className="mr-2">
          <AsyncSelect
            closeMenuOnSelect={true}
            cacheOptions
            defaultOptions
            placeholder="Client"
            inputId="client"
            loadOptions={(inputValue: string) =>
              searchUsersByRole(inputValue, "client")
            }
            isClearable={true}
            styles={{
              container: (base) => ({
                ...base,
                width: 250,
              }),
            }}
            onChange={handleClientChange}
          />
        </div>
      </div>

      <GridTable<Project>
        columns={columns}
        loading={!data}
        data={data}
        onPageChange={handlePageChange}
        onSort={handleSortChange}
      />

      <ModalManager components={MODAL_COMPONENTS} {...modalState} />
    </>
  );
};

export default ProjectsPage;
