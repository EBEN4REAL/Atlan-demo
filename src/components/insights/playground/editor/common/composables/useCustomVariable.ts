import { Ref, inject, ref, toRaw, ComputedRef } from 'vue'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { generateUUID } from '~/utils/helper/generator'

export function useCustomVariable(editorInstance?: any, monacoInstance?: any) {
    const { modifyActiveInlineTabEditor, modifyActiveInlineTab } =
        useInlineTab()

    function saveVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        variable: CustomVaribaleInterface,
        currVariable: Ref<CustomVaribaleInterface | undefined>
        // sqlVariables: Ref<CustomVaribaleInterface[]>
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

        let updatedString = editorQuery.replace(reg, `{{${variable.name}}}`)
        editorInstance.getModel().setValue(updatedString)

        let index = activeInlineTab.value.playground.editor.variables.findIndex(
            (variable) => variable.key === currVariable.value.key
        )
        let savedIndex =
            activeInlineTab.value.playground.editor.savedVariables.findIndex(
                (variable) => variable.key === currVariable.value.key
            )

        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.playground.editor.text = updatedString

        activeInlineTabCopy.playground.editor.variables[index] = {
            ...activeInlineTabCopy.playground.editor.variables[index],
            value: variable.value,
            name: variable.name,
            type: variable.type,
            options: variable.options,
            allowMultiple: variable.allowMultiple,
            dummy: variable.dummy,
        }
        activeInlineTabCopy.playground.editor.savedVariables[savedIndex] = {
            ...activeInlineTabCopy.playground.editor.savedVariables[savedIndex],
            value: variable.value,
            name: variable.name,
            type: variable.type,
            options: variable.options,
            allowMultiple: variable.allowMultiple,
            dummy: variable.dummy,
        }
        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }

    function editVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        curr_variable: CustomVaribaleInterface
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }

        let index = activeInlineTab.value.playground.editor.variables.findIndex(
            (variable) => variable.name === curr_variable.name
        )
        let savedIndex =
            activeInlineTab.value.playground.editor.savedVariables.findIndex(
                (variable) => variable.name === curr_variable.name
            )

        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.playground.editor.variables[index] = {
            ...activeInlineTabCopy.playground.editor.variables[index],
            value: curr_variable.value,
        }
        activeInlineTabCopy.playground.editor.savedVariables[savedIndex] = {
            ...activeInlineTabCopy.playground.editor.savedVariables[savedIndex],
            value: curr_variable.value,
        }
        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }

    function addVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>
        // sqlVariables: Ref<CustomVaribaleInterface[]>
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }

        const len = activeInlineTab.value.playground.editor.variables.length
        const key = String(new Date().getTime())
        const new_variable: CustomVaribaleInterface = {
            name: `variable${len}`,
            key,
            type: 'string',
            value: '',
            options: [],
            allowMultiple: false,
            dummy: '',
            isVQBtype: false,
        }
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        //check if variable is present in cache
        let index = null
        index =
            activeInlineTab.value.playground.editor.savedVariables.findIndex(
                (variable) => variable.name === new_variable.name
            )
        console.log('index: ', index)
        if (index !== -1) {
            let currIndex =
                activeInlineTab.value.playground.editor.variables.findIndex(
                    (variable) => variable.name === new_variable.name
                )
            if (currIndex !== -1) {
                let variable: CustomVaribaleInterface = {
                    name: `variable${Math.ceil(Math.random() * 100) + len}`,
                    key,
                    type: 'string',
                    value: '',
                    options: [],
                    allowMultiple: false,
                    dummy: '',
                    isVQBtype: false,
                }
                activeInlineTabCopy.playground.editor.variables = [
                    ...activeInlineTabCopy.playground.editor.variables,
                    variable,
                ]
                activeInlineTabCopy.playground.editor.savedVariables = [
                    ...activeInlineTabCopy.playground.editor.savedVariables,
                    variable,
                ]

                editorInstance.trigger('keyboard', 'type', {
                    text: `{{${variable.name}}}`,
                })
            } else {
                activeInlineTabCopy.playground.editor.variables = [
                    ...activeInlineTabCopy.playground.editor.variables,
                    activeInlineTab.value.playground.editor.savedVariables[
                        index
                    ],
                ]
                editorInstance.trigger('keyboard', 'type', {
                    text: `{{${activeInlineTab.value.playground.editor.savedVariables[index].name}}}`,
                })
            }
        } else {
            activeInlineTabCopy.playground.editor.variables = [
                ...activeInlineTabCopy.playground.editor.variables,
                new_variable,
            ]
            activeInlineTabCopy.playground.editor.savedVariables = [
                ...activeInlineTabCopy.playground.editor.savedVariables,
                new_variable,
            ]
            editorInstance.trigger('keyboard', 'type', {
                text: `{{variable${len}}}`,
            })
        }

        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }

    function deleteVariable(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        currVariable: CustomVaribaleInterface
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }
        const str = editorInstance.getValue()
        const oldVariableName = currVariable.name
        let updatedName = ''
        // const key: string = variable.key
        let regex = new RegExp(`{{${oldVariableName}}}`, 'g')
        let updatedString = str.replace(regex, `${updatedName}`)

        editorInstance.getModel().setValue(updatedString)

        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.playground.editor.text = updatedString

        activeInlineTabCopy.playground.editor.variables =
            activeInlineTab.value.playground.editor.variables.filter(
                (variable) => variable.key !== currVariable.key
            )

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
                    const t = sqlVariables.value.find((s) => s.name === varName)
                    if (!t) {
                        /* This is newly created variable from editor */
                        const new_variable: CustomVaribaleInterface = {
                            name: varName,
                            key: generateUUID(),
                            type: 'string',
                            value: '',
                            options: [],
                            allowMultiple: false,
                            dummy: '',
                            isVQBtype: false,
                        }
                        newSqlVariables.push(new_variable)
                    }
                }
            }
            return newSqlVariables
        }
        return sqlVariables.value
    }

    function addVariableFromVQB(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        subpanelInfo: {
            vqbPanelId: string
            subpanelId: string
        }
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }

        const len = activeInlineTab.value.playground.editor.variables.length
        const key = String(new Date().getTime())
        const new_variable: CustomVaribaleInterface = {
            name: `variable${len}`,
            key,
            type: 'string',
            value: '',
            options: [],
            allowMultiple: false,
            dummy: '',
            isVQBtype: true,
            ...subpanelInfo,
        }
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        //check if variable is present in cache
        let index = null
        index =
            activeInlineTab.value.playground.editor.savedVariables.findIndex(
                (variable) => variable.name === new_variable.name
            )
        console.log('index: ', index)
        if (index !== -1) {
            let currIndex =
                activeInlineTab.value.playground.editor.variables.findIndex(
                    (variable) => variable.name === new_variable.name
                )
            if (currIndex !== -1) {
                let variable: CustomVaribaleInterface = {
                    name: `variable${Math.ceil(Math.random() * 100) + len}`,
                    key,
                    type: 'string',
                    value: '',
                    options: [],
                    allowMultiple: false,
                    dummy: '',
                    isVQBtype: false,
                    ...subpanelInfo,
                }
                activeInlineTabCopy.playground.editor.variables = [
                    ...activeInlineTabCopy.playground.editor.variables,
                    variable,
                ]
                activeInlineTabCopy.playground.editor.savedVariables = [
                    ...activeInlineTabCopy.playground.editor.savedVariables,
                    variable,
                ]

                editorInstance.trigger('keyboard', 'type', {
                    text: `{{${variable.name}}}`,
                })
            } else {
                activeInlineTabCopy.playground.editor.variables = [
                    ...activeInlineTabCopy.playground.editor.variables,
                    activeInlineTab.value.playground.editor.savedVariables[
                        index
                    ],
                ]
                editorInstance.trigger('keyboard', 'type', {
                    text: `{{${activeInlineTab.value.playground.editor.savedVariables[index].name}}}`,
                })
            }
        } else {
            activeInlineTabCopy.playground.editor.variables = [
                ...activeInlineTabCopy.playground.editor.variables,
                new_variable,
            ]
            activeInlineTabCopy.playground.editor.savedVariables = [
                ...activeInlineTabCopy.playground.editor.savedVariables,
                new_variable,
            ]
            editorInstance.trigger('keyboard', 'type', {
                text: `{{variable${len}}}`,
            })
        }

        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }

    function getCustomVaribleByVQBFilterSubpanelId(
        subpanelId: string,
        activeInlineTab: ComputedRef<activeInlineTabInterface>
    ) {
        return activeInlineTab.value.playground.editor.variables.find(
            (variable) => variable?.subpanelId === subpanelId
        )
    }
    function addVariableFromEditor(
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        intersection: [],
        newVariables: []
    ) {
        if (!editorInstance && !monacoInstance) {
            console.error(
                'Pass editorInstance & monaco Instance to the useCustomVariable'
            )
            return
        }

        let new_variable: CustomVaribaleInterface
        let key
        let data = []
        let index = null

        newVariables?.forEach((variable) => {
            index =
                activeInlineTab.value.playground.editor.savedVariables.findIndex(
                    (variable1) =>
                        variable1.name === variable.token.slice(2, -2)
                )

            if (index !== -1) {
                data.push(
                    activeInlineTab.value.playground.editor.savedVariables[
                        index
                    ]
                )
            } else {
                key = String(new Date().getTime())
                new_variable = {
                    name: variable.token.slice(2, -2),
                    key,
                    type: 'string',
                    value: '',
                    options: [],
                    allowMultiple: false,
                    dummy: '',
                    isVQBtype: false,
                }
                data.push(new_variable)
            }
        })

        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )

        activeInlineTabCopy.playground.editor.variables = [
            ...intersection,
            ...data,
        ]
        activeInlineTabCopy.playground.editor.savedVariables = [
            ...activeInlineTabCopy.playground.editor.savedVariables,
            ...data,
        ]

        modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
    }

    return {
        getCustomVaribleByVQBFilterSubpanelId,
        addVariableFromVQB,
        deleteVariable,
        isSqlVariablesChanged,
        setSqlVariables,
        addVariable,
        saveVariable,
        addVariableFromEditor,
        editVariable,
    }
}
