import { reducer, initialModalState } from "../../modal-manager";

describe("reducer", () => {
  it("should update state when show modal", async () => {
    const modalType = "EDIT_MODAL";
    const modalProps = {
      id: 1,
    };
    const payload = { modalType, modalProps };
    expect(
      reducer(initialModalState, { type: "SHOW_MODAL", ...payload })
    ).toEqual({
      ...initialModalState,
      ...payload,
    });
  });

  it("should update state when hide modal", async () => {
    const modalType = "EDIT_MODAL";
    const payload = { modalType };
    expect(
      reducer(initialModalState, { type: "HIDE_MODAL", ...payload })
    ).toEqual({
      ...initialModalState,
      modalType: null,
      modalProps: undefined,
    });
  });
});
