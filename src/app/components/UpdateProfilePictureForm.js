// src/app/components/updateProfilePictureForm.js

import React, { useState, useEffect } from "react";
import { 
  Button, 
} from "@nextui-org/react";
import ImageIcon from "./Icons/ImageIcon.js";
import withAuth from "../hoc/withAuth.js";
import { updateProfilePicture } from "../services/auth.js"
import Avatar from "./Avatar.js"
import imageCompression from 'browser-image-compression';

const ALLOWED_IMAGE_TYPES = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES.split(',');

function ProfilePictureUpload({ 
  initialProfilePicture = null, 
  onSubmit= async () => {}, 
  isInitialSetup = false,
  className="",
  ...props
}) {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialProfilePicture);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        try {
          // Set compression options
          const options = {
            maxSizeMB: 0.5, // Maximum size in MB
            maxWidthOrHeight: 800, // Resize image to fit within 800x800 dimensions
            useWebWorker: true,
          };

          // Compress the image
          const compressedFile = await imageCompression(file, options);

          // Create a preview of the compressed image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(compressedFile);

          setImageFile(compressedFile);
          setError(null);
        } catch (error) {
          setError("Failed to process the image. Please try again.");
        }
      } else {
        setError(
          `Invalid file type. Please select a valid image file (${ALLOWED_IMAGE_TYPES.map(type => '.' + type.split('/')[1]).join(", ")}).`
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError("Please select a profile picture.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await updateProfilePicture(imageFile, (state, progress) => {
        // Optional: Handle upload state changes
        console.log('Upload state:', state, progress);
      });

      await onSubmit(response)
      // Reset state after successful upload
      setImageFile(null);
    } catch (error) {
      setError(error.toString());
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setImageFile(null);
    setPreviewImage(initialProfilePicture);
  };

  useEffect(() => {
    if (!imageFile && initialProfilePicture) {
      setPreviewImage(initialProfilePicture);
    }
  }, [initialProfilePicture, imageFile]);

  return (
    <div className={`min-h-80 w-80 self-center rounded-md border-2 border-gray-dark bg-black/60 p-4 text-green ${className}`} {...props}>
      <form 
        encType="multipart/form-data"
        className="flex size-full flex-col gap-2"
        onSubmit={handleSubmit}
      >
        {/* Preview Area */}
        <div className="flex justify-center mb-4">
          <Avatar 
            src={previewImage} 
            className="w-32 h-32"
          />
        </div>

        {/* File Upload */}
        <label className="flex grow justify-center rounded-lg border-2 border-dashed border-gray/70 bg-gray-darkest/50 p-4">
          <input
            name="profilePicture"
            className="hidden text-green"
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleImageChange}
          />
          <div className="flex gap-2">
            <ImageIcon className="size-6" />
            <span>
              {isInitialSetup 
                ? "Upload Profile Picture" 
                : "Change Profile Picture"}
            </span>
          </div>
        </label>

        {imageFile && (
          <div className="grow text-wrap p-2">
            <p className="float-start pr-2 font-bold">Selected Image:</p>
            <p className="truncate">{imageFile.name}</p>
          </div>
        )}

        {error && (
          <p className="text-center text-red">
            {error}
          </p>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="mt-4 flex grow gap-2 text-green">
          <Button
            variant="ghost"
            type="submit"
            isLoading={isUploading}
            isDisabled={!imageFile || isUploading}
          >
            {isUploading 
              ? "Uploading..." 
              : (isInitialSetup ? "Set Profile Picture" : "Update Profile Picture")}
          </Button>
          <Button
            variant="ghost"
            type="button"
            isDisabled={isUploading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(ProfilePictureUpload);