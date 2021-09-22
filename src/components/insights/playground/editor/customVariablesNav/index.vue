<template>
    <div class="my-2">
        <div class="flex py-2 mb-2 overflow-x-auto">
            <div class="add-variable-btn">
                <a-button
                    class="flex items-center justify-between mr-2"
                    @click="addVariable"
                >
                    <span class="flex items-center justify-center">
                        <fa icon="fal plus" class="" />
                    </span>
                    <p
                        class="m-0 ml-2"
                        v-if="sqlVariables && sqlVariables?.length == 0"
                    >
                        Add Variable
                    </p>
                </a-button>
            </div>
            <div
                v-for="variable in sqlVariables"
                :key="variable.key"
                class="flex mx-1 bg-white border rounded variable-wrapper"
            >
                <div class="flex items-center px-2">
                    <a-dropdown
                        :visible="customVariableOpenKey === variable.key"
                        :trigger="['click']"
                    >
                        <span
                            class="flex items-center justify-center mr-2 cursor-pointer  hover:text-primary-600"
                            @click="() => openDropdown(variable)"
                        >
                            <fa icon="fal cog" class="" />
                        </span>
                        <template #overlay>
                            <a-menu>
                                <div class="px-4 py-2">
                                    <span
                                        class="absolute right-0 flex items-center justify-center mr-2 cursor-pointer  hover:text-primary-600"
                                        @click="() => deleteVariable(variable)"
                                    >
                                        <fa icon="fal trash-alt" class="" />
                                    </span>
                                    <a-form
                                        layout="vertical"
                                        :model="variable"
                                        ref="formRef"
                                    >
                                        <a-form-item label="Name" name="name">
                                            <a-input
                                                v-model:value="variable.name"
                                                placeholder="new_variable"
                                            />
                                        </a-form-item>
                                        <a-form-item label="Type" name="type">
                                            <a-select
                                                v-model:value="variable.type"
                                            >
                                                <a-select-option value="string"
                                                    >STRING</a-select-option
                                                >
                                                <a-select-option value="number"
                                                    >NUMBER</a-select-option
                                                >
                                                <a-select-option value="boolean"
                                                    >BOOLEAN</a-select-option
                                                >
                                                <a-select-option value="query"
                                                    >QUERY</a-select-option
                                                >
                                            </a-select>
                                        </a-form-item>
                                        <!-- <a-form-item
                                            label="Saved Queries"
                                            name="saved_queries"
                                            v-if="
                                                variable.formState.type ===
                                                'query'
                                            "
                                        >
                                            <a-select
                                                v-model:value="
                                                    savedQuery[0].name
                                                "
                                            >
                                                <a-select-option
                                                    :key="option.name"
                                                    v-for="option in savedQuery"
                                                    :value="option.name"
                                                    >{{
                                                        option.value
                                                    }}</a-select-option
                                                >
                                            </a-select>
                                        </a-form-item> -->
                                        <a-form-item
                                            label="Default Value"
                                            name="value"
                                        >
                                            <a-input
                                                v-model:value="variable.value"
                                                placeholder=""
                                            />
                                        </a-form-item>
                                    </a-form>
                                    <div class="flex justify-between">
                                        <a-button
                                            class="flex items-center justify-between mr-2 "
                                            @click="() => cancelEdit(variable)"
                                        >
                                            Cancel
                                        </a-button>
                                        <a-button
                                            type="primary"
                                            class="flex items-center justify-between ml-2 "
                                            @click="
                                                () => onSaveVariable(variable)
                                            "
                                        >
                                            Save
                                        </a-button>
                                    </div>
                                </div>
                            </a-menu>
                        </template>
                    </a-dropdown>
                    <p class="mb-0 text-gray-500">
                        {{ variable.name }}
                    </p>
                </div>
                <div
                    class="flex items-center justify-center h-full px-2 text-white rounded-tr rounded-br  bg-primary"
                >
                    <p
                        class="mb-0 truncate variable-value"
                        :class="variable.value === '' ? 'mr-4' : 'mr-0'"
                    >
                        {{ variable.value }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        ref,
        toRaw,
        ComputedRef,
        watch,
        computed,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useEditor } from '~/components/insights/playground/common/composables/useEditor'
    import { editor } from 'monaco-editor'
    import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<editor.IStandaloneCodeEditor>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const editorInstance = toRaw(editorInstanceRef.value)
            const monacoInstance = toRaw(monacoInstanceRef.value)

            const { modifyEditorContent } = useEditor(tabs, activeInlineTab)
            const { modifyActiveInlineTabEditor } = useInlineTab()

            const currVariable: Ref<CustomVaribaleInterface | undefined> = ref()
            const customVariableOpenKey: Ref<string | undefined> =
                ref(undefined)
            const sqlVariables: Ref<CustomVaribaleInterface[]> = ref()
            watch(
                [activeInlineTabKey],
                () => {
                    if (activeInlineTabKey.value) {
                        sqlVariables.value = JSON.parse(
                            JSON.stringify(
                                toRaw(activeInlineTab.value).playground.editor
                                    .variables
                            )
                        )

                        console.log(sqlVariables.value, 'watch')
                    }
                },
                {
                    immediate: true,
                }
            )
            const closeDropdown = () => {
                customVariableOpenKey.value = undefined
                currVariable.value = undefined
            }
            const cancelEdit = (variable: CustomVaribaleInterface) => {
                customVariableOpenKey.value = undefined
                currVariable.value = undefined
            }
            const addVariable = () => {
                const len = sqlVariables.value.length
                const key = String(new Date().getTime())
                const new_variable: CustomVaribaleInterface = {
                    name: `variable${len}`,
                    key,
                    type: 'string',
                    value: '',
                }
                sqlVariables.value.push(new_variable)
                const currText = editorInstance?.getValue()
                const text = `${currText} {{variable${len}}}`
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                activeInlineTabCopy.playground.editor.variables = JSON.parse(
                    JSON.stringify(
                        toRaw(activeInlineTab.value).playground.editor.variables
                    )
                )
                activeInlineTabCopy.playground.editor.text = text
                console.log(activeInlineTabCopy, 'copy')
                modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
                modifyEditorContent(editorInstance, monacoInstance, text)
                closeDropdown()
            }

            const openDropdown = (variable: CustomVaribaleInterface) => {
                customVariableOpenKey.value = variable.key
                currVariable.value = { ...variable }
            }

            const deleteVariableFromEditor = (str, regex, updatedName, key) => {
                let updatedString = str.replace(regex, `${updatedName}`)
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                activeInlineTabCopy.playground.editor.text = updatedString
                const variables =
                    activeInlineTabCopy.playground.editor.variables.filter(
                        (x) => x.key !== key
                    )
                sqlVariables.value = variables
                activeInlineTabCopy.playground.editor.variables = variables
                activeInlineTabCopy.playground.editor.text = updatedString
                modifyEditorContent(
                    editorInstance,
                    monacoInstance,
                    updatedString
                )
                modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
            }

            const deleteVariable = (variable: CustomVaribaleInterface) => {
                const editorQuery = editorInstance.getValue()
                const oldVariableName = variable.name
                const key: string = variable.key
                let reg = new RegExp(`{{${oldVariableName}}}`, 'g')
                deleteVariableFromEditor(editorQuery, reg, '', key)
                closeDropdown()
            }

            const replaceStringUsingRegex = (str, regex, updatedName) => {
                let updatedString = str.replace(regex, `{{${updatedName}}}`)
                modifyEditorContent(
                    editorInstance,
                    monacoInstance,
                    updatedString
                )
            }

            const onSaveVariable = (variable: CustomVaribaleInterface) => {
                const index = sqlVariables.value.findIndex(
                    (v) => v.key === variable.key
                )
                console.log(
                    index,
                    currVariable,
                    variable?.name,
                    activeInlineTab.value.playground.editor.variables
                )
                const oldVariableName = currVariable.value.name
                let reg = new RegExp(`{{${oldVariableName}}}`, 'g')
                const editorQuery = editorInstance.getValue()
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                activeInlineTabCopy.playground.editor.variables = toRaw(
                    sqlVariables.value
                )

                replaceStringUsingRegex(editorQuery, reg, variable.name)
                modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
                closeDropdown()
            }

            return {
                cancelEdit,
                customVariableOpenKey,
                onSaveVariable,
                sqlVariables,
                currVariable,
                activeInlineTab,
                openDropdown,
                addVariable,
                deleteVariable,
                closeDropdown,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
