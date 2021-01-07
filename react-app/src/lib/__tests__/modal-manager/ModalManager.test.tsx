import React, { FC } from "react";
import ModalManager from "../../modal-manager";
import { render, screen } from "@testing-library/react";

const NewModal: FC = () => {
  return <p>New Modal</p>;
};

const MODAL_COMPONENTS = {
  NEW_MODAL: NewModal,
};

const setup = (props: { modalType: string | null }) => {
  render(<ModalManager components={MODAL_COMPONENTS} {...props} />);
};

describe("ModalManager", () => {
  it("should show modal", async () => {
    setup({
      modalType: "NEW_MODAL",
    });
    expect(screen.getByText(/New Modal/)).toBeInTheDocument();
  });

  it("should hide modal", async () => {
    setup({
      modalType: null,
    });
    expect(screen.getByRole("dialog")).not.toBeInTheDocument();
  });
});
