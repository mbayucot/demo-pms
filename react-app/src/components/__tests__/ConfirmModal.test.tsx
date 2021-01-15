import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConfirmModal from "../ConfirmModal";

const setup = () => {
  const onHide = jest.fn();
  const props = {
    message: "__test_message__",
    onHide,
  };
  const utils = render(<ConfirmModal {...props} />);
  const clickOk = () => userEvent.click(utils.getByText(/ok/i));
  const clickCancel = () => userEvent.click(utils.getByText(/cancel/i));
  return { clickOk, clickCancel, onHide };
};

describe("ConfirmModal", () => {
  it("should render modal", async () => {
    const { clickOk, onHide } = setup();
    expect(screen.getByText(/__test_message__/i)).toBeInTheDocument();
    clickOk();
    expect(onHide).toHaveBeenCalledWith(true);
  });

  it("should close modal when ok button is clicked", async () => {
    const { clickOk, onHide } = setup();
    clickOk();
    expect(onHide).toHaveBeenCalledWith(true);
  });

  it("should close modal when cancel button is clicked", async () => {
    const { clickCancel, onHide } = setup();
    clickCancel();
    expect(onHide).toHaveBeenCalledWith(false);
  });
});
