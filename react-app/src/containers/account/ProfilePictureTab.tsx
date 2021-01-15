import React, { FC, useRef, ChangeEvent, useReducer, useCallback } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Avatar from "@atlaskit/avatar";

import axios from "../../lib/axios";
import EditAvatarModal from "./EditAvatarModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useAuth } from "../../contexts/auth";
import ModalManager, {
  initialModalState,
  reducer as modalReducer,
} from "../../lib/modal-manager";

const MODAL_COMPONENTS = {
  EDIT_AVATAR_MODAL: EditAvatarModal,
  CONFIRM_MODAL: ConfirmModal,
};

interface ProfilePictureTabProps {
  avatar: string;
  onChange: () => void;
}

const ProfilePictureTab: FC<ProfilePictureTabProps> = ({
  avatar,
  onChange,
}) => {
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );
  const { updateUser } = useAuth();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleUploadPhoto = useCallback(() => {
    if (fileUploadRef && fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  }, [fileUploadRef]);

  const handleClose = useCallback(() => {
    modalDispatch({ type: "HIDE_MODAL" });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const response = await axios.delete("/users/destroy_avatar");
    handleClose();
    await updateUser(response.data);
    onChange();
  }, [handleClose, updateUser, onChange]);

  const handleSubmit = async (values: Blob) => {
    const data = new FormData();
    data.append("avatar", values);
    const response = await axios.patch(`users/update`, data);
    await updateUser(response.data);
    handleClose();
    onChange();
  };

  const handleRemovePhoto = useCallback(() => {
    modalDispatch({
      type: "SHOW_MODAL",
      modalType: "CONFIRM_MODAL",
      modalProps: {
        message: `Are you sure you want to delete this avatar?`,
        onHide: async (isOk: boolean) => {
          if (isOk) {
            await handleConfirmDelete();
          } else {
            modalDispatch({ type: "HIDE_MODAL" });
          }
        },
      },
    });
  }, [handleConfirmDelete]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.currentTarget && event.currentTarget.files) {
      reader.readAsDataURL(event.currentTarget.files[0]);
      reader.onloadend = () => {
        if (reader.result) {
          modalDispatch({
            type: "SHOW_MODAL",
            modalType: "EDIT_AVATAR_MODAL",
            modalProps: {
              preview: reader.result.toString(),
              onHide: handleClose,
              onSubmit: handleSubmit,
            },
          });
        }
      };
    }
  };

  return (
    <>
      <h4 className="mb-4">Profile picture</h4>
      <Avatar src={avatar} size="xxlarge" appearance="circle" />

      <DropdownButton id="dropdown-basic-button" title="Edit">
        <Dropdown.Item onClick={handleUploadPhoto}>
          Upload a photo...
        </Dropdown.Item>
        <Dropdown.Item onClick={handleRemovePhoto}>Remove photo</Dropdown.Item>
      </DropdownButton>

      <input
        type="file"
        data-testid="fileInput"
        data-cy="fileInput"
        ref={fileUploadRef}
        accept="image/*"
        onChange={(event) => handleFileChange(event)}
        className="d-none"
      />

      <ModalManager components={MODAL_COMPONENTS} {...modalState} />
    </>
  );
};

export default ProfilePictureTab;
