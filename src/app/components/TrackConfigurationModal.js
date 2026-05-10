'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@heroui/react'

import { updateTrack } from '../services/trackService'
import { deleteOwnedTrack } from '../services/userService'
import { useTrackEvents } from '../context/TrackEventsContext'

const INITIAL_FORM = {
    name: '',
    description: '',
    isPublic: true,
}

function getInitialForm(track) {
    return {
        name: track?.name || '',
        description: track?.description || '',
        isPublic: !track?.is_private,
    }
}

export default function TrackConfiguration({
    trackDetails,
    isModalOpen,
    onModalOpenChange,
    closeModal,
}) {
    const { notifyTrackUpdated, notifyTrackDeleted } = useTrackEvents()
    const [form, setForm] = useState(INITIAL_FORM)
    const [errorMessage, setErrorMessage] = useState('')
    const [loadingAction, setLoadingAction] = useState('')
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    const originalForm = useMemo(() => {
        return getInitialForm(trackDetails)
    }, [trackDetails])

    const isBusy = Boolean(loadingAction)

    const hasChanges =
        form.name !== originalForm.name ||
        form.description !== originalForm.description ||
        form.isPublic !== originalForm.isPublic

    const isSaveDisabled =
        !trackDetails?.id || !form.name.trim() || !hasChanges || isBusy

    function resetState() {
        setErrorMessage('')
        setLoadingAction('')
        setShowDeleteConfirmation(false)
        setForm(getInitialForm(trackDetails))
    }

    function handleClose() {
        resetState()
        closeModal?.()
    }

    function updateField(event) {
        const { name, value, checked, type } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: type === 'checkbox' ? checked : value,
        }))

        setErrorMessage('')
    }

    async function handleSave(event) {
        event.preventDefault()

        if (isSaveDisabled) return

        try {
            setErrorMessage('')
            setLoadingAction('save')

            const updatedValues = {
                name: form.name.trim(),
                description: form.description.trim(),
                is_private: !form.isPublic,
            }

            await updateTrack(trackDetails.id, updatedValues)

            const updatedTrack = {
                ...trackDetails,
                ...updatedValues,
            }

            notifyTrackUpdated(updatedTrack)

            onModalOpenChange?.(false)
            closeModal?.()
            resetState()
        } catch (error) {
            setErrorMessage(error.message || 'Failed to update track.')
        } finally {
            setLoadingAction('')
        }
    }

    function handleDeleteClick() {
        setErrorMessage('')
        setShowDeleteConfirmation(true)
    }

    async function confirmDelete() {
        if (!trackDetails?.id) return

        try {
            setErrorMessage('')
            setLoadingAction('delete')

            await deleteOwnedTrack(trackDetails.id)

            notifyTrackDeleted(trackDetails.id)

            setShowDeleteConfirmation(false)
            onModalOpenChange?.(false)
            closeModal?.()
        } catch (error) {
            setErrorMessage(error.message || 'Failed to delete track.')
        } finally {
            setLoadingAction('')
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            setForm(getInitialForm(trackDetails))
            setErrorMessage('')
            setShowDeleteConfirmation(false)
        }
    }, [isModalOpen, trackDetails])

    return (
        <>
            <Modal.Backdrop
                isOpen={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose()
                        return
                    }

                    onModalOpenChange?.(true)
                }}
                className="bg-backdrop"
            >
                <Modal.Container>
                    <Modal.Dialog className="w-full max-w-lg rounded-2xl border-2 border-accent bg-surface text-foreground shadow-card">
                        <Modal.CloseTrigger
                                aria-label="Close track configuration"
                                className="bg-muted text-foreground"
                                onPress={handleClose}
                            >
                                ×
                            </Modal.CloseTrigger>

                        <form onSubmit={handleSave}>
                            <Modal.Header className="px-6 pt-6 pb-2">
                                <div className="flex flex-col gap-1">
                                    <Modal.Heading className="text-xl font-bold text-primary">
                                        Track Configuration
                                    </Modal.Heading>

                                    <p className="text-sm text-muted-foreground">
                                        Update this track&apos;s details or
                                        remove it from your account.
                                    </p>
                                </div>
                            </Modal.Header>

                            <Modal.Body className="px-6 py-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="track-name"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Track Name
                                        </label>

                                        <input
                                            id="track-name"
                                            name="name"
                                            value={form.name}
                                            onChange={updateField}
                                            disabled={isBusy}
                                            className="rounded-lg border border-accent bg-muted px-3 py-2 text-foreground outline-none focus:border-primary"
                                            placeholder="Track name"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="track-description"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id="track-description"
                                            name="description"
                                            value={form.description}
                                            onChange={updateField}
                                            disabled={isBusy}
                                            rows={4}
                                            className="resize-none rounded-lg border border-accent bg-muted px-3 py-2 text-foreground outline-none focus:border-primary"
                                            placeholder="Add a description"
                                        />
                                    </div>

                                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-accent/50 bg-muted p-3">
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Public Track
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Public tracks can be viewed by
                                                other users.
                                            </p>
                                        </div>

                                        <input
                                            name="isPublic"
                                            type="checkbox"
                                            checked={form.isPublic}
                                            onChange={updateField}
                                            disabled={isBusy}
                                            className="size-5 accent-primary"
                                        />
                                    </label>

                                    {errorMessage && (
                                        <p className="rounded-lg border border-danger/40 bg-danger/10 p-2 text-center text-sm text-danger">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            </Modal.Body>

                            <Modal.Footer className="flex justify-between gap-3 px-6 pb-6">
                                <Button
                                    variant="bordered"
                                    color="danger"
                                    onPress={handleDeleteClick}
                                    isDisabled={isBusy}
                                >
                                    Delete this track
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="light"
                                        className="text-muted-foreground"
                                        onPress={handleClose}
                                        isDisabled={isBusy}
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="bg-primary text-background hover:bg-primary-hover"
                                        isDisabled={isSaveDisabled}
                                        isLoading={loadingAction === 'save'}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Modal.Footer>
                        </form>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>

            <Modal.Backdrop
                isOpen={showDeleteConfirmation}
                onOpenChange={setShowDeleteConfirmation}
                className="bg-backdrop"
            >
                <Modal.Container>
                    <Modal.Dialog className="w-full max-w-md rounded-2xl border-2 border-danger bg-surface text-foreground shadow-card">
                        <Modal.Header className="px-6 pt-6 pb-2">
                            <Modal.Heading className="text-xl font-bold text-danger">
                                Delete this track?
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-foreground">
                                    {trackDetails?.name || 'this track'}
                                </span>
                                ? You won&apos;t be able to recover it.
                            </p>
                        </Modal.Body>

                        <Modal.Footer className="flex justify-between gap-3 px-6 pb-6">
                            <Button
                                variant="light"
                                onPress={() => setShowDeleteConfirmation(false)}
                                isDisabled={isBusy}
                            >
                                No
                            </Button>

                            <Button
                                color="danger"
                                onPress={confirmDelete}
                                isDisabled={isBusy}
                                isLoading={loadingAction === 'delete'}
                            >
                                Yes, delete it
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </>
    )
}
