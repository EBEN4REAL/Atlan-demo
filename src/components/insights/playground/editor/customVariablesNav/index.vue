<template>
    <div class="px-3 py-3 mb-3 bg-gray-100">
        <div class="flex items-end overflow-x-auto">
            <div class="add-variable-btn">
                <a-button
                    class="flex items-center border-none justify-between py-0.5 px-2 mr-2 btn-shadow add-btn"
                    @click="onAddVariable"
                >
                    <span class="flex items-center justify-center">
                        <fa icon="fal plus" class />
                    </span>
                    <p
                        class="m-0 ml-1"
                        v-if="sqlVariables && sqlVariables?.length == 0"
                    >Add variable</p>
                </a-button>
            </div>
            <div v-if="sqlVariables && sqlVariables.length === 0" class="flex items-center mb-1 ml-2">
                <!-- <span class="flex items-center justify-center text-gray-500">
                    <fa icon="fal bolt" class="text-base" />
                </span> -->
                <AtlanIcon
                    @click=""
                    class="w-4 h-4 text-gray-500"
                    icon="Flash"
                />
                <p class="text-sm text-gray-500 ml-0.5">
                    Create variables to make values interactive.
                    <span
                        class="underline cursor-pointer text-primary"
                        @click=""
                    >Learn</span> ways on how to add interactive variables.
                </p>
            </div>
            <div
                v-else
                v-for="variable in sqlVariables"
                :key="variable.key"
                class="flex flex-col mx-1"
            >
                <p
                    class="mb-0.5 text-sm text-gray-700 bg-gray-100 cursor-default"
                >{{ variable.name }}</p>

                <a-input
                    class="h-8 group"
                    style="width: 158px"
                    v-model:value="variable.value"
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
                                    class="w-4 h-4 text-gray-500 opacity-0 cursor-pointer group-hover:opacity-100"
                                    icon="Settings"
                                />
                            </div>
                            <template #overlay>
                                <a-menu>
                                    <div class="p-4" style="width: 215px">
                                        <div class="flex items-center justify-between mb-3">
                                            <span
                                                class="font-bold text-gray-700"
                                            >{{ variable.name }}</span>
                                            <div class="flex items-center">
                                                <AtlanIcon
                                                    @click="
                                                        () =>
                                                            onCopyVariable(
                                                                variable
                                                            )
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
                                                    >
                                                        <a-select-option value="string">String</a-select-option>
                                                        <a-select-option value="number">Number</a-select-option>
                                                        <a-select-option value="boolean">Boolean</a-select-option>
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
                                            <div class="flex justify-between mt-6">
                                                <a-button
                                                    class="flex items-center justify-center mr-2"
                                                    style="width: 84px"
                                                    @click="
                                                        () =>
                                                            cancelEdit(variable)
                                                    "
                                                >Cancel</a-button>
                                                <a-button
                                                    type="primary"
                                                    class="flex items-center justify-center ml-2"
                                                    style="width: 84px"
                                                    @click="
                                                        () =>
                                                            onSaveVariable(
                                                                variable
                                                            )
                                                    "
                                                >Save</a-button>
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
import { defineComponent, Ref, inject, ref, toRaw, ComputedRef } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { editor } from 'monaco-editor'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
import { copyToClipboard } from '~/utils/clipboard'
import { message } from 'ant-design-vue'

export default defineComponent({
    components: {},
    props: {},
    setup(props) {
        const activeInlineTab = inject(
            'activeInlineTab'
        ) as ComputedRef<activeInlineTabInterface>
        const sqlVariables = inject('sqlVariables') as Ref<
            CustomVaribaleInterface[]
        >
        const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
        const editorInstanceRef = inject(
            'editorInstance'
        ) as Ref<editor.IStandaloneCodeEditor>
        const monacoInstanceRef = inject('monacoInstance') as Ref<any>
        const editorInstance = toRaw(editorInstanceRef.value)
        const monacoInstance = toRaw(monacoInstanceRef.value)

        const { saveVariable, addVariable, deleteVariable } =
            useCustomVariable(editorInstance, monacoInstance)

        const currVariable: Ref<CustomVaribaleInterface | undefined> = ref()
        const customVariableOpenKey: Ref<string | undefined> =
            ref(undefined)

        const closeDropdown = () => {
            customVariableOpenKey.value = undefined
            currVariable.value = undefined
        }
        const cancelEdit = (variable: CustomVaribaleInterface) => {
            const index = sqlVariables.value.findIndex(
                (v) => v.key === variable.key
            )
            sqlVariables.value[index] = currVariable.value
            customVariableOpenKey.value = undefined
            currVariable.value = undefined
        }
        const onAddVariable = () => {
            addVariable(activeInlineTab, tabs, sqlVariables)
            closeDropdown()
        }

        const openDropdown = (variable: CustomVaribaleInterface) => {
            customVariableOpenKey.value = variable.key
            currVariable.value = { ...variable }
        }

        const onDeleteVariable = (variable: CustomVaribaleInterface) => {
            deleteVariable(activeInlineTab, tabs, variable, sqlVariables)
            closeDropdown()
        }

        const onSaveVariable = (variable: CustomVaribaleInterface) => {
            saveVariable(
                activeInlineTab,
                tabs,
                variable,
                currVariable,
                sqlVariables
            )
            closeDropdown()
        }
        const onCopyVariable = (variable: CustomVaribaleInterface) => {
            const variabelAsText = `{{${variable.name}}}`
            copyToClipboard(variabelAsText)
            message.info({
                content: 'Copied!',
            })
        }
        return {
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
    min-width: 32px;
    height: 32px;
}
</style>
<style lang="less" module>
.input_style {
    @apply relative !important;
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
