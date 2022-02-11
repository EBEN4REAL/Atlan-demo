import { ref, Ref, toRaw } from 'vue'
import { instances } from '~/components/insights/playground/editor/monaco/useMonaco'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

export const editorStates = new Map()

export function updateEditorModelOnTabClosed(
    editorStates: Map<string, any>,
    key: string
) {
    if (editorStates.has(key)) {
        editorStates.delete(key)
    }
}
export function updateEditorModelOnTabOpen(
    editorStates: Map<string, any>,
    key: string,
    monacoInstance: any,
    text: string
) {
    if (!editorStates.has(key)) {
        const newModel = monacoInstance.editor.createModel(text, 'atlansql')
        editorStates.set(key, {
            model: newModel,
            viewState: undefined,
        })
    }
}
export function updateEditorModel(
    editorStates: Map<string, any>,
    key: string,
    state: {
        viewState: any
        model: any
    },
    tabs?: Ref<activeInlineTabInterface[]>
) {
    editorStates.set(key, state)
    // Special Condition
    if (tabs?.value?.length === 1) {
        instances.editor?.setModel(editorStates.get(key).model)
    }
}

export function createEditorModel(
    monacoInstance: any,
    editorStates: Map<string, any>,
    key: string,
    text: string
) {
    if (!editorStates.get(key)?.model) {
        const newModel = monacoInstance.editor.createModel(text, 'atlansql')
        editorStates.set(key, {
            model: newModel,
            viewState: {},
        })
    }
}
