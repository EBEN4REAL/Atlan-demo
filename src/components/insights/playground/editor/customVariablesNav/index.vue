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
                                activeInlineTab.playground.editor.variables &&
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
                :key="`${variable.key}`"
                class="flex flex-col mx-1 my-3"
            >
                <p
                    class="mb-0.5 text-sm text-gray-700 bg-gray-100 cursor-default"
                >
                    {{ variable.name }}
                </p>

                <div
                    class="relative flex items-center pr-1 bg-white rounded group border-container"
                    style="width: 162px; height: 34px !important"
                >
                    <div v-if="variable.type === 'dropdown'">
                        <a-dropdown
                            :trigger="['click']"
                            :visible="dropdownVisibleKey === variable.key"
                        >
                            <a-button
                                @click="() => openSelectDropdown(variable)"
                                class="flex items-center justify-between bg-white border-none shadow-none outline-none"
                                style="width: 138px; height: 32px"
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
                                        <div
                                            class="flex flex-col w-full"
                                            @change="
                                                () => {
                                                    onCheckAllOptions(variable)
                                                    onChange(variable)
                                                }
                                            "
                                        >
                                            <a-checkbox
                                                v-model:checked="checkAll"
                                                class="w-full px-4 py-2"
                                            >
                                                Select all
                                            </a-checkbox>
                                        </div>

                                        <div class="checkbox-border"></div>

                                        <a-checkbox-group
                                            v-model:value="variable.value"
                                            @change="
                                                (checked) => {
                                                    checkedGroup(
                                                        checked,
                                                        variable
                                                    )
                                                    onChange(variable)
                                                }
                                            "
                                        >
                                            <div
                                                v-for="item in variable.options"
                                                :key="item.label"
                                                class="flex items-center justify-between px-4 pt-2 pb-2"
                                            >
                                                <a-checkbox :value="item.value"
                                                    ><span
                                                        class="w-full h-8 mb-0 ml-1"
                                                    >
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
                                            @select="onChange(variable)"
                                        >
                                            <div
                                                v-for="item in variable.options"
                                                :key="item.label"
                                            >
                                                <a-menu-item
                                                    class="px-4 hover:bg-gray-100"
                                                    :key="item.value"
                                                >
                                                    <div
                                                        class="flex items-center justify-between"
                                                    >
                                                        <span>{{
                                                            item.label
                                                        }}</span>
                                                        <!-- <AtlanIcon
                                                            icon="Check"
                                                            class="text-primary"
                                                            v-if="
                                                                variable.value
                                                                    .length &&
                                                                variable
                                                                    .value[0] ===
                                                                    item.value
                                                            "
                                                        /> -->
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
                    <a-date-picker
                        v-else-if="variable.type === 'date'"
                        placeholder="Select Date"
                        :class="$style.date_picker"
                        :show-time="{ format: 'HH:mm' }"
                        v-model:value="variable.value"
                        @change="onChange(variable)"
                        :bordered="false"
                        style="padding-right: 0 !important; max-width: 127px"
                        class="truncate border-0 focus:border-0 focus:outline-none"
                        :allowClear="false"
                    >
                        <template #suffixIcon></template>
                    </a-date-picker>
                    <a-input
                        v-else
                        class="border-none outline-none outline-0 group focus:outline-0 focus:border-none focus:shadow-none"
                        style="width: 138px; height: 32px"
                        v-model:value="variable.value"
                        @change="onChange(variable)"
                        :placeholder="`Enter a ${variable.type}`"
                        :type="variable.type === 'number' ? 'number' : 'text'"
                    />
                    <!-- {{ variable.value }} -->

                    <!-- <template #suffix> -->
                    <a-dropdown
                        :visible="customVariableOpenKey === variable.key"
                        :trigger="['click']"
                    >
                        <div
                            class="absolute right-0 z-10 p-1 px-1.5 rounded opacity-0 group-hover:opacity-100"
                        >
                            <span
                                @click="() => openDropdown(variable)"
                                class="p-1 rounded cursor-pointer hover:bg-gray-light"
                            >
                                <AtlanIcon
                                    class="w-4 h-4 text-gray-500 mb-0.5"
                                    icon="Settings"
                                />
                            </span>
                        </div>
                        <template #overlay>
                            <a-menu :key="variable.key">
                                <!-- {{ activeVariable }} -->
                                <div class="p-4" style="width: 240px">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <span class="font-bold text-gray-700"
                                            >Edit</span
                                        >
                                        <div class="flex items-center">
                                            <a-tooltip
                                                placement="bottom"
                                                color="#363636"
                                            >
                                                <template #title>Copy</template>
                                                <AtlanIcon
                                                    @click="
                                                        () =>
                                                            onCopyVariable(
                                                                activeVariable
                                                            )
                                                    "
                                                    class="w-4 h-4 mr-4 text-gray-500 cursor-pointer"
                                                    icon="CopyOutlined"
                                                />
                                            </a-tooltip>

                                            <a-tooltip
                                                placement="bottom"
                                                color="#363636"
                                            >
                                                <template #title
                                                    >Delete</template
                                                >
                                                <AtlanIcon
                                                    @click="
                                                        () =>
                                                            onDeleteVariable(
                                                                activeVariable
                                                            )
                                                    "
                                                    class="w-4 h-4 text-gray-500 cursor-pointer"
                                                    icon="Delete"
                                                />
                                            </a-tooltip>
                                        </div>
                                    </div>
                                    <div class>
                                        <a-form
                                            layout="vertical"
                                            :model="activeVariable"
                                            ref="formRef"
                                        >
                                            <a-form-item
                                                label="Name"
                                                class="mb-4 text-gray-700 tex-sm"
                                                name="name"
                                            >
                                                <a-input
                                                    v-model:value="
                                                        activeVariable.name
                                                    "
                                                    placeholder="Name"
                                                    :class="
                                                        inputError
                                                            ? `border-red-300`
                                                            : ``
                                                    "
                                                />
                                            </a-form-item>

                                            <a-form-item
                                                label="Type"
                                                class="mb-4 text-gray-700 tex-sm"
                                                name="type"
                                            >
                                                <a-select
                                                    v-model:value="
                                                        activeVariable.type
                                                    "
                                                    @change="
                                                        () => {
                                                            handleVariableTypeChange()
                                                        }
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
                                                        value="date"
                                                        >Date</a-select-option
                                                    >
                                                    <a-select-option
                                                        value="dropdown"
                                                        >Dropdown</a-select-option
                                                    >
                                                </a-select>
                                            </a-form-item>

                                            <a-form-item
                                                :label="
                                                    activeVariable?.type ===
                                                    `dropdown`
                                                        ? 'Dropdown values'
                                                        : 'Default value'
                                                "
                                                class="text-gray-700 tex-sm"
                                                name="value"
                                            >
                                                {{ activeVariable.value }}
                                                <a-date-picker
                                                    v-if="
                                                        activeVariable.type ===
                                                        'date'
                                                    "
                                                    placeholder="Select Date"
                                                    :show-time="{
                                                        format: 'HH:mm',
                                                    }"
                                                    v-model:value="
                                                        activeVariable.value
                                                    "
                                                    class="w-full border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
                                                />

                                                <a-select
                                                    v-model:value="
                                                        activeVariable.dummy
                                                    "
                                                    v-else-if="
                                                        activeVariable.type ===
                                                        `dropdown`
                                                    "
                                                    mode="tags"
                                                    style="width: 100%"
                                                    :token-separators="[',']"
                                                    placeholder="Enter to add values"
                                                    @change="
                                                        () => {
                                                            handleSelectInputChange(
                                                                activeVariable
                                                            )
                                                        }
                                                    "
                                                    :options="
                                                        activeVariable.options
                                                    "
                                                    :dropdownStyle="{
                                                        visibility: 'hidden',
                                                    }"
                                                >
                                                    <!-- <template
                                                        #dropdownRender
                                                    ></template> -->
                                                </a-select>

                                                <a-input
                                                    v-else
                                                    v-model:value="
                                                        activeVariable.value
                                                    "
                                                    :placeholder="`Enter a value`"
                                                    :type="
                                                        activeVariable.type ===
                                                        'number'
                                                            ? 'number'
                                                            : 'text'
                                                    "
                                                />
                                            </a-form-item>

                                            <a-form-item
                                                v-if="
                                                    activeVariable.type ===
                                                    `dropdown`
                                                "
                                                class="mb-2 -mt-4"
                                            >
                                                <a-checkbox
                                                    :class="
                                                        $style.checkbox_style
                                                    "
                                                    v-model:checked="
                                                        activeVariable.allowMultiple
                                                    "
                                                    @change="
                                                        () => {
                                                            onChangeAllowMultiple()
                                                        }
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
                                        <div class="flex justify-between">
                                            <AtlanBtn
                                                size="sm"
                                                color="secondary"
                                                padding="compact"
                                                class="flex items-center justify-center mr-2 text-gray-700 transition duration-150 border rounded hover:text-primary"
                                                style="width: 60px"
                                                @click="cancelEdit"
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
                                                @click="onSaveVariable"
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
    import dayjs from 'dayjs'

    export default defineComponent({
        components: {
            AtlanBtn,
        },
        props: {},
        setup(props) {
            const dateFormat = 'YYYY-MM-DD HH:mm:ss'
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            // let variableList = computed(() => {
            //     return activeInlineTab.value.playground.editor.variables
            // })

            let variableList = ref()

            let activeVariable = ref()

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

            // const customVariableSelectKey: Ref<string | undefined> =
            //     ref(undefined)

            const varTest = /^[a-zA-Z0-9_]+$/
            let inputError = ref(false)

            const closeDropdown = () => {
                customVariableOpenKey.value = undefined
                currVariable.value = undefined
                inputError.value = false
            }

            const cancelEdit = () => {
                // if (variable.type === 'dropdown') {
                //     variable.value = [variable.options[0].value]
                // }
                saveVariable(
                    activeInlineTab,
                    tabs,
                    currVariable.value,
                    currVariable
                )
                customVariableOpenKey.value = undefined
                // activeVariable.value = null

                currVariable.value = undefined
                inputError.value = false
            }
            const onAddVariable = () => {
                // addVariable(activeInlineTab, tabs, sqlVariables)
                closeDropdown()
                addVariable(activeInlineTab, tabs)
            }

            const openDropdown = (variable: CustomVaribaleInterface) => {
                customVariableOpenKey.value = variable.key
                activeVariable.value = { ...variable } // track the new variable
                currVariable.value = { ...variable }
                if (varTest.test(variable.name)) {
                    inputError.value = false
                } else {
                    inputError.value = true
                }
            }

            const onDeleteVariable = (variable: CustomVaribaleInterface) => {
                deleteVariable(activeInlineTab, tabs, variable)
                // activeVariable.value = null
                closeDropdown()
            }

            const onSaveVariable = () => {
                if (varTest.test(activeVariable.value.name)) {
                    if (
                        saveVariable(
                            activeInlineTab,
                            tabs,
                            activeVariable.value,
                            currVariable
                        )
                    ) {
                        /* If successfully variable saved then close the dropdown */
                        checkAll.value = false
                        inputError.value = false

                        // if (variable.type === 'dropdown') {
                        //     variable.value = [variable.options[0].value]
                        // }
                        // activeVariable.value = null
                        closeDropdown()
                    }
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
                console.log('var: ', variable)
                editVariable(activeInlineTab, tabs, variable)
            }

            const onChangeAllowMultiple = () => {
                if (
                    Array.isArray(activeVariable.value.value) &&
                    activeVariable.value.value.length > 1
                ) {
                    activeVariable.value.value = [activeVariable.value.value[0]]
                }
            }

            const handleSelectInputChange = (
                variable: CustomVaribaleInterface
            ) => {
                if (variable.dummy.length) {
                    variable.value = [variable.dummy[variable.dummy.length - 1]]
                }

                variable.options = variable.dummy.map((v) => {
                    return {
                        value: v,
                        label: v,
                    }
                })
            }

            const handleSelectDateChange = (event, variable) => {
                variable.value = dayjs(event)
            }

            const handleVariableTypeChange = () => {
                if (activeVariable.value.type === 'dropdown') {
                    activeVariable.value.value = []
                    activeVariable.value.dummy = []
                } else if (activeVariable.value.type === 'date') {
                    activeVariable.value.value = dayjs()
                } else if (activeVariable.value.type === 'string') {
                    activeVariable.value.value = ''
                    activeVariable.value.dummy = ''
                    activeVariable.value.allowMultiple = false
                } else {
                    activeVariable.value.value = 0
                    activeVariable.value.dummy = 0
                    activeVariable.value.allowMultiple = false
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

            // const allChecked = computed(() => {})
            const checkedGroup = (checked, variable) => {
                if (variable.value.length !== variable.options.length) {
                    checkAll.value = false
                }
            }

            return {
                onChange,
                onCopyVariable,
                onDeleteVariable,
                cancelEdit,
                customVariableOpenKey,
                // customVariableSelectKey,
                onSaveVariable,
                // sqlVariables,
                currVariable,
                activeInlineTab,
                openDropdown,
                onAddVariable,
                deleteVariable,
                closeDropdown,
                // checkInput,
                inputError,
                handleSelectInputChange,
                handleSelectDateChange,
                handleVariableTypeChange,
                handleSelectChange,
                dropdownVisibleKey,
                openSelectDropdown,
                closeSelectDropdown,
                onCheckAllOptions,
                checkAll,
                checkedGroup,
                variableList,
                onChangeAllowMultiple,
                activeVariable,
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

    // .item_style {
    //     :global(.ant-form-item) {
    //         margin-bottom: 0px !important;
    //     }
    // }

    .input_style {
        @apply relative !important;
    }
    .date_picker {
        padding-right: 2px !important;
        width: 100%;
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
