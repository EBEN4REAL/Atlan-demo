import { h, VNode } from 'vue'
import AtlanIcon from '@common/icon/atlanIcon.vue'
import { Popover } from 'ant-design-vue'
import Embed from './embed/extension'

import MSExcelDemo from '~/assets/gifs/Readme/MSExcel.gif'
import MSPowerpointDemo from '~/assets/gifs/Readme/MSPowerpoint.gif'
import MSWordDemo from '~/assets/gifs/Readme/MSWord.gif'

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
const DB_DIAGRAM_REGEX = /^https?:\/\/(www\.)?dbdiagram.io\/(embed|d)\/([^/]*)/
const ONEDRIVE_REGEX = /^https?:\/\/(www\.)?onedrive.live.com\/.+/

const DEMO_GIFS = {
    'Word Document': MSWordDemo,
    'Excel Sheet': MSExcelDemo,
    'PowerPoint Presentation': MSPowerpointDemo,
}

/**
 * A general utility for validating Microsoft Links since all of them share the
 * same structure and semantics.
 *
 *  There are two ways to accept a MS Excel link:
 *  1. A simple link from the URL bar.
 *  2. A generated IFrame code, available for sheets stored in the cloud.
 *  For the latter, we extract the src attribute and process just like we do
 *  for the former.
 *
 * @param input - The URL of Embed Code provided by the user
 *
 * @returns A boolean indicating validity of the given input.
 */
const validateMicrosoftInput = (input: string): boolean => {
    if (!input.includes('?') || !ONEDRIVE_REGEX.test(input)) {
        if (!input.startsWith('<iframe')) {
            return false
        }
    }
    let queryString = ''
    if (input.startsWith('<iframe')) {
        const srcRegex = /.+src="([^"]*).+/
        if (!srcRegex.test(input)) {
            return false
        }
        const srcAttribute = srcRegex.exec(input)
        if (!srcAttribute || srcAttribute.length !== 2) {
            return false
        }
        if (srcAttribute[1].includes('&amp;')) {
            srcAttribute[1] = srcAttribute[1].replaceAll('&amp;', '&')
        }
        queryString = srcAttribute[1].split('?')[1]
    } else {
        queryString = input.split('?')[1]
    }
    const params = new URLSearchParams(queryString)
    return params.has('resid') && params.has('authkey')
}

/**
 * A general utility function for parsing ang generating an IFrame link for
 * all Microsoft Embeds.
 *
 * There are two ways to accept a MS Excel link:
 *  1. A simple link from the URL bar.
 *  2. A generated IFrame code, available for sheets stored in the cloud.
 *  For the latter, we extract the src attribute and process just like we do
 *  for the former.
 *
 * @param input - The URL of Embed Code provided by the user
 *
 * @returns A string with the IFrame URL.
 */
const getMicrosoftIframeLink = (input: string): string => {
    let queryString = ''
    if (input.startsWith('<iframe')) {
        const srcRegex = /.+src="([^"]*).+/
        const srcAttribute = srcRegex.exec(input)
        if (srcAttribute[1].includes('&amp;')) {
            srcAttribute[1] = srcAttribute[1].replaceAll('&amp;', '&')
        }
        queryString = srcAttribute[1].split('?')[1]
    } else {
        queryString = input.split('?')[1]
    }
    const params = new URLSearchParams(queryString)
    const resid = params.get('resid')
    const authkey = params.get('authkey')
    return `https://onedrive.live.com/embed?resid=${resid}&authkey=${authkey}&em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True`
}

const getCustomMicrosoftFooter = (
    service: 'Word Document' | 'Excel Sheet' | 'PowerPoint Presentation'
): VNode =>
    h('div', { class: 'mt-2 flex items-center content-center' }, [
        h('span', { class: 'text-gray-400 text-xs ' }, [
            `Learn more about embedding ${service}s here`,
        ]),
        h(
            Popover,
            {
                placement: 'right',
            },
            {
                default: () =>
                    h(AtlanIcon, {
                        icon: 'QuestionRoundSmall',
                        class: 'ml-1',
                    }),
                content: () =>
                    h(
                        'div',
                        {
                            class: 'w-92 p-2 bg-gray-700 rounded container-gif-permission',
                        },
                        [
                            h('img', {
                                src: DEMO_GIFS[service],
                                class: 'mb-2 rounded',
                            }),
                            h(
                                'span',
                                {
                                    class: 'text-sm text-white',
                                },
                                [
                                    `Generate an Embed code for your ${service}, and paste it here. We'll take care of the rest`,
                                ]
                            ),
                        ]
                    ),
            }
        ),
    ])

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
                validateInput(input: string): boolean {
                    return validateMicrosoftInput(input)
                },
                getIframeLink(input: string): string {
                    return getMicrosoftIframeLink(input)
                },
                customFooter: getCustomMicrosoftFooter('Word Document'),
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
                validateInput(input: string): boolean {
                    return validateMicrosoftInput(input)
                },
                getIframeLink(input: string): string {
                    return getMicrosoftIframeLink(input)
                },
                customFooter: getCustomMicrosoftFooter('Excel Sheet'),
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
                validateInput(input: string): boolean {
                    return validateMicrosoftInput(input)
                },
                getIframeLink(input: string): string {
                    return getMicrosoftIframeLink(input)
                },
                customFooter: getCustomMicrosoftFooter(
                    'PowerPoint Presentation'
                ),
            }
        },
        addCommands() {
            return {
                insertMicrosoftPowerpoint: this.parent?.().insertEmbed,
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
