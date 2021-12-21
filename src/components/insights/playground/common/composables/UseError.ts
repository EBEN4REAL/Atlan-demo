export function useError() {
   
    const hekaErrorMap = {
        '400': {
            '001': 'Bad request',
            '002': 'Missing information in the request',
            '003': 'Missing a mandatory attribute in the request body/parameter',
            '004': 'Operation not supported'
        },
        '401': {
            '001': 'User Unauthorized'
        },
        '403': {
            '001': 'User not allowed to perform an action'
        },
        '500': {
            '001':'Something went wrong with the system',
            '002':'Errors while query execution at source',
            '003':'Error validating the assets in the query',
            '004':'Error occurred while parsing the query'
        },
        '503': {
            '001': 'Dependency service unavailable',
            '002':'Dependency service unavailable',
            '003': 'Dependency service unavailable'
        }
    }

    const hekaHttpErrorCode = (errorCode) => {
        let code = errorCode.split('-')
        return code[1]
    }

    const hekaErrorCode = (errorCode) => {
        let code = errorCode.split('-')
        return code[3]
    }

    const errorMessage = (errorCode) => {
        let http = hekaHttpErrorCode(errorCode)
        let code = hekaErrorCode(errorCode)

        return hekaErrorMap[http][code]
    }
    return {
        hekaErrorMap,
        hekaHttpErrorCode,
        hekaErrorCode,
        errorMessage
    }
}
