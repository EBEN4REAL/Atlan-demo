<template>
    <div class="my-2 mb-4">
        <div class="flex overflow-x-auto">
            <div class="add-variable-btn">
                <a-button
                    class="flex items-center justify-between mr-2 py-0.5 px-2"
                    @click="onAddVariable"
                >
                    <span class="flex items-center justify-center">
                        <fa icon="fal plus" class="" />
                    </span>
                    <p
                        class="m-0 ml-1"
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
                                        @click="
                                            () => onDeleteVariable(variable)
                                        "
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
                    <p class="mb-0 text-gray-500 cursor-default">
                        {{ variable.name }}
                    </p>
                </div>
                <div
                    class="flex items-center justify-center h-full px-2 text-white rounded-tr rounded-br  bg-primary"
                >
                    <p
                        class="mb-0 truncate cursor-default variable-value"
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
    import { defineComponent, Ref, inject, ref, toRaw, ComputedRef } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { editor } from 'monaco-editor'
    import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'

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

            return {
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
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
