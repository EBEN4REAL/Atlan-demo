<template>
    <div class="mb-3 bg-gray-100">
        <div class="flex items-end overflow-x-auto">
            <div class="add-variable-btn">
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="flex items-center justify-between px-0 mx-3 my-3  add-btn group"
                    @click="onAddVariable"
                    style="min-width: 30px; height: 30px"
                >
                    <div
                        class="flex items-center px-2 text-gray-700 transition duration-150 rounded  group-hover:text-primary"
                    >
                        <AtlanIcon icon="Add"></AtlanIcon>
                        <p
                            class="m-0 ml-1"
                            v-if="sqlVariables && sqlVariables?.length == 0"
                        >
                            Add variable
                        </p>
                    </div>
                </AtlanBtn>
            </div>
            <div
                v-if="sqlVariables?.length === 0"
                class="flex items-center mb-1 ml-2"
            >
                <!-- <span class="flex items-center justify-center text-gray-500">
                    <fa icon="fal bolt" class="text-base" />
                </span>-->
                <AtlanIcon class="w-4 h-4 text-gray-500" icon="Flash" />
                <p class="text-sm text-gray-500 ml-0.5 my-3 mx-3 pb-0.5">
                    Create variables to make values interactive.
                    <span class="underline cursor-pointer text-primary"
                        >Learn more</span
                    >
                </p>
            </div>
            <div
                v-else
                v-for="(variable, i) in activeInlineTab.playground.editor
                    .variables"
                :key="`${variable.key + i}`"
                class="flex flex-col mx-1 my-3"
            >
                <p
                    class="
                        mb-0.5
                        text-sm text-gray-700
                        bg-gray-100
                        cursor-default
                    "
                >
                    {{ variable.name }}
                </p>

                <a-input
                    class="h-8 group"
                    style="width: 158px"
                    v-model:value="variable.value"
                    @change="onChange(variable)"
                    :placeholder="`Enter a ${variable.type}`"
                >
                    <template #suffix>
                        <a-dropdown
                            :visible="customVariableOpenKey === variable.key"
                            :trigger="['click']"
                        >
                            <div class="p-1 rounded hover:bg-gray-100">
                                <AtlanIcon
                                    @click="() => openDropdown(variable)"
                                    class="w-4 h-4 text-gray-500 opacity-0 cursor-pointer  group-hover:opacity-100"
                                    icon="Settings"
                                />
                            </div>
                            <template #overlay>
                                <a-menu>
                                    <div class="p-4" style="width: 215px">
                                        <div
                                            class="flex items-center justify-between mb-3 "
                                        >
                                            <span
                                                class="font-bold text-gray-700"
                                                >{{ variable.name }}</span
                                            >
                                            <div class="flex items-center">
                                                <AtlanIcon
                                                    @click="
                                                        () =>
                                                            onCopyVariable(
                                                                variable
                                                            )
                                                    "
                                                    class="w-4 h-4 mr-4 text-gray-500 cursor-pointer "
                                                    icon="CopyOutlined"
                                                />
                                                <AtlanIcon
                                                    @click="
                                                        () =>
                                                            onDeleteVariable(
                                                                variable
                                                            )
                                                    "
                                                    class="w-4 h-4 text-gray-500 cursor-pointer "
                                                    icon="Delete"
                                                />
                                            </div>
                                        </div>
                                        <div class>
                                            <a-form
                                                layout="vertical"
                                                :model="variable"
                                                ref="formRef"
                                            >
                                                <a-form-item
                                                    label="Variable name"
                                                    class="mb-4 text-gray-700  tex-sm"
                                                    name="name"
                                                >
                                                    <a-input
                                                        v-model:value="
                                                            variable.name
                                                        "
                                                        placeholder="new_variable"
                                                        :class="
                                                            inputError
                                                                ? `border-red-300`
                                                                : ``
                                                        "
                                                    />
                                                </a-form-item>
                                                <a-form-item
                                                    label="Variable type"
                                                    class="mb-4 text-gray-700  tex-sm"
                                                    name="type"
                                                >
                                                    <a-select
                                                        v-model:value="
                                                            variable.type
                                                        "
                                                    >
                                                        <a-select-option
                                                            value="string"
                                                            >String</a-select-option
                                                        >
                                                        <a-select-option
                                                            value="number"
                                                            >Number</a-select-option
                                                        >
                                                        <a-select-option
                                                            value="boolean"
                                                            >Boolean</a-select-option
                                                        >
                                                        <!-- <a-select-option
                                                            value="query"
                                                            >QUERY</a-select-option
                                                        >-->
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
                                                </a-form-item>-->
                                                <a-form-item
                                                    label="Default value"
                                                    class="text-gray-700 tex-sm"
                                                    name="value"
                                                >
                                                    <a-input
                                                        v-model:value="
                                                            variable.value
                                                        "
                                                        placeholder
                                                    />
                                                </a-form-item>
                                            </a-form>
                                            <div
                                                class="flex justify-between mt-6 "
                                            >
                                                <AtlanBtn
                                                    size="sm"
                                                    color="secondary"
                                                    padding="compact"
                                                    class="flex items-center justify-center mr-2 text-gray-700 transition duration-150 border rounded  hover:text-primary"
                                                    style="width: 60px"
                                                    @click="
                                                        () =>
                                                            cancelEdit(variable)
                                                    "
                                                >
                                                    <div
                                                        class="flex items-center "
                                                    >
                                                        <p>Cancel</p>
                                                    </div>
                                                </AtlanBtn>

                                                <AtlanBtn
                                                    size="sm"
                                                    color="primary"
                                                    padding="compact"
                                                    class="flex items-center justify-center rounded "
                                                    style="width: 60px"
                                                    @click="
                                                        () =>
                                                            onSaveVariable(
                                                                variable
                                                            )
                                                    "
                                                >
                                                    <div
                                                        class="flex items-center "
                                                    >
                                                        <p>Save</p>
                                                    </div>
                                                </AtlanBtn>
                                            </div>
                                        </div>
                                    </div>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </template>
                </a-input>
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
        watch,
        toRaw,
        ComputedRef,
        computed,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import { editor } from 'monaco-editor'
    import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        components: {
            AtlanBtn,
        },
        props: {},
        setup(props) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>
            const sqlVariables: Ref<CustomVaribaleInterface[]> = ref([])
            watch(
                [activeInlineTabKey],
                () => {
                    console.log('custom var input')

                    if (activeInlineTabKey.value) {
                        sqlVariables.value =
                            activeInlineTab.value.playground.editor.variables
                    }
                },
                { immediate: true }
            )
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<editor.IStandaloneCodeEditor>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const editorInstance = toRaw(editorInstanceRef.value)
            const monacoInstance = toRaw(monacoInstanceRef.value)

            const { saveVariable, addVariable, deleteVariable, editVariable } =
                useCustomVariable(editorInstance, monacoInstance)

            const currVariable: Ref<CustomVaribaleInterface | undefined> = ref()
            const customVariableOpenKey: Ref<string | undefined> =
                ref(undefined)

            const varTest = /^[a-zA-Z0-9_]+$/
            let inputError = ref(false)

            const closeDropdown = () => {
                customVariableOpenKey.value = undefined
                currVariable.value = undefined
                inputError.value = false
            }
            const cancelEdit = (variable: CustomVaribaleInterface) => {
                const index =
                    activeInlineTab.value.playground.editor.variables.findIndex(
                        (v) => v.key === variable.key
                    )
                activeInlineTab.value.playground.editor.variables[index] =
                    currVariable.value
                customVariableOpenKey.value = undefined
                currVariable.value = undefined
                inputError.value = false
            }
            const onAddVariable = () => {
                // addVariable(activeInlineTab, tabs, sqlVariables)
                addVariable(activeInlineTab, tabs)
                closeDropdown()
            }

            const openDropdown = (variable: CustomVaribaleInterface) => {
                customVariableOpenKey.value = variable.key
                currVariable.value = { ...variable }
                if (varTest.test(variable.name)) {
                    inputError.value = false
                } else {
                    inputError.value = true
                }
            }

            const onDeleteVariable = (variable: CustomVaribaleInterface) => {
                deleteVariable(activeInlineTab, tabs, variable)
                closeDropdown()
            }

            const onSaveVariable = (variable: CustomVaribaleInterface) => {
                // saveVariable(
                //     activeInlineTab,
                //     tabs,
                //     variable,
                //     currVariable,
                //     sqlVariables
                // )
                // console.log('new data: ', variable)
                // console.log('old data: ', currVariable.value)
                if (varTest.test(variable.name)) {
                    inputError.value = false
                    saveVariable(activeInlineTab, tabs, variable, currVariable)
                    closeDropdown()
                } else {
                    inputError.value = true
                }
            }
            const onCopyVariable = (variable: CustomVaribaleInterface) => {
                const variableAsText = `{{${variable.name}}}`
                copyToClipboard(variableAsText)
                message.info({
                    content: 'Copied!',
                })
            }

            const onChange = (variable: CustomVaribaleInterface) => {
                // console.log('variable update: ', variable)
                // console.log(
                //     'all variables: ',
                //     activeInlineTab.value.playground.editor
                // )
                editVariable(activeInlineTab, tabs, variable)
            }

            // const checkInput = ($event) => {
            //     console.log('event obj: ', $event)
            // }

            return {
                onChange,
                onCopyVariable,
                onDeleteVariable,
                cancelEdit,
                customVariableOpenKey,
                onSaveVariable,
                sqlVariables,
                currVariable,
                activeInlineTab,
                openDropdown,
                onAddVariable,
                deleteVariable,
                closeDropdown,
                // checkInput,
                inputError,
            }
        },
    })
</script>
<style lang="less" scoped>
    .btn-shadow {
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
    }
    .text-hover {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .add-btn {
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        background-color: #fff;
        color: rgba(0, 0, 0, 0.85);
    }
</style>

<style lang="less" module>
    .text-primary {
        color: #5277d6;
    }

    .input_style {
        @apply relative !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
