import Embed from './embed/extension'

const GOOGLE_DOC_REGEX =
    /^https?:\/\/(www\.)?docs.google.com\/document\/d\/([^/]*)/
const GOOGLE_SHEETS_REGEX =
    /^https?:\/\/(www\.)?docs.google.com\/spreadsheets\/d\/([^/]*)/
const GOOGLE_SLIDES_REGEX =
    /^https?:\/\/(www\.)?docs.google.com\/presentation\/d\/([^/]*)/
const MIRO_BOARD_REGEX =
    /^https:\/\/(realtimeboard|miro).com\/app\/board\/(.*)$/
const FIGJAM_REGEX = /^https:\/\/(www\.)?figma.com\/file\/([^/]*)/
const LUCID_CHART_REGEX = /^https?:\/\/(www\.)?lucid.app\/lucidchart\/([^/]*)/
const GOOGLE_DATA_STUDIO_REGEX =
    /^https?:\/\/(www\.)?datastudio.google.com\/.+\/reporting\/([^/]*)/

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
    Embed.extend({
        name: 'miro',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Miro Board',
                icon: 'Miro',
                showFooter: false,
                validateInput(input) {
                    return (
                        MIRO_BOARD_REGEX.test(input) &&
                        MIRO_BOARD_REGEX.exec(input)?.length > 2
                    )
                },
                getIframeLink(input) {
                    const matches = MIRO_BOARD_REGEX.exec(input)
                    const domain = matches[1]
                    const boardId = matches[2]

                    return `https://${domain}.com/app/embed/${boardId}`
                },
            }
        },
        addCommands() {
            return {
                insertMiroBoard: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'figjam',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'FigJam',
                icon: 'Figma',
                showFooter: false,
                validateInput(input) {
                    return FIGJAM_REGEX.test(input)
                },
                getIframeLink(input) {
                    return `https://www.figma.com/embed?embed_host=share&url=${input}`
                },
            }
        },
        addCommands() {
            return {
                insertFigjam: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'lucid',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Lucidchart',
                icon: 'Lucid',
                showFooter: false,
                validateInput(input) {
                    const res = LUCID_CHART_REGEX.exec(input)
                    return (
                        LUCID_CHART_REGEX.test(input) && !!res && res.length > 2
                    )
                },
                getIframeLink(input) {
                    const capturedParts = LUCID_CHART_REGEX.exec(input) || []
                    const documentId = capturedParts[2]
                    return `https://lucid.app/documents/embeddedchart/${documentId}`
                },
            }
        },
        addCommands() {
            return {
                insertLucidChart: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'googleDataStudio',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Google Data Studio',
                icon: 'GoogleDataStudio',
                showFooter: false,
                validateInput(input) {
                    const res = GOOGLE_DATA_STUDIO_REGEX.exec(input)
                    return (
                        GOOGLE_DATA_STUDIO_REGEX.test(input) &&
                        !!res &&
                        res.length > 1
                    )
                },
                getIframeLink(input) {
                    const capturedParts =
                        GOOGLE_DATA_STUDIO_REGEX.exec(input) || []
                    const documentId = capturedParts[2]
                    return `https://datastudio.google.com/embed/reporting/${documentId}`
                },
            }
        },
        addCommands() {
            return {
                insertGoogleDataStudioReport: this.parent?.().insertEmbed,
            }
        },
    }),
]
