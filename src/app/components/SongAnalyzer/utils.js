export const BPM_RANGES = [
    { value: '50-100', label: '50 to 100' },
    { value: '75-150', label: '75 to 150' },
    { value: '100-200', label: '100 to 200' },
]

export function getAllowedTypes(envValue = '') {
    return envValue
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean)
}

export function isAudioFile(file) {
    return file?.type?.startsWith('audio/')
}

export function getUploadProgressLabel(progress) {
    return progress === 100 ? 'Waiting for server...' : 'Sending to server...'
}

export function getAnalysisProgressLabel(progress) {
    return progress === 100 ? 'Analysis done.' : 'Analyzing...'
}