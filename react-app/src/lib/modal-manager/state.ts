export type Nullable<T> = T | null;

export interface FormWithModalProps {
  id?: number;
  onHide: (refresh?: boolean) => void;
}

export interface ModalState {
  modalType: Nullable<string>;
  modalProps?: unknown;
}

export const initialModalState: ModalState = {
  modalType: null,
};
