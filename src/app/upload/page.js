"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Checkbox,
  Select,
  SelectSection,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import IsTrackPublic_Checkbox from "../components/isTrackPublic_Checkbox";
import { createTrack } from "../services/trackService";
import withAuth from "../hoc/withAuth.js";
import { fetchTrackAttributes } from "../services/enum.js";
import ImageIcon from "../components/Icons/ImageIcon.js";

const ALLOWED_AUDIO_TYPES = process.env.NEXT_PUBLIC_ALLOWED_AUDIO_TYPES.split(',');
const ALLOWED_IMAGE_TYPES = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES.split(',');

function TrackTypeSelection({
  trackType,
  options,
  className,
  setTrackMetadata,
  trackMetadata,
  allowMultiple,
  track_attributes_list,
  ...rest
}) {
  const handleSelectionChange = (selectedItems) => {
    const selectedArray = Array.isArray(selectedItems)
      ? selectedItems
      : Array.from(selectedItems);
    setTrackMetadata((prevTrackMetadata) => ({
      ...prevTrackMetadata,
      [trackType]: selectedArray.join(","),
    }));
  };

  return (
    <Select
      isRequired
      label={`Track ${trackType.charAt(0).toUpperCase() + trackType.slice(1)}`}
      placeholder={`Select a ${trackType.charAt(0).toUpperCase() + trackType.slice(1)}`}
      className={`max-w-xs ${className}`}
      onSelectionChange={handleSelectionChange}
      {...rest}
    >
      {options.map((selection_item) => (
        <SelectItem className="text-green" key={selection_item}>
          {selection_item.charAt(0).toUpperCase() + selection_item.slice(1)}
        </SelectItem>
      ))}
    </Select>
  );
}

function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [trackFile, setTrackFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [trackName, setTrackName] = useState("");
  const [trackDescription, setTrackDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [trackMetadata, setTrackMetadata] = useState({
    category: "",
    genre: [],
    mood: [],
    bpm: 0,
  });
  const [track_attributes_list, setTrackAttributesList] = useState({});
  const [error, setError] = useState(null);
  const [trackNameError, setTrackNameError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const isFormInvalid =
    isUploading ||
    trackName.trim() === "" ||
    !trackFile ||
    Object.values(trackMetadata).some(
      (meta, key) =>
        key !== "bpm" && typeof meta === "string" && meta.trim() === "",
    ) || trackNameError !== null;

  const validateTrackName = (name) => {
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 100;
    const sanitized = name.trim();
    
    if (sanitized.length < MIN_LENGTH) {
      return { isValid: false, error: `Track name must be at least ${MIN_LENGTH} characters` };
    }
    if (sanitized.length > MAX_LENGTH) {
      return { isValid: false, error: `Track name must be less than ${MAX_LENGTH} characters` };
    }
    // Allow letters, numbers, spaces and basic punctuation
    if (!/^[a-zA-Z0-9\s\-_.,!'"`()]+$/.test(sanitized)) {
      return { isValid: false, error: "Track name contains invalid characters" };
    }
    return { isValid: true, sanitized };
  };

  const handleTrackNameChange = (newName) => {
    setTrackName(newName);

    const { isValid, error } = validateTrackName(newName);
    setTrackNameError(isValid ? null : error);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSuccessMessage(null);
  
    if (file) {
      if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
        setTrackFile(file);
        handleTrackNameChange(file.name.replace(/\.[^/.]+$/, ""));
        setError(null);
      } else {
        setError(`Please upload a valid audio file: ${ALLOWED_AUDIO_TYPES.map(type => '.' + type.split('/')[1]).join(', ')}`);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageFile(file);
      setError(null);
    } else if (file) {
      setError(`Please upload a valid image file: ${ALLOWED_IMAGE_TYPES.map(type => '.' + type.split('/')[1]).join(', ')}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Basic validation
    if (!trackFile) {
      setError("Please select a track file.");
      return;
    }

    if (trackName.trim() === "") {
      setError("Please enter a track name.");
      return;
    }

    // Validate track name
    const { isValid, error, sanitized } = validateTrackName(trackName);
    if (!isValid) {
      setError(error);
      return;
    }

    if (Object.values(trackMetadata).some((meta) => meta.length === 0)) {
      setError("Please select at least one item for each track metadata.");
      return;
    }
    setIsUploading(true);

    console.log("Track File:", trackFile);
    console.log("Track Name:", trackName);
    console.log("Track Description:", trackDescription);
    console.log("Is Public:", isPublic);

    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append("trackFile", trackFile);
    formData.append("name", trackName);
    formData.append("description", trackDescription);
    formData.append("is_private", !isPublic);
    Object.keys(trackMetadata).forEach((key) => {
      formData.append(key, trackMetadata[key]);
    });
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      await createTrack(formData);
      setSuccessMessage("Track uploaded successfully!");
      setTrackFile(null);
      router.push("/myTracks");
    } catch (error) {
      setError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setTrackFile(null);
    setImageFile(null);
    handleTrackNameChange("");
    setTrackDescription("");
  };

  // Function to get the file name and type separately
  const splitFileNameAndType = (filename) => {
    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex === -1) return { name: filename, type: "" }; // No extension found
    return {
      name: filename.substring(0, dotIndex),
      type: filename.substring(dotIndex + 1),
    };
  };

  const fileDetails = trackFile
    ? splitFileNameAndType(trackFile.name)
    : { name: "", type: "" };

  // Load track attributes
  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const attributes = await fetchTrackAttributes();
        setTrackAttributesList(attributes);
      } catch (error) {
        setError("Failed to fetch track attributes. Please try again.");
      }
    };
    loadAttributes();
  }, []);

  return (
    <div className="min-h-80 w-80 self-center overflow-auto rounded-md border-2 border-gray-dark bg-black/60 p-2 text-green">
      <form
        encType="multipart/form-data" // Important! Without this, the file data will not be included in the request, and req.file will be undefined on the server side.
        className="flex size-full flex-col gap-2"
        onSubmit={handleUpload}
      >
        {/* Track upload */}
        <label className="flex grow justify-center rounded-lg border-2 border-dashed border-gray/70 bg-gray-darkest/50 p-4">
          <input
            name="trackFile" // Important! Without this, the file won't be read on the backend
            className="hidden text-green"
            type="file"
            accept={ALLOWED_AUDIO_TYPES.join(",")}
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span>Upload File</span>
          </div>
        </label>
        {/* Image Upload */}
        <label className="flex grow justify-center rounded-lg border-2 border-dashed border-gray/70 bg-gray-darkest/50 p-4">
          <input
            name="imageFile"
            className="hidden text-green"
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleImageChange}
          />
          <div className="flex gap-2">
            <ImageIcon className="size-6" />
            <span>Upload Cover Image (Optional)</span>
          </div>
        </label>
        {imageFile && (
          <div className="grow text-wrap p-2">
            <p className="float-start pr-2 font-bold">Selected Image:</p>
            <p className="truncate">{imageFile.name}</p>
          </div>
        )}
        {trackFile && (
          <div className="grow text-wrap p-2">
            <p className="float-start pr-2 font-bold">Uploaded Track:</p>
            <div className="flex">
              <p className="truncate align-bottom">{fileDetails.name}</p>
              <p className="inline-block font-bold">.{fileDetails.type}</p>
            </div>
          </div>
        )}
        {/* Fields */}
        <div id="fields" className="flex shrink flex-col gap-2">
          <Input
            variant="faded"
            label="Track Name"
            value={trackName}
            onChange={(e) => handleTrackNameChange(e.target.value)}
            isDisabled={isUploading}
            isInvalid={trackNameError}
            errorMessage={trackNameError}
          />
          {/* Description */}
          <Textarea
            label="Description"
            variant="faded"
            placeholder="Enter a description for your track (optional)"
            disableAnimation
            disableAutosize
            classNames={{
              base: "max-w-xs",
              input: "resize-y min-h-[40px]",
            }}
            value={trackDescription}
            onChange={(e) => setTrackDescription(e.target.value)}
            isDisabled={isUploading}
          />
          {/* track_details */}
          {Object.keys(track_attributes_list)
            .sort((a, b) => (a === "category" ? -1 : b === "category" ? 1 : 0))
            .map((filter) => (
              <TrackTypeSelection
                key={filter}
                trackType={filter}
                options={track_attributes_list[filter].values}
                selectionMode={
                  track_attributes_list[filter].allowMultiple
                    ? "multiple"
                    : "single"
                }
                setTrackMetadata={setTrackMetadata}
                track_attributes_list={track_attributes_list}
                trackMetadata={trackMetadata}
                isDisabled={isUploading}
              />
            ))}
          {/* Bpm - Optional */}
          {trackMetadata.category == "Song" ||
            trackMetadata.category == "Instrumental" ||
            (trackMetadata.category == "Remix" && (
              <Input
                variant="faded"
                label="Bpm (Optional)"
                value={trackMetadata.bpm}
                onChange={(e) =>
                  setTrackMetadata({ ...trackMetadata, bpm: e.target.value })
                }
                isDisabled={isUploading}
              />
            ))}
        </div>
        {/* Is Public */}
        <div className="grow p-2">
          <IsTrackPublic_Checkbox
            setIsPublic={setIsPublic}
            isDisabled={isUploading}
          />
        </div>
        {successMessage && (
          <p className="text-center text-green-light">{successMessage}</p>
        )}
        {error && <p className="text-center text-red">{error.toString()}</p>}
        {/* Submit */}
        <div className="mt-4 flex grow gap-2 text-green">
          <Button
            variant="ghost"
            type="submit"
            isLoading={isUploading}
            isDisabled={isFormInvalid}
          >
            {isUploading ? "Uploading..." : "Submit"}
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

export default withAuth(UploadPage);
