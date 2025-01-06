// src/app/components/ShareProfile_Modal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Snippet,
  useDisclosure,
} from "@nextui-org/react";

export default function ShareModal({ visible = false, setVisible, url }) {
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
    <Modal
      isOpen={visible}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
      classNames={{
        base: "",
        closeButton:
          "hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200",
      }}
      className="text-green"
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="p-1">
            <div className="space-y-4 p-6">
              <Snippet
                symbol="Link"
                variant="bordered"
                className="w-full"
                classNames={{
                  base: "bg-zinc-100 dark:bg-zinc-800",
                  pre: "text-sm",
                  copyButton: "text-primary hover:text-primary-500",
                }}
                tooltipProps={{
                  content: "Copy to clipboard",
                  classNames: {
                    content: "text-green",
                  },
                }}
              >
                {url}
              </Snippet>

              <p className="text-zinc-500 dark:text-zinc-400 pl-2 text-xs">
                Anyone with this link can view your profile
              </p>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
