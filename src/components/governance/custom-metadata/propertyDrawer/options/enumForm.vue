<template>
    <div class="relative col-span-2 space-y-4 rounded">
        <div v-if="disable" class="space-y-2">
            <div class="mb-1 text-gray-500">Name</div>
            <div v-if="disable" class="text-gray-700">
                {{ selectedEnum }}
            </div>
        </div>
        <a-form-item
            v-else
            class="mb-0 text-gray-500"
            label="Select Option"
            :name="['options', 'enumType']"
        >
            <a-select
                v-model:value="selectedEnum"
                show-search
                no-results-text="No option found"
                placeholder="Select option"
                :options="finalEnumsList"
                :disabled="disable"
                :class="$style.input"
                :dropdown-class-name="$style.optionsDropdown"
                @mousedown="dropdownVisible = true"
                @change="handleChange"
                @search="(v) => (search = v)"
            >
                <template #suffixIcon>
                    <AtlanIcon icon="CaretDown" class="text-gray-500" />
                </template>
                <template #notFoundContent>
                    <div class="flex justify-center">No results found</div>
                </template>
                <template #dropdownRender="{ menuNode: menu }">
                    <!-- <div class="px-3 mt-2 mb-3 border-gray-300">
                        <Search
                            v-model="search"
                            :clearable="true"
                            :placeholder="`Search from ${finalEnumsList.length} Options`"
                            @focus="dropdownVisible = true"
                        />
                    </div> -->
                    <VNodes :vnodes="menu" />
                    <a-divider class="m-0 my-1" />
                    <div
                        v-auth="access.CREATE_ENUM"
                        class="flex items-center h-10 px-3 mx-1 rounded cursor-pointer hover:bg-primary-light text-primary"
                        @click="handleCreateEnum"
                    >
                        <AtlanIcon class="inline h-4" icon="Add" />

                        Create new Option
                        <span v-if="search">"{{ search }}"</span>
                    </div>
                </template>
            </a-select>
        </a-form-item>

        <div v-show="selectedEnumOptions?.length" class="">
            <div class="flex justify-between">
                <div class="mb-2 font-normal text-gray-500 font-size-sm">
                    Values
                </div>
                <template v-if="editAccess">
                    <span
                        v-if="!enumEdit"
                        v-auth="access.UPDATE_ENUM"
                        class="cursor-pointer text-primary hover:underline"
                        @click="handleEditEnum"
                        >Edit</span
                    >

                    <div v-else class="">
                        <span
                            v-auth="access.UPDATE_ENUM"
                            class="py-0.5 pr-2 border-r border-gray-300 cursor-pointer"
                            @click="discardEnumEdit"
                            >Cancel</span
                        >
                        <span
                            v-auth="access.UPDATE_ENUM"
                            class="ml-2 cursor-pointer hover:underline text-primary"
                            @click="saveChanges"
                            >Save</span
                        >
                    </div>
                </template>
            </div>
            <template v-if="enumEdit">
                <MultiInput
                    ref="multiInput"
                    placeholder='Enter values separated by a  ";" or "↵"'
                    :value="enumValueModel"
                    delimiter=";"
                    @change="(v) => (enumValueModel = v)"
                />
            </template>
            <p v-else class="flex flex-wrap">
                <a-tag
                    v-for="(e, x) in selectedEnumOptions"
                    :key="x"
                    class="flex items-center justify-center mb-1 bg-gray-200 border-0 rounded h-7"
                    style=""
                >
                    <SimpleEllipsis :text="e.title" max-width="100px" />
                </a-tag>
            </p>
        </div>

        <div v-if="createEnum" class="mt-6">
            <CreateEnumForm
                v-if="createEnum"
                ref="newEnumFormRef"
                :enum-search-value="search"
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
    import Search from '@/common/input/searchAdvanced.vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import SimpleEllipsis from '@/common/ellipsis/simpleEllipsis.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: {
            Search,
            SimpleEllipsis,
            CreateEnumForm,
            MultiInput,
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            disable: { type: Boolean, required: true },
            editAccess: { type: Boolean, default: true },
            default: { type: String, default: '' },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const createEnum = ref<boolean>(false)
            const selectedEnum = ref()
            const search = ref('')
            const enumEdit = ref<boolean>(false)
            const dropdownVisible = ref<boolean>(false)
            // enums
            const enumSearchValue = ref('')
            const oldEnumSeardValue = ref('')

            const { enumList }: { enumList: ComputedRef<EnumDef[]> } =
                useTypedefData()

            const enumTypeOtions = ref(null)

            const handleCreateEnum = () => {
                dropdownVisible.value = false
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
                if (enumList.value?.length) {
                    return enumList.value
                        .map((item) => ({
                            value: item.name,
                            key: item.guid,
                            title: item.name,
                        }))
                        .filter((_enum) =>
                            search.value
                                ? _enum.title
                                      .toLowerCase()
                                      .includes(search.value.toLowerCase())
                                : true
                        )
                }
                return []
            })

            const handleChange = (v) => {
                dropdownVisible.value = false
                emit(
                    'change',
                    v,
                    selectedEnumOptions.value.map((_v) => _v.value)
                )
                if (enumEdit.value) enumEdit.value = false
                if (createEnum.value) createEnum.value = false
            }

            const handleEnumCreateSuccess = (newEnum) => {
                createEnum.value = false
                selectedEnum.value = newEnum.name
                handleChange(selectedEnum.value)
                refetchTypedef('enum')
            }

            const enumValueModel = ref<string[]>([])

            const initEnumModel = () => {
                // ? initialize enum edit input v-model
                enumValueModel.value = selectedEnumOptions.value.map(
                    (x) => x.value
                )
            }

            /** ? Edit Enum properties logic starts here   */

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
                    useAddEvent('governance', 'options', 'updated', {
                        alias: updatedEnum.name,
                    })
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
                    selectedEnum.value = props.default || enumList.value[0].name
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
                dropdownVisible,
                search,
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

    .optionsDropdown {
        :global(.rc-virtual-list) {
            @apply px-1;
        }
        :global(.ant-select-item) {
            @apply p-2 rounded;
        }
        :global(.ant-select-item-option-selected) {
            @apply bg-primary-light;
        }
    }
</style>
