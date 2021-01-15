import React, { FC } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export interface ConfirmModalProps {
  message: string;
  onHide: (isOk: boolean) => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ message, onHide }) => {
  return (
    <Modal show={true} onHide={() => onHide(false)} centered>
      <Modal.Header closeButton>
        <div className="modal-title h6">Confirmation</div>
      </Modal.Header>

      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: message }}></div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onHide(true)}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
