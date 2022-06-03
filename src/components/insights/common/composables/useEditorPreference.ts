import { Ref, toRaw, ref, watch } from 'vue'
import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { themes } from '~/components/insights/playground/editor/monaco/themeLoader'

export function useEditorPreference() {
    const {
        getUserPereferenceFromLocalStorage,
        setUserPreferenceToLocalStorage,
    } = useLocalStorageSync()

    function setEditorTheme(
        monacoInstance,
        editorConfig: Ref<editorConfigInterface>,
        themeName: string
    ) {
        if (themeName) {
            monacoInstance.editor.setTheme(themeName)
            monacoInstance.editor.setTheme(themeName)
            const editorConfigCopy = Object.assign({}, editorConfig.value)
            editorConfigCopy.theme = themeName
            editorConfig.value = editorConfigCopy
        }
    }
    function setTabSpaces(
        editorInstance: any,
        editorConfig: Ref<editorConfigInterface>,
        tabSpace: number
    ) {
        console.log(editorConfig, 'c')

        editorInstance.getModel().updateOptions({ tabSize: tabSpace })
        const editorConfigCopy = Object.assign({}, editorConfig.value)
        editorConfigCopy.tabSpace = tabSpace
        editorConfig.value = editorConfigCopy
    }
    function setFontSizes(
        editorInstance: any,
        editorConfig: Ref<editorConfigInterface>,
        size: number
    ) {
        editorInstance.updateOptions({ fontSize: size })
        const editorConfigCopy = Object.assign({}, editorConfig.value)
        editorConfigCopy.fontSize = size
        editorConfig.value = editorConfigCopy
    }

    function setCursorStyle(
        editorInstance: any,
        editorConfig: Ref<editorConfigInterface>,
        cursor: string
    ) {
        editorInstance.updateOptions({ cursorStyle: cursor })
        const editorConfigCopy = Object.assign({}, editorConfig.value)
        editorConfigCopy.cursorStyle = cursor
        editorConfig.value = editorConfigCopy
    }

    const editorConfig: Ref<editorConfigInterface> = ref(
        getUserPereferenceFromLocalStorage()
    )
    // FIXME: For removing the line one from customer instances from thier local storage
    editorConfig.value.cursorStyle = 'block'

    const getThemeLabelFromName = (themeName: string) => {
        const theme = themes.find((theme) => theme.name === themeName)
        if (theme && theme.label) return theme.label
    }

    const editorHoverConfig = ref({
        theme: 'AtlanLight',
        tabSpace: 3,
        fontSize: 14,
        cursorStyle: 'block',
    })
    return {
        getThemeLabelFromName,
        setUserPreferenceToLocalStorage,
        setFontSizes,
        setTabSpaces,
        setEditorTheme,
        editorConfig,
        editorHoverConfig,
        setCursorStyle,
    }
}
