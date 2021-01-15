import React, { ReactElement, FC } from "react";
import { ModalState } from "./state";

type ComponentsType = {
  [key: string]: FC<any>;
};

interface ModalManagerProps extends ModalState {
  components: ComponentsType;
}

const ModalManager = ({
  components,
  modalType,
  modalProps,
}: ModalManagerProps): ReactElement | null => {
  if (!modalType) {
    return null;
  }

  if (!Object.keys(components).includes(modalType)) {
    throw new Error(`modalType ${modalType} not found!`);
  }

  const SpecificModal = components[modalType];
  return <SpecificModal {...modalProps} />;
};

export default ModalManager;
