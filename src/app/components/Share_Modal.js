import React, { useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { Share2, Link as LinkIcon, Copy, Check } from 'lucide-react';

const ShareModal = ({ 
  visible = false, 
  setVisible, 
  url, 
  title = "Share",
  description,
  className = ""
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (visible) {
      onOpen();
    } else {
      onOpenChange(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
    }
  }, [isOpen, setVisible]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Modal 
      isOpen={visible}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
      classNames={{
        base: `bg-gray-darkest ${className}`,
        closeButton: "hover:bg-gray-darker active:bg-gray-dark text-green-light",
        backdrop: "bg-black/50",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 px-6 pt-6 pb-2 text-green-light">
              <Share2 className="w-5 h-5" />
              <span>{title}</span>
            </ModalHeader>
            
            <ModalBody className="px-6 pb-6">
              {description && (
                <p className="text-sm text-gray mb-4">
                  {description}
                </p>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 bg-gray-darker rounded-lg p-3 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 shrink-0 text-green" />
                      <div className="overflow-hidden">
                        <p className="text-sm text-green-light truncate">
                          {url}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    variant="flat"
                    className="bg-gray-darker hover:bg-gray-dark text-green hover:text-green-light"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-gray pl-1">
                  Anyone with this link can view this content
                </p>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;