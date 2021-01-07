import React, { FC, useState, useRef, ChangeEvent } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Avatar from "@atlaskit/avatar";

import axios from "../../lib/axios";
import ProfilePictureModal from "./ProfilePictureModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useAuth } from "../../contexts/auth";
import { User } from "../../types/models";

interface Props {
  data: User;
  mutate: () => void;
}

const ProfilePictureTab: FC<Props> = ({ data, mutate }) => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>("");
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const { updateUser } = useAuth();

  const handleUploadPhoto = () => {
    if (fileUploadRef && fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.currentTarget && event.currentTarget.files) {
      reader.readAsDataURL(event.currentTarget.files[0]);
      reader.onloadend = () => {
        if (reader.result) {
          setAvatar(reader.result.toString());
        }
      };
    }
  };

  const handleConfirmDelete = async () => {
    axios.delete("/users/destroy_avatar").then(async (response) => {
      await mutate();
      setAvatar(null);
      setShowDelete(false);
      updateUser(response.data);
    });
  };

  const handleClose = () => {
    setAvatar(null);
  };

  const handleSubmit = async (values: Blob) => {
    const data = new FormData();
    data.append("avatar", values);
    axios.patch(`users/update`, data).then(async (response) => {
      await mutate();
      setAvatar(null);
      updateUser(response.data);
    });
  };

  return (
    <>
      <h4 className="mb-4">Profile picture</h4>

      {data && <Avatar src={data.avatar} size="xxlarge" appearance="circle" />}

      <input
        type="file"
        ref={fileUploadRef}
        accept="image/*"
        onChange={(event) => handleFileChange(event)}
        className="d-none"
      />

      {avatar && (
        <ProfilePictureModal
          preview={avatar}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      )}

      <DropdownButton id="dropdown-basic-button" title="Edit">
        <Dropdown.Item onClick={handleUploadPhoto}>
          Upload a photo...
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setShowDelete(true)}>
          Remove photo
        </Dropdown.Item>
      </DropdownButton>

      {showDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this avatar?"
          onHide={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ProfilePictureTab;
