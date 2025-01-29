"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Progress,
} from "@nextui-org/react";
import IsTrackPublic_Checkbox from "../components/isTrackPublic_Checkbox";
import { uploadTrack } from "../services/trackService";
import withAuth from "../hoc/withAuth.js";
import { fetchTrackAttributes } from "../services/enum.js";
import ImageIcon from "../components/Icons/ImageIcon.js";
import { XCircle } from "lucide-react";

const ALLOWED_AUDIO_TYPES = process.env.NEXT_PUBLIC_ALLOWED_AUDIO_TYPES.split(',');
const ALLOWED_IMAGE_TYPES = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES.split(',');

// File Upload Component
const FileUploadField = ({ type, file, onFileChange, onRemove, allowedTypes, icon: Icon, label }) => (
  <div className="relative">
    <label className="flex grow justify-center rounded-lg border-2 border-dashed border-gray/70 bg-gray-darkest/50 p-4 transition-colors hover:border-gray-light/70">
      <input
        name={type === 'track' ? 'trackFile' : 'imageFile'}
        className="hidden"
        type="file"
        accept={allowedTypes.join(",")}
        onChange={onFileChange}
      />
      <div className="flex items-center gap-2">
        {Icon}
        <span>{label}</span>
      </div>
    </label>
    {file && (
      <div className="mt-2 flex items-center justify-between rounded-md bg-gray-dark/30 p-2">
        <p className="truncate text-sm">{file.name}</p>
        <Button
          isIconOnly
          variant="light"
          className="text-red-500"
          onClick={onRemove}
        >
          <XCircle size={20} />
        </Button>
      </div>
    )}
  </div>
);

// Track Metadata Selection Component
const TrackTypeSelection = ({
  trackType,
  options,
  className,
  setTrackMetadata,
  trackMetadata,
  allowMultiple,
  isDisabled,
  ...rest
}) => {
  const handleSelectionChange = (selectedItems) => {
    const selectedArray = Array.isArray(selectedItems)
      ? selectedItems
      : Array.from(selectedItems);
    setTrackMetadata((prev) => ({
      ...prev,
      [trackType]: selectedArray.join(","),
    }));
  };

  return (
    <Select
      isRequired
      label={`Track ${trackType.charAt(0).toUpperCase() + trackType.slice(1)}`}
      placeholder={`Select a ${trackType}`}
      className={`max-w-full ${className}`}
      onSelectionChange={handleSelectionChange}
      isDisabled={isDisabled}
      {...rest}
    >
      {options.map((item) => (
        <SelectItem key={item} className="text-green">
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </SelectItem>
      ))}
    </Select>
  );
};

// Upload Progress Component
const UploadProgress = ({ state, progress }) => {
  const stateMessages = {
    PREPARING: "Preparing files...",
    UPLOADING: "Uploading files...",
    PROCESSING: "Processing track...",
    COMPLETED: "Upload complete!",
  };

  return (
    <div className="space-y-2">
      <Progress
        size="sm"
        value={progress}
        color="success"
        className="max-w-md"
      />
      <p className="text-sm text-green">{stateMessages[state]}</p>
    </div>
  );
};

function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [trackFile, setTrackFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [trackName, setTrackName] = useState("");
  const [trackDescription, setTrackDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [trackMetadata, setTrackMetadata] = useState({});
  const [trackAttributesList, setTrackAttributesList] = useState({});
  const [error, setError] = useState(null);
  const [trackNameError, setTrackNameError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Validation functions remain the same...
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
    if (!/^[a-zA-Z0-9\s\-_.,!'"`()]+$/.test(sanitized)) {
      return { isValid: false, error: "Track name contains invalid characters" };
    }
    return { isValid: true, sanitized };
  };

  // File handling functions
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setSuccessMessage(null);
    
    if (!file) return;

    if (type === 'track') {
      if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
        setTrackFile(file);
        handleTrackNameChange(file.name.replace(/\.[^/.]+$/, ""));
        setError(null);
      } else {
        setError(`Please upload a valid audio file: ${ALLOWED_AUDIO_TYPES.map(type => '.' + type.split('/')[1]).join(', ')}`);
      }
    } else {
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setImageFile(file);
        setError(null);
      } else {
        setError(`Please upload a valid image file: ${ALLOWED_IMAGE_TYPES.map(type => '.' + type.split('/')[1]).join(', ')}`);
      }
    }
  };

  const handleRemoveFile = (type) => {
    if (type === 'track') {
      setTrackFile(null);
      setTrackName("");
    } else {
      setImageFile(null);
    }
  };

  const handleTrackNameChange = (newName) => {
    setTrackName(newName);
    const { isValid, error } = validateTrackName(newName);
    setTrackNameError(isValid ? null : error);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!trackFile || trackName.trim() === "") {
      setError("Please select a track file and enter a track name.");
      return;
    }

    const { isValid, error } = validateTrackName(trackName);
    if (!isValid) {
      setError(error);
      return;
    }

    setIsUploading(true);

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
      await uploadTrack(formData, (state) => {
        setUploadState(state);
        // Map states to progress percentages
        const progressMap = {
          PREPARING: 25,
          UPLOADING: 50,
          PROCESSING: 75,
          COMPLETED: 100,
        };
        setUploadProgress(progressMap[state] || 0);
      });
      setSuccessMessage("Track uploaded successfully!");
      router.push("/myTracks");
    } catch (error) {
      setError(error.toString());
    } finally {
      setIsUploading(false);
      setUploadState(null);
      setUploadProgress(0);
    }
  };

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

  useEffect(() => {
    // This ensures metadata is only set on the client side
    setTrackMetadata({
      category: "",
      genre: [],
      mood: [],
      bpm: 0,
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-4 text-green">
      <div className="rounded-lg border-2 border-gray-dark bg-black/60 p-6">
        <form encType="multipart/form-data" onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-4">
            <FileUploadField
              type="track"
              file={trackFile}
              onFileChange={(e) => handleFileChange(e, 'track')}
              onRemove={() => handleRemoveFile('track')}
              allowedTypes={ALLOWED_AUDIO_TYPES}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>}
              label="Upload Track"
            />

            <FileUploadField
              type="image"
              file={imageFile}
              onFileChange={(e) => handleFileChange(e, 'image')}
              onRemove={() => handleRemoveFile('image')}
              allowedTypes={ALLOWED_IMAGE_TYPES}
              icon={<ImageIcon className="size-6" />}
              label="Upload Cover Image (Optional)"
            />
          </div>

          <div className="space-y-4">
            <Input
              name="trackName"
              variant="faded"
              label="Track Name"
              value={trackName}
              onChange={(e) => handleTrackNameChange(e.target.value)}
              isDisabled={isUploading}
              isInvalid={trackNameError}
              errorMessage={trackNameError}
            />

            <Textarea
              label="Description"
              variant="faded"
              placeholder="Enter a description for your track (optional)"
              value={trackDescription}
              onChange={(e) => setTrackDescription(e.target.value)}
              isDisabled={isUploading}
              className="min-h-[100px]"
            />

            {Object.keys(trackAttributesList)
              .sort((a, b) => (a === "category" ? -1 : b === "category" ? 1 : 0))
              .map((filter) => (
                <TrackTypeSelection
                  key={filter}
                  trackType={filter}
                  options={trackAttributesList[filter].values}
                  selectionMode={trackAttributesList[filter].allowMultiple ? "multiple" : "single"}
                  setTrackMetadata={setTrackMetadata}
                  trackMetadata={trackMetadata}
                  isDisabled={isUploading}
                />
              ))}

            {(trackMetadata.category === "Song" ||
              trackMetadata.category === "Instrumental" ||
              trackMetadata.category === "Remix") && (
              <Input
                variant="faded"
                label="BPM (Optional)"
                value={trackMetadata.bpm}
                onChange={(e) => setTrackMetadata({ ...trackMetadata, bpm: e.target.value })}
                isDisabled={isUploading}
              />
            )}

            <div className="pt-2">
              <IsTrackPublic_Checkbox
                setIsPublic={setIsPublic}
                isDisabled={isUploading}
              />
            </div>
          </div>

          {uploadState && (
            <UploadProgress
              state={uploadState}
              progress={uploadProgress}
            />
          )}

          {successMessage && (
            <p className="text-center text-green-light">{successMessage}</p>
          )}
          
          {error && (
            <p className="text-center text-red">{error}</p>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              className="flex-1"
              color="primary"
              variant="ghost"
              type="submit"
              isLoading={isUploading}
              isDisabled={!trackFile || trackName.trim() === "" || isUploading || trackNameError}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
            <Button
              className="flex-1"
              variant="ghost"
              color="danger"
              type="button"
              isDisabled={isUploading}
              onClick={() => {
                handleRemoveFile('track');
                handleRemoveFile('image');
                setTrackDescription("");
                setIsPublic(false);
                setTrackMetadata({
                  category: "",
                  genre: [],
                  mood: [],
                  bpm: 0,
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(UploadPage);