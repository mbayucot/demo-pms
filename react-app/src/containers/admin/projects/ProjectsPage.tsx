import React, { FC, useCallback, useReducer, useMemo, useState } from "react";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { NavLink } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { uid } from "uid";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
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
import { Project } from "../../../types/models";

import SearchField from "../../../components/SearchField";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { Can } from "../../../config/can";

import { downloadFile } from "../../../lib/cable/helpers";
import { searchUsersByRole } from "../../../api/user";
import consumer from "../../../lib/cable/consumer";

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

  const onHide = useCallback(
    async (refresh?: boolean) => {
      modalDispatch({ type: "HIDE_MODAL" });

      if (refresh) {
        await mutate();
      }
    },
    [mutate]
  );

  const handleDeleteConfirm = useCallback(
    async (id: number) => {
      axios.delete(`admin/projects/${id}`).then(() => {
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
    (id: number, name: string) => {
      modalDispatch({
        type: "SHOW_MODAL",
        modalType: "CONFIRM_MODAL",
        modalProps: {
          message: `Are you sure you want to delete ${name}?`,
          onHide: onHide,
          onConfirm: () => handleDeleteConfirm(id),
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
        Header: "Name",
        accessor: "name",
        sortable: false,
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
              <Can I="update" a="Project">
                <Button
                  variant="success"
                  size="sm"
                  className="mr-3"
                  onClick={() => handleEdit(id)}
                >
                  Edit
                </Button>
              </Can>
              <Can I="delete" a="Project">
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

  type ReceivedProps = {
    status: number;
    data: {
      file_name: string;
      content: Blob;
    };
  };

  const handleExport = useCallback(async () => {
    const uuid = uid();
    const subscription = consumer.subscriptions.create(
      { channel: "CsvChannel", uuid: uuid },
      {
        received({ status, data }: ReceivedProps) {
          if (status === 200) {
            downloadFile(data);
          } else {
            setExportStatus("Something went wrong!");
            setTimeout(() => {
              setExportStatus(null);
            }, 3000);
          }

          subscription.unsubscribe();
          consumer.disconnect();
          showLoading(false);
        },

        connected() {
          showLoading(true);
          axios.get(`admin/projects.csv`, {
            params: {
              uuid: uuid,
            },
          });
        },

        rejected() {
          setExportStatus("Something went wrong!");
          setTimeout(() => {
            setExportStatus(null);
          }, 3000);
        },
      }
    );
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h4>Projects</h4>

        <div>
          <Can I="create" a="Project">
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
            loadOptions={(inputValue: string) =>
              searchUsersByRole({
                query: inputValue,
                role: "client",
              })
            }
            isClearable={true}
            styles={{
              container: (base) => ({
                ...base,
                width: 250,
              }),
            }}
            onChange={(value) => {
              tableDispatch({
                type: "SET_ASSIGNED_TO",
                assignedTo: value ? value["value"] : "",
              });
            }}
          />
        </div>
      </div>

      <GridTable<Project>
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

export default ProjectsPage;
