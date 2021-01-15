import React, { FC, useCallback, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AvatarEditor from "react-avatar-editor";

interface Props {
  onHide: () => void;
  preview: string;
  onSubmit: (values: Blob) => void;
}

const EditAvatarModal: FC<Props> = ({ onHide, onSubmit, preview }) => {
  const editorRef = useRef<AvatarEditor>(null);

  const handleSubmitRef = useCallback(() => {
    if (editorRef && editorRef.current) {
      editorRef.current.getImageScaledToCanvas().toBlob((blob: Blob | null) => {
        if (blob) {
          onSubmit(blob);
        }
      }, "image/png");
    }
  }, [editorRef, onSubmit]);

  return (
    <Modal show={true} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="modal-title">
          <h6>Crop your new profile picture</h6>
        </div>
      </Modal.Header>

      <Modal.Body className="text-center">
        <AvatarEditor
          ref={editorRef}
          image={preview}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={1.2}
          rotate={0}
          borderRadius={50}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleSubmitRef}>
          Set new profile picture
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAvatarModal;
