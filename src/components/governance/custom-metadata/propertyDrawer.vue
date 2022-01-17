<template>
    <div class="property-drawer">
        <a-drawer
            :visible="visible"
            :mask="false"
            :width="450"
            :closable="false"
            :destroy-on-close="true"
            class="flex flex-col"
            :body-style="{ display: 'flex', 'flex-direction': 'column' }"
        >
            <div class="flex items-center justify-between px-3 py-4 border-b">
                <div class="w-full">
                    <p class="text-gray-500">Property</p>
                    <p class="text-xl">
                        <Truncate
                            :tooltip-text="
                                isEdit ? form.displayName : 'Add new'
                            "
                            :rows="2"
                        />
                    </p>
                </div>

                <a-button
                    type="default"
                    size="small"
                    class="border-gray-300"
                    @click="handleClose"
                >
                    <AtlanIcon icon="Cancel" class="h-3" />
                </a-button>
            </div>
            <!-- Form =============================================================================================================== -->
            <div class="flex-grow px-3 py-4 overflow-y-auto">
                <a-form
                    ref="formRef"
                    class="ant-form-right-asterix"
                    layout="vertical"
                    :rules="rules"
                    :model="form"
                    :validate-trigger="['click', 'submit']"
                >
                    <div class="grid grid-cols-2 gap-4">
                        <a-form-item
                            label="Name"
                            :name="['displayName']"
                            class="ant-form-undo-flex-direction"
                        >
                            <a-input
                                v-model:value="form.displayName"
                                type="text"
                                class=""
                            />
                        </a-form-item>
                        <a-form-item
                            class="ant-form-undo-flex-direction"
                            :name="['options', 'primitiveType']"
                            label="Type"
                        >
                            <a-select
                                v-model:value="form.options.primitiveType"
                                show-search
                                :disabled="isEdit"
                                :get-popup-container="
                                    (target) => target.parentNode
                                "
                                list-height="240"
                                @change="handleTypeNameChange"
                            >
                                <a-select-option
                                    v-for="(type, index) in attributesTypes"
                                    :key="type.id"
                                    :value="type.id"
                                >
                                    <span class="flex items-center">
                                        <AtlanIcon
                                            class="inline h-4 mr-2 align-middle"
                                            :icon="type.icon"
                                        />

                                        <span class="inline align-middle">
                                            {{ type.label }}
                                        </span>
                                    </span>
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div class="grid grid-cols-2 gap-4"></div>
                    <!-- Conditonals ============================================ -->
                    <div
                        v-if="
                            form.options.isEnum === 'true' ||
                            form.options.isEnum === true
                        "
                        class="relative p-3 mb-4 border rounded"
                    >
                        <a-form-item
                            class="mb-3"
                            label="Select Enum"
                            :name="['options', 'enumType']"
                        >
                            <a-select
                                v-model:value="form.options.enumType"
                                show-search
                                no-results-text="No enum found"
                                placeholder="Select enum"
                                :options="finalEnumsList"
                                :disabled="isEdit"
                                @change="handleEnumSelect"
                                @search="handleEnumSearch"
                            >
                                <template #notFoundContent><p></p></template>
                                <template #dropdownRender="{ menuNode: menu }">
                                    <v-nodes :vnodes="menu" />
                                    <a-divider style="margin: 4px 0" />

                                    <p
                                        class="px-3 cursor-pointer text-primary"
                                        @click="handleClickCreateNewEnum"
                                    >
                                        <AtlanIcon
                                            class="inline h-4"
                                            icon="Add"
                                        />

                                        Create new enum
                                        <span v-if="enumSearchValue"
                                            >"{{ enumSearchValue }}"</span
                                        >
                                    </p>
                                </template>
                            </a-select>
                        </a-form-item>

                        <div v-show="selectedEnumOptions?.length" class="">
                            <div class="mb-2 font-normal font-size-sm">
                                Enum options:
                            </div>
                            <p>
                                <a-tag
                                    v-for="(e, x) in selectedEnumOptions"
                                    :key="x"
                                    class="mb-1 lowercase border-0 rounded-full bg-gray-light"
                                    >{{ e.title }}</a-tag
                                >
                            </p>
                        </div>

                        <div v-if="newEnumMode" class="mt-6">
                            <NewEnumForm
                                v-if="newEnumMode"
                                ref="newEnumFormRef"
                                :enum-search-value="oldEnumSeardValue"
                                @changed-loading="isCreatingEnum = $event"
                                @success="handleEnumCreateSuccess"
                            />
                        </div>
                        <div
                            v-if="isCreatingEnum"
                            class="absolute top-0 flex items-center justify-center w-full h-full bg-white bg-opacity-40"
                        >
                            <a-spin size="large" />
                        </div>
                    </div>
                    <!-- <pre>{{ finalEnumsList }}</pre> -->
                    <!-- <pre>{{ form.typeName }}</pre>
                    <pre>{{ form.enumValues }}</pre> -->
                    <!-- End of conditonals ========================================= -->
                    <!-- Applicable Asset type ========================================= -->
                    <div class="flex">
                        <div class="relative" style="width: 100%">
                            <a-form-item
                                label="Description"
                                :name="['description']"
                                class=""
                            >
                                <a-textarea
                                    v-model:value="form.options.description"
                                    type="text"
                                    class=""
                                />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="flex mb-6">
                        <div class="relative" style="width: 100%">
                            <a-form-item
                                :name="[
                                    'options',
                                    'customApplicableEntityTypes',
                                ]"
                                class="mb-0"
                            >
                                <template #label>
                                    <span>Applicable Asset type</span>
                                    <a-popover>
                                        <template #content>
                                            <div
                                                class="flex flex-col items-center px-4 py-2 w-60"
                                            >
                                                This property will only be
                                                available for selected asset
                                                types
                                            </div>
                                        </template>
                                        <AtlanIcon
                                            icon="Info"
                                            class="h-3 ml-1"
                                        />
                                    </a-popover>
                                </template>
                                <div class="w-100">
                                    <div ref="typeTreeSelect">
                                        <a-tree-select
                                            :value="
                                                form.options
                                                    .customApplicableEntityTypes
                                            "
                                            no-results-text="No entities found"
                                            style="width: 100%"
                                            :tree-data="
                                                finalApplicableTypeNamesOptions
                                            "
                                            :is-leaf="true"
                                            :multiple="true"
                                            :async="false"
                                            tree-checkable
                                            :placeholder="
                                                isEdit
                                                    ? 'Add more types'
                                                    : 'Select entity types'
                                            "
                                            dropdown-class-name="type-select-dd"
                                            :max-tag-count="5"
                                            :get-popup-container="
                                                (target) => target.parentNode
                                            "
                                            class="mb-2"
                                            :allow-clear="false"
                                            :check-strictly="true"
                                            :show-checked-strategy="
                                                CHECKEDSTRATEGY
                                            "
                                            @change="
                                                handleApplicableEntityTypeChange
                                            "
                                        >
                                        </a-tree-select>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                    </div>
                    <!-- Applicable Asset type ========================================= -->

                    <div
                        class="flex items-center justify-around w-full gap-4 p-4 bg-gray-100 border rounded"
                    >
                        <div class="w-full">
                            <a-form-item
                                v-if="isMultiValuedSupport"
                                class="mb-2"
                            >
                                <div class="flex justify-between">
                                    <label :for="`${form.name}-isFacet`">
                                        <span class="flex items-center">
                                            Allow multiple values
                                            <a-popover>
                                                <template #content>
                                                    <div class="px-4 py-2 w-60">
                                                        Users will be able to
                                                        add multiple values
                                                        while filling
                                                        <b>
                                                            {{
                                                                form.displayName ??
                                                                'this property.'
                                                            }}
                                                        </b>
                                                    </div>
                                                </template>
                                                <AtlanIcon
                                                    icon="Info"
                                                    class="h-3 ml-1"
                                                />
                                            </a-popover>
                                        </span>
                                    </label>
                                    <a-switch
                                        :id="`${form.name}-isFacet`"
                                        v-model:checked="
                                            form.options.multiValueSelect
                                        "
                                        :disabled="isEdit"
                                        class=""
                                        :name="`${form.name}-isFacet`"
                                        size="small"
                                    />
                                </div>
                            </a-form-item>
                            <a-form-item class="mb-2">
                                <div class="flex justify-between">
                                    <label :for="`${form.name}-isBadge`">
                                        <span class="flex items-center">
                                            Allow filtering
                                            <a-popover>
                                                <template #content>
                                                    <div class="px-4 py-2 w-60">
                                                        <b>
                                                            {{
                                                                form.displayName ??
                                                                'This property '
                                                            }}
                                                        </b>
                                                        will be available in
                                                        asset filtering
                                                    </div>
                                                </template>
                                                <AtlanIcon
                                                    icon="Info"
                                                    class="h-3 ml-1"
                                                />
                                            </a-popover>
                                        </span>
                                    </label>

                                    <a-switch
                                        :id="`${form.name}-isBadge`"
                                        v-model:checked="
                                            form.options.allowFiltering
                                        "
                                        class=""
                                        :name="`${form.name}-isBadge`"
                                        size="small"
                                    />
                                </div>
                            </a-form-item>
                            <!-- <a-form-item class="mb-0">
                                <div class="flex justify-between">
                                    <label :for="`${form.name}-isBadge`">
                                        <span class="flex items-center">
                                            Allow search
                                        </span>
                                    </label>
                                    <a-switch
                                        :id="`${form.name}-isBadge`"
                                        v-model:checked="
                                            form.options.allowSearch
                                        "
                                        class=""
                                        :name="`${form.name}-isBadge`"
                                        size="small"
                                    />
                                </div>
                            </a-form-item> -->
                        </div>
                    </div>
                </a-form>
            </div>

            <div class="flex justify-end p-3 border-t">
                <div v-if="!isEdit" class="flex items-center space-x-2">
                    <a-switch v-model:checked="createMore" size="small" />
                    <p class="p-0 m-0">Create more</p>
                </div>
                <div class="flex-grow"></div>

                <a-button :style="{ marginRight: '8px' }" @click="handleClose">
                    Cancel
                </a-button>
                <a-button
                    type="primary"
                    :loading="loading"
                    @click="handleUpdateProperty"
                >
                    {{ isEdit ? 'Update' : 'Create' }}
                </a-button>
            </div>
            <!-- End of Form =============================================================================================================== -->
        </a-drawer>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        reactive,
        computed,
        toRefs,
        watch,
        Ref,
    } from 'vue'
    import { message, TreeSelect } from 'ant-design-vue'
    import {
        DEFAULT_ATTRIBUTE,
        ATTRIBUTE_INPUT_VALIDATION_RULES,
        ATTRIBUTE_TYPES,
        applicableEntityTypesOptions,
    } from '~/constant/businessMetadataTemplate'
    import { Types } from '~/services/meta/types'
    import NewEnumForm from './newEnumForm.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { refetchTypedef } from '~/composables/typedefs/useTypedefs'
    import { onKeyStroke } from '@vueuse/core'
    import Truncate from '@/common/ellipsis/index.vue'

    const CHECKEDSTRATEGY = TreeSelect.SHOW_PARENT

    export default defineComponent({
        components: {
            NewEnumForm,
            Truncate,
            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['addedProperty', 'openIndex'],
        setup(props, { emit }) {
            const initializeForm = (): CMA => ({
                ...JSON.parse(JSON.stringify(DEFAULT_ATTRIBUTE)),
            })
            // data
            const visible = ref<boolean>(false)
            const createMore = ref<boolean>(false)
            const form = ref<CMA>(initializeForm())
            const loading = ref<boolean>(false)
            const isEdit = ref<boolean>(false)
            const newEnumMode = ref<boolean>(false)
            const isCreatingEnum = ref<boolean>(false)
            const formRef = ref(null)
            const newEnumFormRef = ref(null)
            const propertyIndex = ref(null)
            const typeTreeSelect = ref(null)
            const enumSearchValue = ref('')
            const oldEnumSeardValue = ref('')
            const { metadata } = toRefs(props)

            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )
            const finalApplicableTypeNamesOptions = computed(() => {
                const options = JSON.parse(
                    JSON.stringify(applicableEntityTypesOptions)
                )
                return options
            })

            const rules = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES))
            )

            // methods
            const open = (theProperty, makeEdit, index) => {
                enumSearchValue.value = ''
                // when open we send the property value and if is undefined, means we creating new prioperty
                if (theProperty) {
                    const { customApplicableEntityTypes } = theProperty.options
                    if (customApplicableEntityTypes) {
                        if (typeof customApplicableEntityTypes === 'string') {
                            // eslint-disable-next-line no-param-reassign
                            theProperty.options.customApplicableEntityTypes =
                                JSON.parse(customApplicableEntityTypes)
                        }
                    }
                    form.value = { ...theProperty }
                    console.table(form.value)
                } else {
                    form.value = initializeForm()
                }

                propertyIndex.value = index
                isEdit.value = makeEdit
                visible.value = true
            }

            const openPrev = (i) => {
                emit('openIndex', i - 1)
            }
            const openNext = (i) => {
                emit('openIndex', i + 1)
            }

            onKeyStroke(['ArrowUp', 'ArrowDown'], (e) => {
                if (!visible.value) return
                if (e.key === 'ArrowUp') openPrev(propertyIndex.value)

                if (e.key === 'ArrowDown') openNext(propertyIndex.value)
            })

            const handleUpdateError = (error) => {
                const errorCode = error.response?.data.errorCode
                if (errorCode === 'ATLAS-409-00-013') {
                    return message.error(
                        `Property named '${form.value.displayName}' already exists in the '${metadata.value.displayName}' metadata`
                    )
                }
                message.error('Error occured, try again')
                return null
            }

            const getAnalyticsProperties = (tempForm) => {
                let dataType = tempForm?.typeName
                if (tempForm?.options.isEnum) {
                    dataType = 'enum'
                } else if (tempForm?.options.customType) {
                    dataType = tempForm?.options.customType
                }
                const properties = {
                    data_type: dataType,
                    multi_value: tempForm?.options.multiValueSelect,
                    allow_filtering: tempForm?.options.allowFiltering,
                }
                return properties
            }

            const handleUpdateProperty = async () => {
                // before create or update, check if is in newEnumMode, first create enum then enum will continue property flow if successful
                if (newEnumMode.value === true) {
                    newEnumFormRef.value?.handleCreateEnum()
                    return
                }

                // validate first
                await formRef.value?.validate()
                loading.value = true

                // stringify
                const tempForm = JSON.parse(JSON.stringify(form.value))
                tempForm.options.customApplicableEntityTypes = JSON.stringify(
                    tempForm.options.customApplicableEntityTypes
                )

                // make copy to prevent updating
                const tempBM = JSON.parse(JSON.stringify(metadata.value))
                // transform the CET in the other attributeDefs as they would be object
                tempBM.attributeDefs.forEach((x, index) => {
                    if (
                        typeof x.options.customApplicableEntityTypes ===
                        'object'
                    ) {
                        tempBM.attributeDefs[
                            index
                        ].options.customApplicableEntityTypes = JSON.stringify(
                            x.options.customApplicableEntityTypes
                        )
                    }
                })

                // api call
                if (isEdit.value) {
                    tempBM.attributeDefs[propertyIndex.value] = tempForm
                    const { data, error, isReady } = Types.updateCustomMetadata(
                        {
                            businessMetadataDefs: [tempBM],
                        },
                        {
                            options: {
                                params: { type: 'BUSINESS_METADATA' },
                            },
                        }
                    )
                    watch([isReady, error], ([newValue, newError]) => {
                        if (newValue) {
                            message.success('Attribute edited')
                            loading.value = false
                            const returnSome = (oldData) => {
                                console.log(oldData)
                                return { ...oldData }
                            }
                            // mutate('DEFAULT_TYPEDEFS', {})
                            emit(
                                'addedProperty',
                                data.value.businessMetadataDefs[0].attributeDefs
                            )
                            visible.value = false
                            useAddEvent(
                                'governance',
                                'custom_metadata',
                                'property_updated',
                                getAnalyticsProperties(tempForm)
                            )
                        }
                        if (newError) {
                            handleUpdateError(newError)
                            loading.value = false
                        }
                    })
                } else {
                    tempBM.attributeDefs.push(tempForm)
                    const { data, error, isReady } = Types.updateCustomMetadata(
                        {
                            businessMetadataDefs: [tempBM],
                        },
                        {
                            options: {
                                params: { type: 'BUSINESS_METADATA' },
                            },
                        }
                    )

                    watch([isReady, error], ([newValue, newError]) => {
                        if (newValue) {
                            message.success('Attribute added')
                            loading.value = false

                            emit(
                                'addedProperty',
                                data.value.businessMetadataDefs[0].attributeDefs
                            )
                            if (createMore.value) form.value = initializeForm()
                            else visible.value = false
                            console.log('CM create', tempForm)
                            useAddEvent(
                                'governance',
                                'custom_metadata',
                                'property_added',
                                getAnalyticsProperties(tempForm)
                            )
                        }
                        if (newError) {
                            handleUpdateError(newError)
                            loading.value = false
                        }
                    })
                }
            }

            const handleEnumCreateSuccess = (newEnum) => {
                newEnumMode.value = false
                form.value.options.enumType = newEnum.name
                refetchTypedef('enum')
                handleUpdateProperty()
            }

            const handleClose = () => {
                loading.value = false
                // form.value = initializeForm()
                setTimeout(() => {
                    visible.value = false
                }, 100)
            }

            const { enumList } = useTypedefData()

            /**
             * @desc list of the options of the selected enum
             * make it function
             */
            const selectedEnumOptions = computed(() => {
                if (form.value.options.isEnum) {
                    const reqIndex = enumList.value?.findIndex(
                        (item) => item.name === form.value.options.enumType
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
                return null
            })

            // when an Enum is selected add it's values to form property 'enumValues' as in Atlas
            const updateEnumValues = () => {
                if (
                    form.value.options.isEnum === 'true' ||
                    form.value.options.isEnum === true
                ) {
                    newEnumMode.value = false
                    form.value.enumValues = selectedEnumOptions.value?.map(
                        (x) => x.value
                    )
                } else {
                    delete form.value.enumValues
                }
            }

            const handleEnumSelect = (v) => {
                form.value.typeName = v
                updateEnumValues()
            }

            /**
             * @param {String} value new type name selected
             * @desc set enum boolean in options & emit changes
             */
            const handleTypeNameChange = (value: string) => {
                // ? check if enum
                if (value === 'enum') {
                    form.value.options.isEnum = true
                    updateEnumValues()
                } else {
                    form.value.options.isEnum = false
                    delete form.value.enumValues
                }

                if (['groups', 'users', 'url'].includes(value))
                    form.value.options.customType = value
                else delete form.value.options.customType
            }

            // enums
            const enumTypeOtions = ref(null)

            /** @return all enum list data formatted of the component */
            const finalEnumsList = computed(() => {
                if (enumList.value && enumList.value?.length) {
                    return enumList.value?.map((item) => ({
                        value: item.name,
                        key: item.guid,
                        title: item.name,
                        // children: undefined,
                    }))
                }
                return []
            })

            const handleApplicableEntityTypeChange = (data) => {
                /**
                 * Data is just an array of ids
                 * First get items in finalApplicableTypeNamesOptions that match id and have children (store index or id and children)
                 * Then go through the data again and replace matched items with children ids
                 * reducer should work
                 */
                const childrenExtracted = data.reduce((a, b, index) => {
                    const isParent = finalApplicableTypeNamesOptions.value.find(
                        (y) => b === y.value
                    )
                    if (isParent)
                        a.push(...isParent.children.map((z) => z.value))
                    else a.push(data[index])
                    return a
                }, [])
                form.value.options.customApplicableEntityTypes =
                    childrenExtracted
            }

            const handleClickCreateNewEnum = () => {
                if (!enumSearchValue.value) oldEnumSeardValue.value = ''
                form.value.options.enumType = 'New Enum'
                newEnumMode.value = true
            }

            const handleEnumSearch = (searchValue) => {
                if (searchValue) {
                    newEnumMode.value = false
                }
                const foundEnum = finalEnumsList.value.filter((theEnum) =>
                    theEnum.value
                        .toUpperCase()
                        .includes(searchValue.toUpperCase())
                )
                if (foundEnum.length === 0) enumSearchValue.value = searchValue
                else enumSearchValue.value = ''
            }

            const isMultiValuedSupport = computed(() => {
                const blackList = ['boolean', 'date']
                return !blackList.includes(form.value.options.primitiveType)
            })

            const handleArrayType = () => {
                if (form.value.options.primitiveType === 'enum') {
                    form.value.typeName = `array<${
                        form.value.options.enumType ?? ''
                    }>`
                    return
                }

                form.value.typeName = ['groups', 'users', 'url'].includes(
                    form.value.options.primitiveType
                )
                    ? `array<string>`
                    : `array<${form.value.options.primitiveType}>`
            }

            watch(
                [
                    () => form.value.options.primitiveType,
                    () => form.value.options.multiValueSelect,
                    () => form.value.options.enumType,
                ],
                ([v1, v2, v3]) => {
                    if (v2 === 'true' || v2 === true) handleArrayType()
                    else if (
                        form.value.options.isEnum === 'true' ||
                        form.value.options.isEnum === true
                    )
                        form.value.typeName = form.value.options.enumType
                    // handle if is user, group or name
                    else if (['users', 'url', 'groups'].includes(v1))
                        form.value.typeName = 'string'
                    else form.value.typeName = v1
                },
                { immediate: true }
            )

            // fix cause: enumSearchValue resets when select dropdown closes
            watch(enumSearchValue, (newValue, oldValue) => {
                if (newValue) {
                    oldEnumSeardValue.value = newValue
                } else oldEnumSeardValue.value = oldValue
            })

            return {
                createMore,
                refetchTypedef,
                handleEnumSelect,
                isMultiValuedSupport,
                handleArrayType,
                visible,
                form,
                attributesTypes,
                finalApplicableTypeNamesOptions,
                isEdit,
                loading,
                rules,
                typeTreeSelect,
                CHECKEDSTRATEGY,
                enumTypeOtions,
                finalEnumsList,
                selectedEnumOptions,
                newEnumMode,
                formRef,
                newEnumFormRef,
                isCreatingEnum,
                enumSearchValue,
                oldEnumSeardValue,
                // methods
                open,
                initializeForm,
                handleUpdateProperty,
                handleClose,
                handleTypeNameChange,
                updateEnumValues,
                handleEnumCreateSuccess,
                handleApplicableEntityTypeChange,
                handleEnumSearch,
                handleClickCreateNewEnum,
            }
        },
        data() {
            return {
                test: [],
                treeSelectOpen: false,
            }
        },
    })
</script>

<style lang="less">
    .ant-form-right-asterix {
        .ant-form-item-label {
            overflow: unset !important;
        }
        .ant-form-item-required::before {
            position: absolute;
            right: -12px;
        }
    }
    .ant-form-undo-flex-direction.ant-form-item {
        flex-direction: unset !important;
    }
</style>
