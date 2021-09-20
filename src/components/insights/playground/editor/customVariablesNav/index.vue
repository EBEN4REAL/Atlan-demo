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
                    <p class="m-0 ml-2" v-if="sqlVariables.length < 1">
                        Add Variable
                    </p>
                </a-button>
            </div>
            <div
                v-for="variable in sqlVariables"
                :key="variable.formState.key"
                class="flex mx-1 bg-white border rounded variable-wrapper"
            >
                <div class="flex items-center px-2">
                    <a-dropdown
                        v-model:visible="variable.dropDownStatus"
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
                                        :model="variable.formState"
                                        ref="formRef"
                                    >
                                        <a-form-item label="Name" name="name">
                                            <a-input
                                                v-model:value="
                                                    variable.formState.name
                                                "
                                                placeholder="new_variable"
                                            />
                                        </a-form-item>
                                        <a-form-item label="Type" name="type">
                                            <a-select
                                                v-model:value="
                                                    variable.formState.type
                                                "
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
                                                v-model:value="
                                                    variable.formState.value
                                                "
                                                placeholder=""
                                            />
                                        </a-form-item>
                                    </a-form>
                                    <div class="flex justify-between">
                                        <a-button
                                            class="flex items-center justify-between mr-2 "
                                            @click="closeDropdown"
                                        >
                                            Cancel
                                        </a-button>
                                        <a-button
                                            type="primary"
                                            class="flex items-center justify-between ml-2 "
                                            @click="onSaveVariable"
                                        >
                                            Save
                                        </a-button>
                                    </div>
                                </div>
                            </a-menu>
                        </template>
                    </a-dropdown>
                    <p class="mb-0 text-gray-500">
                        {{ variable.formState.name }}
                    </p>
                </div>
                <div
                    class="flex items-center justify-center h-full px-2 text-white rounded-tr rounded-br  bg-primary"
                >
                    <p
                        class="mb-0 truncate variable-value"
                        :class="
                            variable.formState.value === '' ? 'mr-4' : 'mr-0'
                        "
                    >
                        {{ variable.formState.value }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, ref, toRaw } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { editor } from 'monaco-editor'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const editorInstance = inject(
                'editorInstance'
            ) as Ref<editor.IStandaloneCodeEditor>
            const monacoInstance = inject('monacoInstance') as Ref<any>
            const currentSelectedVariable = ref(null)
            const sqlVariables = ref([
                {
                    formState: {
                        name: 'sales',
                        key: 'sales',
                        type: 'string',
                        value: 'WEB_SALES',
                    },
                    dropDownStatus: false,
                },
                // {
                //   formState: {
                //     name: "quantity",
                //     key: "quantity",
                //     type: "number",
                //     value: "100",
                //   },
                //   dropDownStatus: false,
                // },
            ])

            const addVariable = () => {
                const currentVariablesLength = sqlVariables.value.length
                const samlple_add_variable_obj = {
                    formState: {
                        name: `variable${currentVariablesLength}`,
                        key: `variable${currentVariablesLength}`,
                        type: 'string',
                        value: '',
                    },
                    dropDownStatus: false,
                }
                sqlVariables.value.push(samlple_add_variable_obj)
                // const lineCount = editorInstance.value
                //     .getModel()
                //     ?.getLineCount()
                const lastLineLength = editorInstance.value
                    .getModel()
                    ?.getLineMaxColumn(1)

                // const range = new monacoInstance.value.Range(
                //     lineCount,
                //     lastLineLength,
                //     lineCount,
                //     lastLineLength
                // )
                // console.log(lineCount, editorInstance.value.trigger)

                // editorInstance.value &&
                //     editorInstance.value.executeEdits('', [
                //         {
                //             range: range,
                //             text: ` {{variable${currentVariablesLength}}}`,
                //         },
                //     ])
                // console.log(lastLineLength)
                // editorInstance.value &&
                //     editorInstance.value.trigger('keyboard', 'type', {
                //         text: ` {{variable${currentVariablesLength}}}`,
                //     })
            }

            const openDropdown = (variable: any) => {
                const { name, key, type, value } = toRaw(variable.formState)
                currentSelectedVariable.value = { name, key, type, value }
                let currentSelectedVaribleIndex = sqlVariables.value.findIndex(
                    (variable) =>
                        variable.formState.key ===
                        currentSelectedVariable.value.key
                )
                sqlVariables.value[currentSelectedVaribleIndex].dropDownStatus =
                    true
                console.log(sqlVariables.value[currentSelectedVaribleIndex])
            }
            const deleteVariableFromEditor = (str, regex, updatedName) => {
                let updatedString = str.replace(regex, `${updatedName}`)
                console.log(updatedString, updatedName, regex)
                editorInstance.value.getModel().setValue(updatedString)
            }

            const deleteVariable = (variable) => {
                let currentSelectedVaribleIndex = sqlVariables.value.findIndex(
                    (variablex) =>
                        variablex.formState.key === variable.formState.key
                )
                variable.dropDownStatus = false
                const editorQuery = editorInstance.value.getValue()
                console.log(variable)
                const oldVariableName = variable.formState.name
                let reg = new RegExp(`{{${oldVariableName}}}`, 'g')
                deleteVariableFromEditor(editorQuery, reg, '')
                sqlVariables.value.splice(currentSelectedVaribleIndex, 1)
            }

            const closeDropdown = () => {
                let currentSelectedVaribleIndex = sqlVariables.value.findIndex(
                    (variable) =>
                        variable.formState.key ===
                        currentSelectedVariable.value.key
                )
                sqlVariables.value[currentSelectedVaribleIndex].formState.name =
                    currentSelectedVariable.value.name
                sqlVariables.value[currentSelectedVaribleIndex].dropDownStatus =
                    false
            }

            const replaceStringUsingRegex = (str, regex, updatedName) => {
                let updatedString = str.replace(regex, `{{${updatedName}}}`)
                console.log(updatedString, updatedName, regex)
                editorInstance.value.getModel().setValue(updatedString)
            }

            const onSaveVariable = () => {
                let currentSelectedVaribleIndex = sqlVariables.value.findIndex(
                    (variable) =>
                        variable.formState.key ===
                        currentSelectedVariable.value.key
                )
                const oldVariableName = currentSelectedVariable.value.name
                console.log(oldVariableName, 'oldname')
                let reg = new RegExp(`{{${oldVariableName}}}`, 'g')
                const editorQuery = editorInstance.value.getValue()
                let updatedName =
                    sqlVariables.value[currentSelectedVaribleIndex].formState
                        .name
                replaceStringUsingRegex(editorQuery, reg, updatedName)
                console.log(
                    sqlVariables.value[currentSelectedVaribleIndex].formState
                        .type,
                    'type'
                )
                if (
                    sqlVariables.value[currentSelectedVaribleIndex].formState
                        .type === 'number'
                ) {
                    sqlVariables.value[
                        currentSelectedVaribleIndex
                    ].formState.value = Number(
                        sqlVariables.value[currentSelectedVaribleIndex]
                            .formState.value
                    )
                }
                console.log(
                    sqlVariables.value[currentSelectedVaribleIndex].formState
                )
                sqlVariables.value[currentSelectedVaribleIndex].dropDownStatus =
                    false
            }

            return {
                onSaveVariable,
                sqlVariables,
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
