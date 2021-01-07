import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export interface ConfirmModalProps {
  message: string;
  onHide: () => void;
  onConfirm: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  message,
  onHide,
  onConfirm,
}) => {
  return (
    <Modal show={true} animation={false} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="modal-title h6">Confirmation</div>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
