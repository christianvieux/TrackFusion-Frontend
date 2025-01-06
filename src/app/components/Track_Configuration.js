//components/Track_Configuration.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Track_Configuration_Window from "./Track_Configuration_Window";
import { useRouter } from "next/navigation";
import { updateTrack } from "../services/trackService";
import { deleteOwnedTrack } from "../services/user";
import { useSession } from "../context/SessionContext";
import { useTrackList } from "../context/TrackListContext";
import { useTrackManager } from "../context/TrackManagerContext";
import { useDeletedTracks } from "../context/deletedTracksContext";

export default function TrackConfiguration({
  trackDetails,
  isModalOpen,
  onModalOpen,
  closeModal,
  onModalOpenChange,
}) {
  const { addDeletedTrack } = useDeletedTracks();
  const { setTrackList } = useTrackList();
  // Determine if the submit button should be disabled
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastButtonInteracted, setLastButtonInteracted] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Add state for delete confirmation
  const router = useRouter();
  
  const resetErrorMessage = () => {
    setErrorMessage(null);
  };

  async function handleSave(e) {
    e.preventDefault();

    resetErrorMessage();
    setLastButtonInteracted("Save");

    // Proceed with your registration logic
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const is_private = !(formData.get("is_public") || false);

    try {
      setIsAwaitingResponse(true);
      const response = await updateTrack(trackDetails.id, {
        name,
        description,
        is_private,
      });

      // Assuming trackDetails is available in your scope with an id property
      const trackId = trackDetails.id;

      // Update the track list
      setTrackList((prevTracks) => {
        return prevTracks.map((track) => {
          if (track.id === trackId) {
            // Update the track with new values
            return {
              ...track,
              name,
              description,
              is_private,
            };
          }
          // Return unchanged track if the id doesn't match
          return track;
        });
      });

      // router.push("/feed"); // Redirect to profile or any protected page
    } catch (error) {
      setErrorMessage(
        <p className="text-center text-danger">{error.message}</p>
      ); // Set error message
    }
    setIsAwaitingResponse(false);
  }

  async function handleDelete() {
    resetErrorMessage();
    setLastButtonInteracted("Delete");

    // Show delete confirmation prompt
    setShowDeleteConfirmation(true);
  }

  async function confirmDelete() {
    try {
      const trackId = trackDetails.id;
      // Call removeFavoriteTrack service function
      setIsAwaitingResponse(true);
      await deleteOwnedTrack(trackId); // Assuming removeFavoriteTrackService handles the API call

      // Add the track to deletedTracks list/array
      addDeletedTrack(trackId);

      // Close the modal
      closeModal();
    } catch (error) {
      setErrorMessage(
        <p className="text-center text-danger">{error.message}</p>
      ); // Set error message
    }
    setIsAwaitingResponse(false);
    setShowDeleteConfirmation(false); // Hide delete confirmation prompt
  }

  async function cancelDelete() {
    setShowDeleteConfirmation(false); // Hide delete confirmation prompt
  }


  return (
    <>
      <Modal
        className="text-green bg-gray-darkest"
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        onClose={resetErrorMessage}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSave}>
              <ModalHeader className="flex flex-col gap-1">
                Track Configuration
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Track_Configuration_Window
                    trackDetails={trackDetails}
                    setIsSaveDisabled={setIsSaveDisabled}
                    isAwaitingResponse={isAwaitingResponse}
                  />
                  {errorMessage}
                </div>
              </ModalBody>
              <ModalFooter className="justify-between">
                <Button
                  name="delete"
                  variant="bordered"
                  color="danger"
                  isDisabled={isAwaitingResponse}
                  onPress={handleDelete}
                  isLoading={
                    isAwaitingResponse && lastButtonInteracted == "Delete"
                  }
                >
                  Delete this track
                </Button>
                <div className="flex gap-1">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    isLoading={
                      isAwaitingResponse && lastButtonInteracted == "Save"
                    }
                    isDisabled={isSaveDisabled}
                    type="submit"
                    className="text-black"
                    color="secondary"
                    // onPress={onClose}
                  >
                    Save
                  </Button>
                </div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Delete confirmation prompt */}
      {showDeleteConfirmation && (
        <Modal
          className="text-green bg-gray-darkest"
          isOpen={showDeleteConfirmation}
          onClose={cancelDelete}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Are you sure you want to delete this track? You won't be able to recover it.
                </ModalHeader>
                <ModalFooter className="justify-between">
                  <Button color="danger" variant="light" onPress={cancelDelete}>
                    No
                  </Button>
                  <Button
                    isLoading={
                      isAwaitingResponse && lastButtonInteracted == "Delete"
                    }
                    isDisabled={isAwaitingResponse}
                    color="danger"
                    onPress={confirmDelete}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
