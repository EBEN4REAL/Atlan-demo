import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

export function useEditor(
    tabs: Ref<activeInlineTabInterface[]>,
    activeInlineTab: Ref<activeInlineTabInterface>
) {
    const { modifyActiveInlineTabEditor } = useInlineTab()
    function onEditorContentChange(event: any, editorText: string) {
        console.log(editorText)
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.playground.editor.text = editorText
        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }

    return {
        onEditorContentChange,
    }
}
