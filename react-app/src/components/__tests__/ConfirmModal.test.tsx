import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConfirmModal from "../ConfirmModal";

const setup = () => {
  const onHide = jest.fn();
  const onConfirm = jest.fn();
  const props = {
    message: "__test_message__",
    onHide,
    onConfirm,
  };
  const utils = render(<ConfirmModal {...props} />);
  const clickOk = () => userEvent.click(utils.getByText(/ok/i));
  const clickCancel = () => userEvent.click(utils.getByText(/cancel/i));
  return { clickOk, clickCancel, onHide, onConfirm };
};

describe("ConfirmModal", () => {
  it("should render modal and close modal on ok click", async () => {
    const { clickOk, onConfirm } = setup();
    expect(screen.getByText(/__test_message__/i)).toBeInTheDocument();
    clickOk();
    expect(onConfirm).toHaveBeenCalled();
  });

  it("should close modal on cancel click", async () => {
    const { clickCancel, onHide } = setup();
    clickCancel();
    expect(onHide).toHaveBeenCalled();
  });
});
