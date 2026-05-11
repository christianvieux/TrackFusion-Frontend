"use client";

import { useEffect, useState } from "react";
import { Button, Form } from "@heroui/react";
import imageCompression from "browser-image-compression";

import Avatar from "../../Avatar";
import ImageIcon from "../../Icons/ImageIcon";
import { updateProfilePicture } from "../../../services/authService";
import FormMessage from "./FormMessage";
import SettingsCard from "./SettingsCard";
import { ALLOWED_IMAGE_TYPES, getAllowedImageExtensions } from "../utils";

export default function UpdateProfilePictureForm({
  initialProfilePicture = null,
  onSubmit = async () => {},
  isInitialSetup = false,
  className = "",
}) {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialProfilePicture);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please select a valid image file (${getAllowedImageExtensions()}).`);
      return;
    }
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(compressedFile);
      setImageFile(compressedFile);
      setError("");
    } catch {
      setError("Failed to process the image. Please try again.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!imageFile) {
      setError("Please select a profile picture.");
      return;
    }
    try {
      setIsUploading(true);
      setError("");
      const newProfilePictureUrl = await updateProfilePicture(imageFile);
      await onSubmit(newProfilePictureUrl);
      setImageFile(null);
    } catch (error) {
      setError(error.message || "Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel() {
    setError("");
    setImageFile(null);
    setPreviewImage(initialProfilePicture);
  }

  useEffect(() => {
    if (!imageFile) setPreviewImage(initialProfilePicture);
  }, [initialProfilePicture, imageFile]);

  return (
    <SettingsCard
      title="Profile picture"
      description="Upload a new image for your account."
      className={className}
    >
      <Form
        encType="multipart/form-data"
        className="flex size-full flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center">
          <Avatar src={previewImage} className="h-32 w-32" />
        </div>

        <label className="flex grow cursor-pointer justify-center rounded-lg border-2 border-dashed border-primary/40 bg-muted p-4 hover:bg-secondary-hover hover:border-primary/70 transition-colors">
          <input
            name="profilePicture"
            className="hidden"
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleImageChange}
            disabled={isUploading}
          />
          <div className="flex items-center gap-2 text-primary">
            <ImageIcon className="size-5" />
            <span className="text-sm font-medium">
              {isInitialSetup ? "Upload Profile Picture" : "Change Profile Picture"}
            </span>
          </div>
        </label>

        {imageFile && (
          <div className="rounded-lg bg-muted p-2 text-sm">
            <p className="font-semibold text-primary">Selected Image:</p>
            <p className="truncate text-muted-foreground">{imageFile.name}</p>
          </div>
        )}

        <FormMessage message={error} />

        <div className="mt-2 flex gap-2">
          <Button
            color="primary"
            type="submit"
            isLoading={isUploading}
            isDisabled={!imageFile || isUploading}
          >
            {isUploading ? "Uploading..." : isInitialSetup ? "Set Profile Picture" : "Update Profile Picture"}
          </Button>
          <Button
            type="button"
            variant="bordered"
            className="border-muted-foreground/40 text-muted-foreground hover:bg-secondary-hover"
            isDisabled={isUploading}
            onPress={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </SettingsCard>
  );
}