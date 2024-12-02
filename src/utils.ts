export function getFileExtension(mime: string) {
    switch (mime) {
        case 'image/png':
            return 'png'
        case 'image/jpeg':
            return 'jpg'
        case 'image/gif':
            return 'gif'
        case 'image/webp':
            return 'webp'
        case 'image/svg+xml':
            return 'svg'
        case 'video/mp4':
            return 'mp4'
        default:
            throw new Error(`Unknown mime type: ${mime}`)
    }
}
