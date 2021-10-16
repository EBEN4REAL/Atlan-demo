import { Ref, inject, ref, toRaw, ComputedRef } from 'vue'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { generateUUID } from '~/utils/helper/generator'

export function useCustomVariable(editorInstance?: any, monacoInstance?: any) {
    const { modifyActiveInlineTabEditor } = useInlineTab()

    function saveVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        variable: CustomVaribaleInterface,
        currVariable: Ref<CustomVaribaleInterface | undefined>,
        sqlVariables: Ref<CustomVaribaleInterface[]>
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }
        const oldVariableName = currVariable.value?.name
        let reg = new RegExp(`{{${oldVariableName}}}`, 'g')
        const editorQuery = editorInstance.getValue()
        const activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
            JSON.stringify(toRaw(activeInlineTab.value))
        )
        const copy = JSON.parse(JSON.stringify(toRaw(sqlVariables.value)))
        let updatedString = editorQuery.replace(reg, `{{${variable.name}}}`)
        editorInstance.getModel().setValue(updatedString)
        sqlVariables.value = copy
        console.log(sqlVariables.value, copy, 'copy')

        activeInlineTabCopy.playground.editor.variables = toRaw(
            sqlVariables.value
        )

        activeInlineTabCopy.playground.editor.text = updatedString

        // modifyEditorContent(editorInstance, monacoInstance, updatedString)
        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }
    function addVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        sqlVariables: Ref<CustomVaribaleInterface[]>
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }
        const len = sqlVariables.value.length
        const key = String(new Date().getTime())
        const new_variable: CustomVaribaleInterface = {
            name: `variable${len}`,
            key,
            type: 'string',
            value: '',
        }
        sqlVariables.value = [...sqlVariables.value, new_variable]

        editorInstance.trigger('keyboard', 'type', {
            text: `{{variable${len}}}`,
        })
        const activeInlineTabCopy: activeInlineTabInterface = toRaw(
            activeInlineTab.value
        )
        activeInlineTabCopy.playground.editor.variables = toRaw(
            sqlVariables.value
        )
        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }
    function deleteVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        variable: CustomVaribaleInterface,
        sqlVariables: Ref<CustomVaribaleInterface[]>
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }
        const str = editorInstance.getValue()
        const oldVariableName = variable.name
        let updatedName = ''
        const key: string = variable.key
        let regex = new RegExp(`{{${oldVariableName}}}`, 'g')
        let updatedString = str.replace(regex, `${updatedName}`)
        const activeInlineTabCopy: activeInlineTabInterface = toRaw(
            activeInlineTab.value
        )
        let copy = JSON.parse(JSON.stringify(toRaw(sqlVariables.value)))
        copy = copy.filter((c) => c.name !== oldVariableName)
        editorInstance.getModel().setValue(updatedString)
        sqlVariables.value = copy

        activeInlineTabCopy.playground.editor.variables = toRaw(
            sqlVariables.value
        )
        activeInlineTabCopy.playground.editor.text = updatedString
        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }
    function setSqlVariables(
        sqlVariables: Ref<CustomVaribaleInterface[]>,
        newSqlVariables: CustomVaribaleInterface[]
    ) {
        console.log('sett', newSqlVariables)
        sqlVariables.value = newSqlVariables
    }
    /* Return false if no changes otherwise returns new array for sql variables */
    function isSqlVariablesChanged(
        editorText: string,
        sqlVariables: Ref<CustomVaribaleInterface[]>,
        event: any,
        editorInstance?: any
    ) {
        const changedChar = event?.changes[0].text
        const reg = /{{\s*[\w\.]+\s*}}/gm
        /* {{Abcde}},{{hdeff}} */
        const variables: string[] | null =
            editorText.match(reg)?.map(function (x) {
                return x.match(/[\w\.]+/)[0]
            }) ?? []

        /* If variables length!== sqlvariables length then there is some change */
        if (Array.isArray(variables)) {
            console.log(
                variables,
                editorText,
                sqlVariables.value,
                'isSqlVariablesChanged'
            )

            const newSqlVariables: CustomVaribaleInterface[] = []
            for (let i = 0; i < variables.length; i++) {
                const varName = variables[i]
                console.log(
                    sqlVariables.value,
                    changedChar,
                    varName,
                    'changeHello'
                )
                const isVariableAlreadyThere:
                    | CustomVaribaleInterface
                    | undefined = sqlVariables.value.find(
                    (s) => s.name + changedChar === varName
                )
                if (isVariableAlreadyThere) {
                    isVariableAlreadyThere.name =
                        isVariableAlreadyThere.name + changedChar
                    isVariableAlreadyThere.key = generateUUID()
                    isVariableAlreadyThere.value = isVariableAlreadyThere.value
                    isVariableAlreadyThere.type = isVariableAlreadyThere.type
                    newSqlVariables.push(isVariableAlreadyThere)
                } else {
                    /* This is newly created variable from editor */
                    const new_variable: CustomVaribaleInterface = {
                        name: varName,
                        key: generateUUID(),
                        type: 'string',
                        value: '',
                    }
                    newSqlVariables.push(new_variable)
                }
            }
            return newSqlVariables
        }
        return sqlVariables.value
    }
    function initializeSqlVariables(
        activeInlineTab: ComputedRef<activeInlineTabInterface | undefined>
    ) {
        const newSqlVariables = JSON.parse(
            JSON.stringify(
                toRaw(activeInlineTab.value).playground.editor.variables
            )
        )
        console.log('initializarion', activeInlineTab.value)
        setSqlVariables(sqlVariables, newSqlVariables)
    }
    const sqlVariables: Ref<CustomVaribaleInterface[]> = ref([])

    return {
        deleteVariable,
        initializeSqlVariables,
        isSqlVariablesChanged,
        sqlVariables,
        setSqlVariables,
        addVariable,
        saveVariable,
    }
}
