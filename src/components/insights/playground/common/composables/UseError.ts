import { isNumber } from '@vueuse/core'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { Ref } from 'vue'

export function useError() {
    // msg: null meaning take msg from error Object from Heka
    // data: true means we have to user extra data coming from heka

    const LINE_ERROR_NAMES = ['VALIDATION_ERROR', 'QUERY_PARSING_ERROR'];
    const SOURCE_ACCESS_ERROR_NAMES = [
        'FORBIDDEN',
        'NO_QUERY_ACCESS_CONNECTION_RESTRICTED',
        'NO_QUERY_ACCESS_CONNECTION_DENY_POLICY',
        'NO_PREVIEW_ACCESS_CONNECTION_RESTRICTED'
    ];

    const hekaErrorMap = {
        '000': {
            action: null,
            msg: 'Cannot connect to the Internet.',
            desc: 'Sorry, we don’t have the dino game, check your internet connection and try again :('
        },
        '400': {
            '001': {
                action: 'copy',
                msg: 'Snap! Bad request :/',
                desc: 'Looks like something broke on our end. Contact Atlan support to raise a support request.'
            },
            '002': {
                action: 'copy',
                msg: 'Snap! Bad request :/',
                desc: 'Missing information in the request'
            },
            '003': {
                action: 'copy',
                msg: 'Snap! Bad request :/',
                desc: 'Missing a mandatory attribute in the request body/parameter',
            },
            '004': {
                action: 'copy',
                msg: 'Snap! Bad request :/',
                desc: 'Command not supported',
            },
        },
        '401': {
            '001': {
                action: 'copy',
                msg: 'User Unauthorized',
            },
        },
        '403': {
            '001': {
                action: null,
                msg: 'No query access :(',
                data: true,
            },
            '002': {
                action: null,
                msg: 'No query access :(',
                helperText: 'Request admins to enable query access on this connection, or use a different connection.',
                data: true,
            },
            '003': {
                action: null,
                msg: 'No query access :(',
                helperText: 'Request admins to enable query access on this connection, or use a different connection.',
                data: true,
            },
            '004': {
                action: null,
                msg: 'No query access :(',
                helperText: 'Request admins to make changes to the data policy.',
                data: true,
            },
            '005': {
                action: null,
                msg: 'No query access :(',
                helperText: 'Request admins to make changes to the data policy.',
                data: true,
            },
        },
        '500': {
            '001': {
                action: 'copy',
                msg: 'Something went wrong with the system',
                desc: 'Oops! Something went wrong on our end. Please reach out to Atlan team with error logs',
            },
            '002': {
                action: 'copy',
                msg: 'Errors while query execution at source',
            },
            '003': {
                action: null,
                msg: null,
                data: true,
            },
            '004': {
                action: null,
                msg: null,
                data: true,
            },
        },
        '503': {
            '001': {
                action: 'copy',
                msg: 'Something went wrong with the system',
                desc: 'Oops! Something went wrong on our end. Please reach out to Atlan team with error logs',
            },
            '002': {
                action: 'copy',
                msg: 'Something went wrong with the system',
                desc: 'Oops! Something went wrong on our end. Please reach out to Atlan team with error logs',
            },
            '003': {
                action: 'copy',
                msg: 'Something went wrong with the system',
                desc: 'Oops! Something went wrong on our end. Please reach out to Atlan team with error logs',
            },
        },
    }

    const httpErrorCode = (errorCode) => {
        if (errorCode === undefined) {
            return '000'
        }
        if (isNumber(errorCode)) {
            return String(errorCode)
        }

        if (errorCode.includes('-')) {
            const code = errorCode.split('-');

            return code[1]
        }

        return '000';
    }

    const hekaErrorCode = (errorCode) => {
        const code = String(errorCode)?.split('-')

        if (Array.isArray(code))
            return code[3]

        return undefined
    }

    const hasErrorAction = (queryErrorObj) => {
        const http = httpErrorCode(queryErrorObj?.errorCode)
        const heka = hekaErrorCode(queryErrorObj?.errorCode)
        let errorData

        if (http !== undefined) {
            if (heka !== undefined) errorData = hekaErrorMap[http][heka]
        }

        return errorData?.action // return action string or null
    }

    const hasHelperText = (queryErrorObj) => {
        const http = httpErrorCode(queryErrorObj?.errorCode)
        const heka = hekaErrorCode(queryErrorObj?.errorCode)
        let errorData

        if (http !== undefined) {
            if (heka !== undefined) errorData = hekaErrorMap[http][heka]
        }

        return errorData?.helperText // return action string or null
    }

    const hasErrorData = (queryErrorObj) => {
        const http = httpErrorCode(queryErrorObj?.errorCode)
        const heka = hekaErrorCode(queryErrorObj?.errorCode)
        let errorData

        if (http !== undefined) {
            if (heka !== undefined) errorData = hekaErrorMap[http][heka]
        }

        return errorData?.data // return if we have data
    }

    const errorMessage = (queryErrorObj) => {
        const http = httpErrorCode(queryErrorObj?.errorCode)
        const heka = hekaErrorCode(queryErrorObj?.errorCode)
        let errorData

        if (http !== undefined) {
            if (heka !== undefined)
                errorData = hekaErrorMap[http][heka]
            else {
                errorData = hekaErrorMap[http];
            }
        }

        return errorData?.msg ? errorData?.msg : queryErrorObj?.errorMessage
    }

    const errorDescription = (queryErrorObj) => {
        const http = httpErrorCode(queryErrorObj?.errorCode)
        const heka = hekaErrorCode(queryErrorObj?.errorCode)
        let errorData

        if (http !== undefined) {
            if (heka !== undefined) {
                errorData = hekaErrorMap[http][heka];
            }
            else {
                errorData = hekaErrorMap[http];
            }
        }

        return errorData?.desc
            ? errorData?.desc
            : queryErrorObj?.errorDescription ?? ''
    }

    const setStreamErrorInActiveInlineTab = (
        tabs: Ref<activeInlineTabInterface[]>,
        error: Ref<any>,
        tabIndex: number
    ) => {
        tabs.value[tabIndex].playground.resultsPane.result.runQueryId =
            undefined
        tabs.value[tabIndex].playground.resultsPane.result.totalRowsCount = -1
        tabs.value[tabIndex].playground.resultsPane.result.executionTime = -1
        tabs.value[tabIndex].playground.resultsPane.result.isQueryRunning =
            'error'
        /* ------------------- */
        /* USE SSE ERROR */
        if (error.value?.statusText) {
            tabs.value[tabIndex].playground.resultsPane.result.queryErrorObj = {
                requestId: '',
                errorName: '',
                errorMessage:
                    error.value?.statusText ?? 'Oops! Something went wrong',
                errorCode: error.value?.status,
                developerMessage: error.value?.statusText,
                errorDescription: 'Oops! Something went wrong',
            }
        } else if (error.value?.error) {
            tabs.value[tabIndex].playground.resultsPane.result.queryErrorObj = {
                requestId: '',
                errorName: '',
                errorMessage:
                    error.value?.error?.message?.toUpperCase() ??
                    'Oops! Something went wrong',
                errorCode: '000',
                developerMessage: error.value?.statusText,
                errorDescription: 'Oops! Something went wrong',
            }
        }

        /* Setting it undefined for new run */

        tabs.value[tabIndex].playground.resultsPane.result.runQueryId =
            undefined
    }

    const setHekaErrorInActiveInlineTab = (
        tabs: Ref<activeInlineTabInterface[]>,
        eventSource: Ref<any>,
        message: any,
        tabIndex: number
    ) => {
        if (eventSource.value?.close) {
            eventSource.value.close()
        }
        /* Query related data */
        tabs.value[tabIndex].playground.resultsPane.result.queryErrorObj =
            message
        tabs.value[tabIndex].playground.resultsPane.result.totalRowsCount = -1
        tabs.value[tabIndex].playground.resultsPane.result.executionTime = -1
        tabs.value[tabIndex].playground.resultsPane.result.isQueryRunning =
            'error'
        /* ------------------- */
        /* Setting it undefined for new run */

        tabs.value[tabIndex].playground.resultsPane.result.runQueryId =
            undefined
    }

    return {
        hekaErrorMap,
        httpErrorCode,
        hekaErrorCode,
        errorMessage,
        hasErrorData,
        hasHelperText,
        hasErrorAction,
        LINE_ERROR_NAMES,
        SOURCE_ACCESS_ERROR_NAMES,
        errorDescription,
        setStreamErrorInActiveInlineTab,
        setHekaErrorInActiveInlineTab,
    }
}
