<template>
    <div class="bg-gray-100" style="z-index: 4">
        <div class="flex items-end overflow-x-auto">
            <div class="add-variable-btn">
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="flex items-center justify-between px-0 mx-3 my-3 add-btn group"
                    @click="onAddVariable"
                    style="min-width: 30px; height: 30px"
                >
                    <div
                        class="flex items-center px-2 text-gray-700 transition duration-150 rounded group-hover:text-primary"
                    >
                        <AtlanIcon icon="Add"></AtlanIcon>
                        <p
                            class="m-0 ml-1"
                            v-if="
                                sqlVariables &&
                                activeInlineTab.playground.editor.variables
                                    ?.length == 0
                            "
                        >
                            Add variable
                        </p>
                    </div>
                </AtlanBtn>
            </div>
            <div
                v-if="activeInlineTab.playground.editor.variables?.length === 0"
                class="flex items-center mb-1 ml-2"
            >
                <!-- <span class="flex items-center justify-center text-gray-500">
                    <fa icon="fal bolt" class="text-base" />
                </span>-->
                <AtlanIcon class="w-4 h-4 text-gray-500" icon="Flash" />
                <p class="text-sm text-gray-500 ml-0.5 my-3 mx-3 pb-0.5">
                    Create variables to make values interactive.
                    <!-- <span class="underline cursor-pointer text-primary"
                        >Learn more</span
                    > -->
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
                    class="mb-0.5 text-sm text-gray-700 bg-gray-100 cursor-default"
                >
                    {{ variable.name }}
                </p>

                <div
                    class="relative flex items-center h-8 pr-1 bg-white rounded group border-container"
                    style="width: 162px"
                >
                    <a-input
                        class="border-none group"
                        style="width: 138px; height: 30px"
                        v-model:value="variable.value"
                        @change="onChange(variable)"
                        :placeholder="`Enter a ${variable.type}`"
                        :type="variable.type === 'number' ? 'number' : 'text'"
                        v-if="variable.type !== 'dropdown'"
                    />
                    <div v-else>
                        <a-dropdown
                            :trigger="['click']"
                            :visible="dropdownVisibleKey === variable.key"
                        >
                            <a-button
                                @click="() => openSelectDropdown(variable)"
                                class="flex items-center justify-between bg-white border-none shadow-none"
                                style="width: 138px; height: 30px"
                                ><span class="text-gray-500 truncate">{{
                                    variable.value.length
                                        ? variable.value.join(', ')
                                        : 'Select a value'
                                }}</span>
                            </a-button>
                            <template #overlay>
                                <div
                                    @mouseleave="closeSelectDropdown"
                                    class="z-10 flex flex-col text-gray-700 bg-white rounded shadow"
                                    style="width: 162px"
                                >
                                    <div
                                        v-if="variable.allowMultiple"
                                        class="gap-y-2"
                                    >
                                        <a-checkbox
                                            v-model:checked="checkAll"
                                            @change="
                                                () =>
                                                    onCheckAllOptions(variable)
                                            "
                                            class="px-4 pt-2 pb-2"
                                        >
                                            Check all
                                        </a-checkbox>
                                        <div class="checkbox-border"></div>

                                        <a-checkbox-group
                                            v-model:value="variable.value"
                                        >
                                            <div
                                                v-for="item in variable.options"
                                                :key="item.label"
                                                class="flex items-center justify-between px-4 pt-2 pb-2"
                                            >
                                                <a-checkbox :value="item.value"
                                                    ><span class="mb-0 ml-1">
                                                        {{ item.label }}
                                                    </span>
                                                </a-checkbox>
                                            </div>
                                        </a-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <a-menu
                                            v-model:selectedKeys="
                                                variable.value
                                            "
                                        >
                                            <div
                                                v-for="item in variable.options"
                                                :key="item.label"
                                            >
                                                <a-menu-item
                                                    class="px-4"
                                                    :class="
                                                        variable.value.length &&
                                                        variable.value[0] ===
                                                            item.value
                                                            ? 'bg-primary-light'
                                                            : ''
                                                    "
                                                    :key="item.value"
                                                >
                                                    <div
                                                        class="flex items-center justify-between"
                                                    >
                                                        <span>{{
                                                            item.label
                                                        }}</span>
                                                        <AtlanIcon
                                                            icon="Check"
                                                            class="text-primary"
                                                            v-if="
                                                                variable.value
                                                                    .length &&
                                                                variable
                                                                    .value[0] ===
                                                                    item.value
                                                            "
                                                        />
                                                    </div>
                                                </a-menu-item>

                                                <!-- <a-menu-item :key="item.value">
                                                    {{ item.label }}
                                                </a-menu-item> -->
                                            </div>
                                        </a-menu>
                                    </div>
                                </div>
                            </template>
                        </a-dropdown>
                    </div>
                    <!-- <template #suffix> -->
                    <a-dropdown
                        :visible="customVariableOpenKey === variable.key"
                        :trigger="['click']"
                    >
                        <div
                            class="absolute right-0 z-10 p-1 rounded hover:bg-gray-100"
                        >
                            <AtlanIcon
                                @click="() => openDropdown(variable)"
                                class="w-4 h-4 text-gray-500 cursor-pointer"
                                icon="Settings"
                            />
                        </div>
                        <template #overlay>
                            <a-menu>
                                <div class="p-4" style="width: 215px">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <span class="font-bold text-gray-700">{{
                                            variable.name
                                        }}</span>
                                        <div class="flex items-center">
                                            <AtlanIcon
                                                @click="
                                                    () =>
                                                        onCopyVariable(variable)
                                                "
                                                class="w-4 h-4 mr-4 text-gray-500 cursor-pointer"
                                                icon="CopyOutlined"
                                            />
                                            <AtlanIcon
                                                @click="
                                                    () =>
                                                        onDeleteVariable(
                                                            variable
                                                        )
                                                "
                                                class="w-4 h-4 text-gray-500 cursor-pointer"
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
                                                class="mb-4 text-gray-700 tex-sm"
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
                                                class="mb-4 text-gray-700 tex-sm"
                                                name="type"
                                            >
                                                <a-select
                                                    v-model:value="
                                                        variable.type
                                                    "
                                                    @change="
                                                        handleVariableTypeChange(
                                                            variable
                                                        )
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
                                                    <!-- <a-select-option
                                                            value="boolean"
                                                            >Boolean</a-select-option
                                                        > -->
                                                    <a-select-option
                                                        value="dropdown"
                                                        >Dropdown</a-select-option
                                                    >
                                                </a-select>
                                            </a-form-item>

                                            <a-form-item
                                                :label="
                                                    variable.type === `dropdown`
                                                        ? 'Dropdown values'
                                                        : 'Default value'
                                                "
                                                class="text-gray-700 tex-sm"
                                                name="value"
                                            >
                                                <!-- <a-input
                                                        v-model:value="
                                                            variable.value
                                                        "
                                                        placeholder
                                                    /> -->

                                                <a-select
                                                    v-model:value="
                                                        variable.dummy
                                                    "
                                                    v-if="
                                                        variable.type ===
                                                        `dropdown`
                                                    "
                                                    mode="tags"
                                                    style="width: 100%"
                                                    :token-separators="[',']"
                                                    placeholder="Enter to add values"
                                                    @change="
                                                        handleSelectInputChange(
                                                            variable
                                                        )
                                                    "
                                                    :options="variable.options"
                                                ></a-select>

                                                <a-input
                                                    v-else
                                                    v-model:value="
                                                        variable.value
                                                    "
                                                    :placeholder="`Enter a ${variable.type}`"
                                                    :type="
                                                        variable.type ===
                                                        'number'
                                                            ? 'number'
                                                            : 'text'
                                                    "
                                                />
                                            </a-form-item>

                                            <!-- <a-form-item
                                                    class="text-gray-700 tex-sm"
                                                >
                                                    <a-input
                                                        type="checkbox"
                                                        v-model:value="
                                                            variable.allowMultiple
                                                        "
                                                    />
                                                    Allow multiple values
                                                </a-form-item> -->
                                            <a-form-item
                                                v-if="
                                                    variable.type === `dropdown`
                                                "
                                            >
                                                <a-checkbox
                                                    :class="
                                                        $style.checkbox_style
                                                    "
                                                    v-model:checked="
                                                        variable.allowMultiple
                                                    "
                                                >
                                                    <span
                                                        class="text-sm text-gray-700"
                                                    >
                                                        Allow multiple values
                                                    </span>
                                                </a-checkbox>
                                            </a-form-item>
                                        </a-form>
                                        <div class="flex justify-between mt-6">
                                            <AtlanBtn
                                                size="sm"
                                                color="secondary"
                                                padding="compact"
                                                class="flex items-center justify-center mr-2 text-gray-700 transition duration-150 border rounded hover:text-primary"
                                                style="width: 60px"
                                                @click="
                                                    () => cancelEdit(variable)
                                                "
                                            >
                                                <div class="flex items-center">
                                                    <p>Cancel</p>
                                                </div>
                                            </AtlanBtn>

                                            <AtlanBtn
                                                size="sm"
                                                color="primary"
                                                padding="compact"
                                                class="flex items-center justify-center rounded"
                                                style="width: 60px"
                                                @click="
                                                    () =>
                                                        onSaveVariable(variable)
                                                "
                                            >
                                                <div class="flex items-center">
                                                    <p>Save</p>
                                                </div>
                                            </AtlanBtn>
                                        </div>
                                    </div>
                                </div>
                            </a-menu>
                        </template>
                    </a-dropdown>
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

            const customVariableSelectKey: Ref<string | undefined> =
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
                console.log('select saved: ', variable)
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

            const handleSelectInputChange = (
                variable: CustomVaribaleInterface
            ) => {
                // if (variable.allowMultiple) {
                //     variable.value = variable.options
                // } else {
                //     if (variable.options.length) {
                //         variable.value =
                //             variable.options[variable.options.length - 1]
                //     }
                // }
                if (variable.allowMultiple) {
                    variable.value = variable.dummy
                } else {
                    if (variable.dummy.length) {
                        variable.value = [
                            variable.dummy[variable.dummy.length - 1],
                        ]
                    }
                }

                variable.options = variable.dummy.map((v) => {
                    return {
                        value: v,
                        label: v,
                    }
                })
            }

            const handleVariableTypeChange = (
                variable: CustomVaribaleInterface
            ) => {
                console.log(`selected type: `, variable)
                if (variable.type === 'dropdown') {
                    variable.value = []
                    variable.dummy = []
                } else {
                    variable.value = ''
                    variable.dummy = ''
                    variable.allowMultiple = false
                }
            }

            const dropdownVisibleKey: Ref<string | undefined> = ref(undefined)

            const openSelectDropdown = (variable: CustomVaribaleInterface) => {
                dropdownVisibleKey.value = variable.key
            }

            const closeSelectDropdown = (variable: CustomVaribaleInterface) => {
                dropdownVisibleKey.value = undefined
            }

            const handleSelectChange = (event: any) => {
                console.log('select event: ', event)
            }
            let checkAll = ref(false)

            const onCheckAllOptions = (variable: CustomVaribaleInterface) => {
                if (checkAll.value) {
                    variable.value = variable.options.map((val) => val.value)
                }
            }

            return {
                onChange,
                onCopyVariable,
                onDeleteVariable,
                cancelEdit,
                customVariableOpenKey,
                customVariableSelectKey,
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
                handleSelectInputChange,
                handleVariableTypeChange,
                handleSelectChange,
                dropdownVisibleKey,
                openSelectDropdown,
                closeSelectDropdown,
                onCheckAllOptions,
                checkAll,
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

    .checkbox-border {
        border-bottom: 1px solid #e6e6eb;
    }
    .border-container {
        border: 1px solid #e6e6eb !important;
    }
</style>

<style lang="less" module>
    .text-primary {
        color: #5277d6;
    }

    .checkbox_style {
        :global(.ant-checkbox-inner::after) {
            width: 4px !important;
            height: 7px !important;
        }
        :global(.ant-checkbox-inner) {
            width: 13.5px !important;
            height: 13px !important;
        }
        :global(.ant-checkbox + span) {
            @apply px-1 !important;
        }
    }

    .input_style {
        @apply relative !important;
    }

    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        // margin: 0 !important;
    }
    input[type='number'] {
        -moz-appearance: textfield !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
