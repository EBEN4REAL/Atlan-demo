import Embed from './embed/extension'

const GOOGLE_DOC_REGEX =
    /https?:\/\/(www\.)?docs.google.com\/document\/d\/([^/]*)/
const GOOGLE_SHEETS_REGEX =
    /https?:\/\/(www\.)?docs.google.com\/spreadsheets\/d\/([^/]*)/

export const EMBED_EXTENSIONS = [
    Embed.extend({
        name: 'googleDoc',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Google Docs',
                icon: 'Gdoc',
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
    // Embed.extend({
    //     name: 'googleSheet',
    //     addOptions() {
    //         return {
    //             ...this.parent?.(),
    //             title: 'Google Sheets',
    //             icon: 'Documentation',
    //             validateInput(input) {
    //                 const res = GOOGLE_SHEETS_REGEX.exec(input)
    //                 return (
    //                     GOOGLE_SHEETS_REGEX.test(input) &&
    //                     !!res &&
    //                     res.length > 2
    //                 )
    //             },
    //             getIframeLink(input) {
    //                 const capturedParts = GOOGLE_SHEETS_REGEX.exec(input) || []
    //                 const documentId = capturedParts[2]
    //                 return `https://docs.google.com/spreadsheets/d/${documentId}/preview`
    //             },
    //         }
    //     },
    //     addCommands() {
    //         return {
    //             insertGoogleSheet: this.parent?.().insertEmbed,
    //         }
    //     },
    // }),
]
