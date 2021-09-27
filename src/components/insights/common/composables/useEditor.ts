import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { KeyMaps } from '~/api/keyMap'
import { useAPIPromise } from '~/api/useAPI'

import { Query, BasicSearchResponse } from '~/types/insights/table.interface'

export function useEditor(
    tabs?: Ref<activeInlineTabInterface[]>,
    activeInlineTab?: Ref<activeInlineTabInterface>
) {
    const { modifyActiveInlineTabEditor } = useInlineTab()
    function onEditorContentChange(event: any, editorText: string) {
        if (activeInlineTab && tabs?.value) {
            const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )
            activeInlineTabCopy.playground.editor.text = editorText
            modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
        }
    }

    function modifyEditorContent(
        editorInstance: any,
        monacoInstance: any,
        content: string
    ) {
        const model = monacoInstance?.editor?.createModel(content, 'atlansql')
        editorInstance?.setModel(null)
        editorInstance?.setModel(model)
        editorInstance?.getModel().onDidChangeContent((event) => {
            const text = editorInstance.getValue()
            onEditorContentChange(event, text)
        })
    }
    function moustacheInterpolator(query, variables) {
        query.match(/{{\s*[\w\.]+\s*}}/g).map((x) => {
            query = query.replace(x, (a) => {
                const temp = a.match(/[\w\.]+/)[0]
                return variables[temp]
            })
        })
        if (/{{\s*[\w\.]+\s*}}/g.test(query)) {
            return moustacheInterpolator(query, variables)
        }
        return query
    }

    function getParsedQuery(
        variables: CustomVaribaleInterface[],
        query: string
    ) {
        if (
            variables.length > 0 &&
            query?.match(/{{\s*[\w\.]+\s*}}/g)?.length > 0
        ) {
            const parseVariables: { [key: string]: string } = {}
            variables.forEach((v) => {
                parseVariables[v.name] = v.value
            })
            return moustacheInterpolator(query, parseVariables)
        }

        return query
    }
    function saveQueryInDatabase(body) {
        return useAPIPromise(KeyMaps.insights.CREATE_SAVED_QUERY(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<any>>
    }

    return {
        saveQueryInDatabase,
        modifyEditorContent,
        onEditorContentChange,
        getParsedQuery,
    }
}
