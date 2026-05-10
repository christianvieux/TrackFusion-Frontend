import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@heroui/react'
import { Check, Copy, Link as LinkIcon, Share2 } from 'lucide-react'

export default function ShareModal({
    visible = false,
    setVisible,
    url,
    title = 'Share',
    description,
    className = '',
}) {
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef(null)

    async function handleCopy() {
        if (!url) return

        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    function handleClose() {
        setVisible(false)
    }

    useEffect(() => {
        if (visible) return

        setCopied(false)
    }, [visible])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (!visible) return null

    return (
        <Modal.Backdrop
            isOpen={visible}
            onOpenChange={setVisible}
            className="bg-backdrop"
        >
            <Modal.Container>
                <Modal.Dialog
                    className={`rounded-2xl border-2 border-accent bg-surface text-surface-foreground shadow-card ${className}`}
                >
                    <Modal.CloseTrigger className="bg-muted text-foreground">
                        ×
                    </Modal.CloseTrigger>

                    <Modal.Header className="flex items-center gap-2 px-6 pb-2 text-primary">
                        <Share2 className="size-5" />
                        <Modal.Heading className="text-lg font-semibold">
                            {title}
                        </Modal.Heading>
                    </Modal.Header>

                    <Modal.Body className="">
                        {description && (
                            <p className="mb-4 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}

                        <div className="space-y-3">
                            <div className="flex w-full items-center gap-2">
                                <div className="flex-1 overflow-hidden rounded-lg bg-muted p-3">
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="size-4 shrink-0 text-primary" />

                                        <p className="truncate text-sm text-foreground">
                                            {url}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    isIconOnly
                                    variant="flat"
                                    aria-label={copied ? 'Copied' : 'Copy link'}
                                    className="text-primary"
                                    onPress={handleCopy}
                                >
                                    {copied ? (
                                        <Check className="size-4" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                </Button>
                            </div>

                            <p className="pl-1 text-xs text-muted-foreground">
                                Anyone with this link can view this content
                            </p>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}
