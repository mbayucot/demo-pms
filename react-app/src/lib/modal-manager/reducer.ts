import { ModalState } from "./state";

type Action =
  | {
      type: "SHOW_MODAL";
      modalType: string;
      modalProps?: object;
    }
  | { type: "HIDE_MODAL" };

const reducer = (state: ModalState, action: Action): ModalState => {
  switch (action.type) {
    case "SHOW_MODAL":
      return {
        ...state,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case "HIDE_MODAL":
      return {
        ...state,
        modalType: null,
        modalProps: undefined,
      };
  }
};

export default reducer;
