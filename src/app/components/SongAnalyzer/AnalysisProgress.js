import React from 'react'
import { Label, ProgressBar } from '@heroui/react'

import {
    getAnalysisProgressLabel,
    getUploadProgressLabel,
} from './utils'

function ProgressStatus({ label, value }) {
    if (!value) return null

    return (
        <ProgressBar
            aria-label={label}
            className="max-w-md space-y-2"
            value={value}
        >
            <div className="flex items-center justify-between gap-4 text-sm text-success">
                <Label>{label}</Label>
                <ProgressBar.Output />
            </div>

            <ProgressBar.Track>
                <ProgressBar.Fill />
            </ProgressBar.Track>
        </ProgressBar>
    )
}

export default function AnalysisProgress({
    uploadProgress,
    analysisProgress,
}) {
    if (!uploadProgress && !analysisProgress) return null

    return (
        <div className="space-y-4">
            <ProgressStatus
                value={uploadProgress}
                label={getUploadProgressLabel(uploadProgress)}
            />

            <ProgressStatus
                value={analysisProgress}
                label={getAnalysisProgressLabel(analysisProgress)}
            />
        </div>
    )
}