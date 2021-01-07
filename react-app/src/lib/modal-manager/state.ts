import { Nullable } from "../../types";

export type ModalType = "NEW_MODAL" | "EDIT_MODAL" | "CONFIRM_MODAL";

export interface ModalState {
  modalType: Nullable<string>;
  modalProps?: unknown;
}

export const initialModalState: ModalState = {
  modalType: null,
};
