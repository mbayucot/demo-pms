import React, {
  FC,
  useCallback,
  useReducer,
  useMemo,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import useSWR from "swr";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useParams } from "react-router-dom";
import Select, { ValueType } from "react-select";
import { uid } from "uid";
import InfoIcon from "@atlaskit/icon/glyph/info";
import { Cell } from "react-table";
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

import SearchField from "../../../components/SearchField";
import NewTaskModal from "./NewTaskModal";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "../../../components/ConfirmModal";
import consumer from "../../../lib/cable/consumer";
import importTaskTemplate from "../../../assets/docs/import-task.csv";

import { SelectOptionType } from "../../../types";
import { Status, Task } from "../../../types/models";
import { enumKeys } from "../../../lib/utils";

const MODAL_COMPONENTS = {
  NEW_MODAL: NewTaskModal,
  EDIT_MODAL: EditTaskModal,
  CONFIRM_MODAL: ConfirmModal,
};

const TasksPage: FC = () => {
  const { projectId } = useParams<{
    projectId: string;
  }>();
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );
  const [tableState, tableDispatch] = useReducer(
    tableReducer,
    initialTableState
  );
  const [loading, showLoading] = useState<boolean>(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const { data, mutate } = useSWR([`projects/${projectId}/tasks`, tableState]);

  const [importStatus, setImportStatus] = useState<string | null>(null);

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
    async (id: number) => {
      axios.delete(`tasks/${id}`).then(() => {
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
          message: `Are you sure you want to delete ${summary}?`,
          onHide: onHide,
          onConfirm: () => handleDeleteConfirm(id),
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
              {assignee ? <p>{assignee.full_name}</p> : <p>Unassigned</p>}
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

  const handleImport = () => {
    if (fileUploadRef && fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget && event.currentTarget.files) {
        const uuid = uid();
        const formData = new FormData();
        formData.append("uuid", uuid);
        formData.append("file", event.currentTarget.files[0]);
        event.currentTarget.value = "";

        const subscription = consumer.subscriptions.create(
          { channel: "CsvChannel", uuid: uuid },
          {
            received(data: { status: number }) {
              if (data.status === 200) {
                setImportStatus("Tasks successfully imported.");
                mutate();
              } else {
                setImportStatus("Something went wrong!");
              }

              subscription.unsubscribe();
              consumer.disconnect();
              showLoading(false);
              setTimeout(() => {
                setImportStatus(null);
              }, 3000);
            },

            connected() {
              showLoading(true);
              axios.post(`projects/${projectId}/tasks/import`, formData);
            },

            rejected() {
              setImportStatus("Something went wrong!");
              setTimeout(() => {
                setImportStatus(null);
              }, 3000);
            },
          }
        );
      }
    },
    [mutate, projectId]
  );

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h4>Tasks</h4>

        <div>
          <Button
            onClick={handleCreate}
            variant="success"
            size="sm"
            className="mr-3"
          >
            New Task
          </Button>
          <OverlayTrigger
            placement={"bottom"}
            show={importStatus !== null}
            rootClose={true}
            overlay={
              <Popover id={`popover-positioned`}>
                <Popover.Title as="h3">Import status</Popover.Title>
                <Popover.Content>{importStatus}</Popover.Content>
              </Popover>
            }
          >
            <Button
              onClick={handleImport}
              variant="outline-info"
              size="sm"
              disabled={loading}
              className="mr-2"
            >
              Import from CSV
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
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            rootClose={true}
            overlay={
              <Popover id="popover-contained">
                <Popover.Title as="h6">Import Guide</Popover.Title>
                <Popover.Content>
                  <a
                    href={importTaskTemplate}
                    download="import-task-template.csv"
                  >
                    Download template
                  </a>
                </Popover.Content>
              </Popover>
            }
          >
            <Button variant="light" size={"sm"}>
              <InfoIcon size={"small"} label="Import guide" />
            </Button>
          </OverlayTrigger>
          <input
            type="file"
            ref={fileUploadRef}
            accept=".csv"
            onChange={handleFileChange}
            className="d-none"
          />
        </div>
      </div>

      <div className="d-inline-flex  mt-2">
        <div className="mr-4">
          <SearchField onSubmit={handleSearch} />
        </div>

        <div className="mr-2">
          <Select
            closeMenuOnSelect={true}
            placeholder="Status"
            options={enumKeys(Status).map((key) => {
              return {
                value: key,
                label: Status[key],
              } as SelectOptionType;
            })}
            isClearable={true}
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
                type: "SET_STATUS",
                status: selectedOption ? (selectedOption.value as Status) : "",
              });
            }}
          />
        </div>
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
