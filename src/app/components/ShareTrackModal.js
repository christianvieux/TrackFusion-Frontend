'use client'

import { useState } from 'react'
import { Button, Modal } from '@heroui/react'
import ShareIcon from './Icons/ShareIcon'

export default function ShareTrackModal({
    isOpen = false,
    onOpenChange,
    url = '',
}) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 1500)
        } catch {
            setCopied(false)
        }
    }

    return (
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog className="bg-secondary text-foreground sm:max-w-[420px]">
                    <Modal.CloseTrigger className="bg-muted text-foreground">
                        ×
                    </Modal.CloseTrigger>

                    <Modal.Header>
                        <Modal.Icon className="bg-muted text-primary">
                            <ShareIcon className="size-5" />
                        </Modal.Icon>

                        <Modal.Heading className="text-primary">
                            Share This Track
                        </Modal.Heading>
                    </Modal.Header>

                    <Modal.Body>
                        <p className="text-muted-foreground">
                            Ready to share? Copy the link below to spread the
                            music.
                        </p>

                        <div className="flex w-full items-center gap-2 rounded-lg border border-accent bg-muted p-2">
                            <code className="min-w-0 flex-1 overflow-x-auto text-sm whitespace-nowrap text-foreground">
                                {url || 'No link available'}
                            </code>

                            <Button
                                size="sm"
                                variant="bordered"
                                className="shrink-0 border-primary text-primary hover:bg-secondary-hover"
                                onPress={handleCopy}
                                isDisabled={!url}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            className="w-full"
                            variant="secondary"
                            onPress={() => onOpenChange?.(false)}
                        >
                            Done
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}
