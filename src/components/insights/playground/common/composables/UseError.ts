export function useError() {
    // msg: null meaning take msg from error Object from Heka
    // data: true means we have to user extra data coming from heka

    const LINE_ERROR_NAMES = ['VALIDATION_ERROR', 'QUERY_PARSING_ERROR']
    const SOURCE_ACCESS_ERROR_NAMES = ['FORBIDDEN']

    const hekaErrorMap = {
        '400': {
            '001': {
                action: null,
                msg: 'Bad request',
            },
            '002': {
                action: null,
                msg: 'Missing information in the request',
            },
            '003': {
                action: null,
                msg: 'Missing a mandatory attribute in the request body/parameter',
            },
            '004': {
                action: null,
                msg: null,
            },
        },
        '401': {
            '001': {
                action: null,
                msg: 'User Unauthorized',
            },
        },
        '403': {
            '001': {
                action: null,
                msg: 'User is not allowed to access the asset',
                data: true,
            },
        },
        '500': {
            '001': {
                action: null,
                msg: 'Something went wrong with the system',
            },
            '002': {
                action: null,
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
                action: null,
                msg: 'Something went wrong with the system',
            },
            '002': {
                action: null,
                msg: 'Something went wrong with the system',
            },
            '003': {
                action: null,
                msg: 'Something went wrong with the system',
            },
        },
    }

    const httpErrorCode = (errorCode) => {
        let code = errorCode.split('-')
        return code[1]
    }

    const hekaErrorCode = (errorCode) => {
        let code = errorCode.split('-')
        return code[3]
    }

    const hasErrorAction = (queryErrorObj) => {
        let http = httpErrorCode(queryErrorObj?.errorCode)
        let heka = hekaErrorCode(queryErrorObj?.errorCode)

        let errorData = hekaErrorMap[http][heka]

        return errorData?.action // return action string or null
    }

    const hasErrorData = (queryErrorObj) => {
        let http = httpErrorCode(queryErrorObj?.errorCode)
        let heka = hekaErrorCode(queryErrorObj?.errorCode)

        let errorData = hekaErrorMap[http][heka]

        return errorData?.data ? true : false // return if we have data
    }

    const errorMessage = (queryErrorObj) => {
        let http = httpErrorCode(queryErrorObj?.errorCode)
        let heka = hekaErrorCode(queryErrorObj?.errorCode)

        let errorData = hekaErrorMap[http][heka]

        return errorData?.msg ? errorData?.msg : queryErrorObj?.errorMessage
    }

    return {
        hekaErrorMap,
        httpErrorCode,
        hekaErrorCode,
        errorMessage,
        hasErrorData,
        hasErrorAction,
        LINE_ERROR_NAMES,
        SOURCE_ACCESS_ERROR_NAMES

    }
}
