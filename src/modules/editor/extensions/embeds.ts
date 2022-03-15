import Embed from './embed/extension'

const GOOGLE_DOC_REGEX =
    /https?:\/\/(www\.)?docs.google.com\/document\/d\/([^/]*)/
const GOOGLE_SHEETS_REGEX =
    /https?:\/\/(www\.)?docs.google.com\/spreadsheets\/d\/([^/]*)/
const GOOGLE_SLIDES_REGEX =
    /https?:\/\/(www\.)?docs.google.com\/presentation\/d\/([^/]*)/
const GOOGLE_DRIVE_REGEX =
    /https?:\/\/(www\.)?drive.google.com\/file\/d\/([^/]*)/

export const EMBED_EXTENSIONS = [
    Embed.extend({
        name: 'googleDoc',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Google Docs',
                icon: 'GoogleDoc',
                validateInput(input) {
                    const res = GOOGLE_DOC_REGEX.exec(input)
                    return (
                        GOOGLE_DOC_REGEX.test(input) && !!res && res.length > 2
                    )
                },
                getIframeLink(input) {
                    const capturedParts = GOOGLE_DOC_REGEX.exec(input) || []
                    const documentId = capturedParts[2]
                    return `https://docs.google.com/document/d/${documentId}/preview`
                },
            }
        },
        addCommands() {
            return {
                insertGoogleDoc: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'googleSheet',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Google Sheets',
                icon: 'GoogleSheet',
                validateInput(input) {
                    const res = GOOGLE_SHEETS_REGEX.exec(input)
                    return (
                        GOOGLE_SHEETS_REGEX.test(input) &&
                        !!res &&
                        res.length > 2
                    )
                },
                getIframeLink(input) {
                    const capturedParts = GOOGLE_SHEETS_REGEX.exec(input) || []
                    const documentId = capturedParts[2]
                    return `https://docs.google.com/spreadsheets/d/${documentId}/preview`
                },
            }
        },
        addCommands() {
            return {
                insertGoogleSheet: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'googleSlide',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Google Slides',
                icon: 'GoogleSlide',
                validateInput(input) {
                    const res = GOOGLE_SLIDES_REGEX.exec(input)
                    return (
                        GOOGLE_SLIDES_REGEX.test(input) &&
                        !!res &&
                        res.length > 2
                    )
                },
                getIframeLink(input) {
                    const capturedParts = GOOGLE_SLIDES_REGEX.exec(input) || []
                    const documentId = capturedParts[2]
                    return `https://docs.google.com/presentation/d/${documentId}/preview`
                },
            }
        },
        addCommands() {
            return {
                insertGoogleSlide: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'googleDrive',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Google Drive',
                icon: 'GoogleDrive',
                validateInput(input) {
                    return GOOGLE_DRIVE_REGEX.test(input)
                },
                getIframeLink(input) {
                    return `https://docs.google.com/viewer?url=${input}`
                },
            }
        },
        addCommands() {
            return {
                insertGoogleDrive: this.parent?.().insertEmbed,
            }
        },
    }),
]
