import React, { FC } from "react";
import ModalManager from "../../modal-manager";
import { render, screen, within } from "@testing-library/react";

const NewModal: FC = () => {
  return (
    <div role="dialog">
      <p>New Modal</p>
    </div>
  );
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
    expect(screen.getByText(/new modal/i)).toBeInTheDocument();
  });

  it("should hide modal", async () => {
    setup({
      modalType: null,
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should throw with invalid modalType", async () => {
    expect(() =>
      render(
        <ModalManager components={MODAL_COMPONENTS} modalType="__error__" />
      )
    ).toThrow(`modalType __error__ not found!`);
  });
});
