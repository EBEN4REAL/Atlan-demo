import { h } from 'vue'
import Embed from './embed/extension'
import AtlanIcon from '@common/icon/atlanIcon.vue'

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
const DB_DIAGRAM_REGEX = /^https?:\/\/(www\.)?dbdiagram.io\/(embed|d)\/([^/]*)/
const ONEDRIVE_REGEX = /^https?:\/\/(www\.)?onedrive.live.com\/.+/

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
        name: 'dbDiagram',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'DBDiagram',
                icon: 'DBDiagram',
                showFooter: false,
                validateInput(input) {
                    const res = DB_DIAGRAM_REGEX.exec(input)
                    return (
                        DB_DIAGRAM_REGEX.test(input) &&
                        !!res &&
                        res.length === 4
                    )
                },
                getIframeLink(input) {
                    const capturedParts = DB_DIAGRAM_REGEX.exec(input) || []
                    const documentId = capturedParts[3]
                    return `https://dbdiagram.io/embed/${documentId}`
                },
            }
        },
        addCommands() {
            return {
                insertDbDiagram: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'microsoftWord',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Microsoft Word',
                icon: 'MicrosoftWord',
                showFooter: false,
                validateInput(input: string) {
                    if (!input.includes('?') || !ONEDRIVE_REGEX.test(input)) {
                        return false
                    }
                    const queryString = input.split('?')[1]
                    const params = new URLSearchParams(queryString)
                    return params.has('resid') && params.has('authkey')
                },
                getIframeLink(input) {
                    const queryString = input.split('?')[1]
                    const params = new URLSearchParams(queryString)
                    const resid = params.get('resid')
                    const authkey = params.get('authkey')
                    return `https://onedrive.live.com/embed?resid=${resid}&authkey=${authkey}&em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True`
                },
            }
        },
        addCommands() {
            return {
                insertMicrosoftWord: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'microsoftExcel',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Microsoft Excel',
                icon: 'MicrosoftExcel',
                showFooter: false,
                validateInput(input: string) {
                    if (!input.includes('?') || !ONEDRIVE_REGEX.test(input)) {
                        return false
                    }
                    const queryString = input.split('?')[1]
                    const params = new URLSearchParams(queryString)
                    return params.has('resid') && params.has('authkey')
                },
                getIframeLink(input) {
                    const queryString = input.split('?')[1]
                    const params = new URLSearchParams(queryString)
                    const resid = params.get('resid')
                    const authkey = params.get('authkey')
                    return `https://onedrive.live.com/embed?resid=${resid}&authkey=${authkey}&em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True`
                },
                customFooter: h('small', { class: 'text-gray-400' }, [
                    'Learn more about embedding Excel Sheets Here',
                    h(AtlanIcon, { icon: 'QuestionRound' }),
                ]),
            }
        },
        addCommands() {
            return {
                insertMicrosoftExcel: this.parent?.().insertEmbed,
            }
        },
    }),
    Embed.extend({
        name: 'microsoftPowerpoint',
        addOptions() {
            return {
                ...this.parent?.(),
                title: 'Microsoft PowerPoint',
                icon: 'MicrosoftPowerpoint',
                showFooter: false,
                validateInput(input: string) {
                    if (!input.includes('?') || !ONEDRIVE_REGEX.test(input)) {
                        return false
                    }
                    const queryString = input.split('?')[1]
                    const params = new URLSearchParams(queryString)
                    return params.has('resid') && params.has('authkey')
                },
                getIframeLink(input) {
                    const queryString = input.split('?')[1]
                    const params = new URLSearchParams(queryString)
                    const resid = params.get('resid')
                    const authkey = params.get('authkey')
                    return `https://onedrive.live.com/embed?resid=${resid}&authkey=${authkey}&em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True`
                },
                customFooter: `<p class='text-gray'>Learn how to embed a Microsoft PowerPoint presentation</p>`,
            }
        },
        addCommands() {
            return {
                insertMicrosoftPowerpoint: this.parent?.().insertEmbed,
            }
        },
    }),
]
