// src/app/components/ShareTrack_Modal.js

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Snippet,
} from "@nextui-org/react";

export default function Share({ visible = false, setVisible, url }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (visible) {
      onOpen();
    } else {
      onOpenChange(false);
    }
  }, [visible]);

  useEffect(
    (prev) => {
      if (isOpen) {
        //   setVisible(true);
      } else {
        setVisible(false);
      }
    },
    [onOpenChange],
  );

  return (
    <Modal isOpen={visible} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-green-light">
              Share This Track
            </ModalHeader>
            <ModalBody>
              <div className="text-green">
                Ready to share? Copy the link below to spread the music!
              </div>
            </ModalBody>
            <ModalFooter>
              <Snippet
                className="w-full"
                symbol="Link"
                variant="bordered"
                tooltipProps={{
                  content: "Copy to clipboard",
                  classNames: {
                    content: "text-green",
                  },
                }}
              >
                {url}
              </Snippet>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
