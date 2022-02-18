<template>
    <div
        class="relative col-span-2 p-4 space-y-4 border border-gray-300 rounded"
    >
        <a-form-item
            class="mb-0 text-gray-500"
            label="Select Option"
            :name="['options', 'enumType']"
        >
            <template #label>
                <!-- <div class="text-gray-500">Select Option x</div> -->
            </template>
            <a-select
                v-model:value="selectedEnum"
                show-search
                no-results-text="No option found"
                placeholder="Select option"
                :options="finalEnumsList"
                :disabled="disable"
                :class="$style.input"
                @change="handleChange"
                @search="handleEnumSearch"
            >
                <template #dropdownRender="{ menuNode: menu }">
                    <VNodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />

                    <p
                        class="px-3 cursor-pointer text-primary"
                        @click="handleCreateEnum"
                    >
                        <AtlanIcon class="inline h-4" icon="Add" />

                        Create new enum
                        <span v-if="enumSearchValue"
                            >"{{ enumSearchValue }}"</span
                        >
                    </p>
                </template>
            </a-select>
        </a-form-item>

        <div v-show="selectedEnumOptions?.length" class="">
            <div class="flex justify-between">
                <div class="mb-2 font-normal font-size-sm">Enum options:</div>
                <template v-if="editAccess">
                    <span
                        v-if="!enumEdit"
                        v-auth="access.UPDATE_ENUM"
                        class="cursor-pointer text-primary hover:underline"
                        @click="handleEditEnum"
                        >Edit</span
                    >

                    <div v-else class="space-x-3">
                        <span
                            v-auth="access.UPDATE_ENUM"
                            class="cursor-pointer hover:underline text-primary"
                            @click="discardEnumEdit"
                            >Cancel</span
                        >
                        <span
                            v-auth="access.UPDATE_ENUM"
                            class="cursor-pointer hover:underline text-primary"
                            @click="saveChanges"
                            >Save</span
                        >
                    </div>
                </template>
            </div>
            <template v-if="enumEdit">
                <MultiInput
                    placeholder='Enter values separated by a  ";" or "↵"'
                    :value="enumValueModel"
                    delimiter=";"
                    @change="(v) => (enumValueModel = v)"
                />
            </template>
            <p v-else>
                <a-tag
                    v-for="(e, x) in selectedEnumOptions"
                    :key="x"
                    class="mb-1 lowercase border-0 rounded-full bg-gray-light"
                    >{{ e.title }}</a-tag
                >
            </p>
        </div>

        <div v-if="createEnum" class="mt-6">
            <CreateEnumForm
                v-if="createEnum"
                ref="newEnumFormRef"
                :enum-search-value="oldEnumSeardValue"
                @success="handleEnumCreateSuccess"
            />
        </div>
        <div
            v-if="createEnumLoading"
            class="absolute top-0 flex items-center justify-center w-full h-full bg-white bg-opacity-40"
        >
            <AtlanLoader class="h-5" />
        </div>
    </div>
</template>

<script lang="ts">
    import { message } from 'ant-design-vue'
    import {
        computed,
        defineComponent,
        ref,
        watch,
        onMounted,
        ComputedRef,
    } from 'vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { refetchTypedef } from '~/composables/typedefs/useTypedefs'
    import { useTypedefStore } from '~/store/typedef'
    import { useUpdateEnums } from '@/governance/enums/composables/useModifyEnums'
    import access from '~/constant/accessControl/map'
    import CreateEnumForm from '@/governance/custom-metadata/propertyDrawer/options/createEnumForm.vue'
    import { isLoading as createEnumLoading } from '@/governance/custom-metadata/propertyDrawer/options/useCreateEnum'
    import MultiInput from '@/common/input/customizedTagInput.vue'
    import EnumDef from '@/governance/enums/enum.interface'
    export default defineComponent({
        components: {
            CreateEnumForm,
            MultiInput,
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            disable: { type: Boolean, required: true },
            editAccess: { type: Boolean, default: true },
        },
        emits: ['change', 'update'],
        setup(_, { emit }) {
            const createEnum = ref<boolean>(false)
            const selectedEnum = ref()

            // enums
            const enumSearchValue = ref('')
            const oldEnumSeardValue = ref('')

            const { enumList }: { enumList: ComputedRef<EnumDef[]> } =
                useTypedefData()

            const enumTypeOtions = ref(null)

            const handleCreateEnum = () => {
                if (!enumSearchValue.value) oldEnumSeardValue.value = ''
                selectedEnum.value = 'New Option'
                createEnum.value = true
                emit('change', 'New Option', [])
            }

            /**
             * @desc list of the options of the selected enum
             * make it function
             */
            const selectedEnumOptions = computed(() => {
                if (selectedEnum.value) {
                    const reqIndex = enumList.value?.findIndex(
                        (item) => item.name === selectedEnum.value
                    )
                    if (
                        reqIndex > -1 &&
                        enumList.value[reqIndex]?.elementDefs &&
                        enumList.value[reqIndex]?.elementDefs.length
                    ) {
                        return enumList.value[reqIndex]?.elementDefs.map(
                            (item: { value: any }) => ({
                                key: item.value,
                                title: item.value,
                                value: item.value,
                                children: undefined,
                            })
                        )
                    }
                }
                return []
            })

            /** @return all enum list data formatted of the component */
            const finalEnumsList = computed(() => {
                if (enumList.value && enumList.value?.length) {
                    return enumList.value?.map((item) => ({
                        value: item.name,
                        key: item.guid,
                        title: item.name,
                    }))
                }
                return []
            })

            const handleEnumCreateSuccess = (newEnum) => {
                createEnum.value = false
                selectedEnum.value = newEnum.name
                refetchTypedef('enum')
                emit('update')
            }

            const enumValueModel = ref<string[]>([])

            const initEnumModel = () => {
                // ? initialize enum edit input v-model
                enumValueModel.value = selectedEnumOptions.value.map(
                    (x) => x.value
                )
            }

            /** ? Edit Enum properties logic starts here   */

            const enumEdit = ref<boolean>(false)

            const handleEditEnum = () => {
                initEnumModel()
                enumEdit.value = true
            }
            const discardEnumEdit = () => {
                enumValueModel.value = []
                enumEdit.value = false
            }

            // Enum Updation flow
            const { updateEnums, updatedEnumDef, reset } = useUpdateEnums()
            const { error: updateError, isReady, state, execute } = updateEnums

            const saveChanges = async () => {
                const store = useTypedefStore()
                const enumObject = enumList.value?.find(
                    (item) => item.name === selectedEnum.value
                )
                if (enumObject) {
                    enumObject.elementDefs = enumValueModel.value.map(
                        (value, ordinal) => ({
                            value,
                            ordinal,
                        })
                    )

                    updatedEnumDef.value = enumObject
                    message.loading({
                        key: 'enum',
                        content: 'Updating Option...',
                    })
                    await execute()
                    const updatedEnum =
                        state?.value?.enumDefs?.length &&
                        state.value.enumDefs[0]
                    store.updateEnum(updatedEnum)
                }
            }

            watch([updateError, isReady], () => {
                const enumObject = state?.value?.enumDefs[0]
                if (isReady && enumObject) {
                    message.success({
                        key: 'enum',
                        content: `Option "${enumObject.name}" updated.`,
                        duration: 2,
                    })
                    enumEdit.value = false
                }
                if (updateError.value) {
                    const errMsg =
                        updateError.value?.response?.data?.errorMessage || ''
                    message.error({
                        key: 'enum',
                        content: errMsg ?? 'Failed to update Option.',
                        duration: 4,
                    })
                    reset()
                }
            })

            const handleChange = (v) => {
                emit(
                    'change',
                    v,
                    selectedEnumOptions.value.map((_v) => _v.value)
                )
                if (enumEdit.value) enumEdit.value = false
                if (createEnum.value) createEnum.value = false
            }

            const handleEnumSearch = (searchValue) => {
                if (searchValue) {
                    createEnum.value = false
                }
                const foundEnum = finalEnumsList.value.filter((theEnum) =>
                    theEnum.value
                        .toUpperCase()
                        .includes(searchValue.toUpperCase())
                )
                if (foundEnum.length === 0) enumSearchValue.value = searchValue
                else enumSearchValue.value = ''
            }

            onMounted(() => {
                if (!selectedEnum.value) {
                    selectedEnum.value = enumList.value[0].name
                    handleChange(selectedEnum.value)
                }
            })

            // fix cause: enumSearchValue resets when select dropdown closes
            watch(enumSearchValue, (newValue, oldValue) => {
                if (newValue) {
                    oldEnumSeardValue.value = newValue
                } else oldEnumSeardValue.value = oldValue
            })

            return {
                access,
                handleEnumSearch,
                handleChange,
                discardEnumEdit,
                createEnumLoading,
                saveChanges,
                handleEditEnum,
                handleEnumCreateSuccess,
                handleCreateEnum,
                enumTypeOtions,
                selectedEnum,
                createEnum,
                selectedEnumOptions,
                enumEdit,
                enumValueModel,
                oldEnumSeardValue,
                finalEnumsList,
                enumSearchValue,
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        &:global(.ant-input),
        :global(.ant-select-selector) {
            @apply border border-gray-300 !important;
        }
    }
</style>
