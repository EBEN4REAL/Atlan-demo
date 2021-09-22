import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

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

    return {
        onEditorContentChange,
        moustacheInterpolator,
    }
}
