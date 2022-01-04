import { toRaw } from 'vue'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'

export function useRunQueryUtils(editorInstance, monacoInstance) {
    const { resetErrorDecorations, setErrorDecorations } = useEditor()

    const onRunCompletion = (activeInlineTab, status: string) => {
        if (status === 'success') {
            /* Resetting the red dot from the editor if it error is not line type */
            resetErrorDecorations(activeInlineTab, toRaw(editorInstance.value))
        } else if ((status = 'error')) {
            resetErrorDecorations(activeInlineTab, toRaw(editorInstance.value))
            /* If it is a line error i,e VALIDATION_ERROR | QUERY_PARSING_ERROR */
            const errorName =
                activeInlineTab.value?.playground?.resultsPane?.result
                    ?.queryErrorObj?.errorName

            console.log(
                'error data: ',
                activeInlineTab.value?.playground?.resultsPane?.result
                    ?.queryErrorObj?.errorName
            )
            if (LINE_ERROR_NAMES.includes(errorName)) {
                setErrorDecorations(
                    activeInlineTab,
                    toRaw(editorInstance),
                    toRaw(monacoInstance)
                )
            }
        }
    }
    const onQueryIdGeneration = (
        activeInlineTab,
        queryId: string,
        eventSource: any
    ) => {
        /* Setting the particular instance to this tab */
        activeInlineTab.value.playground.resultsPane.result.runQueryId = queryId
        activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
            eventSource
    }

    return {
        onRunCompletion,
        onQueryIdGeneration,
    }
}
