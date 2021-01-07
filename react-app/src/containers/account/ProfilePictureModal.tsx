import React, { FC, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AvatarEditor from "react-avatar-editor";

interface Props {
  handleClose: () => void;
  preview: string;
  handleSubmit: (values: Blob) => void;
}

const ProfilePictureModal: FC<Props> = ({
  handleClose,
  handleSubmit,
  preview,
}) => {
  const editorRef = useRef<AvatarEditor>(null);

  const handleSubmitRef = () => {
    if (editorRef && editorRef.current) {
      editorRef.current.getImageScaledToCanvas().toBlob((blob: Blob | null) => {
        if (blob) {
          handleSubmit(blob);
        }
      }, "image/png");
    }
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div className="modal-title">
          <h6>Crop your new profile picture</h6>
        </div>
      </Modal.Header>

      <Modal.Body>
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

export default ProfilePictureModal;
