<template>
    <a-drawer
        :visible="visible"
        :mask="false"
        :width="550"
        :closable="false"
        :destroy-on-close="true"
        class="flex flex-col propertyDrawer"
        :body-style="{ display: 'flex', 'flex-direction': 'column' }"
    >
        <Header
            v-model:createMore="createMore"
            :title="form.displayName || undefined"
            :editing="isEdit"
            :loading="loading"
            @close="handleClose"
            @update="handleUpdateProperty"
        />
        <!-- Form =============================================================================================================== -->
        <a-form
            ref="formRef"
            layout="vertical"
            class="h-full"
            :rules="rules"
            :model="form"
            :validate-trigger="['click', 'submit']"
        >
            <div class="h-full p-4 space-y-4 bg-gray-100">
                <Overview
                    ref="overviewRef"
                    v-model:form="form"
                    :internal="viewOnly"
                    :editing="isEdit"
                />

                <Options
                    v-if="[true, 'true'].includes(form.options.isEnum)"
                    ref="optionsRef"
                    v-model:form="form"
                    :internal="viewOnly"
                    :editing="isEdit"
                />

                <div
                    v-if="false"
                    class="flex-grow p-4 overflow-y-auto bg-gray-100"
                >
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
                                    :disabled="viewOnly"
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
                                    :list-height="240"
                                    :filter-option="customFilter"
                                    @change="handleTypeNameChange"
                                >
                                    <a-select-option
                                        v-for="(type, index) in attributesTypes"
                                        :key="type.label"
                                        :value="type.id"
                                        :label="type.label"
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

                        <!-- <pre>{{ finalEnumsList }}</pre> -->
                        <!-- <pre>{{ form.typeName }}</pre>
                    <pre>{{ form.enumValues }}</pre> -->
                        <!-- End of conditonals ========================================= -->
                        <!-- Applicable Asset type ========================================= -->
                        <div class="flex">
                            <div class="relative" style="width: 100%"></div>
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
                                                :disabled="viewOnly"
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
                                                    (target) =>
                                                        target.parentNode
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
                                                        <div
                                                            class="px-4 py-2 w-60"
                                                        >
                                                            Users will be able
                                                            to add multiple
                                                            values while filling
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
                                                        <div
                                                            class="px-4 py-2 w-60"
                                                        >
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
                            </div>
                        </div>
                    </a-form>
                </div>
            </div>
        </a-form>

        <!-- End of Form =============================================================================================================== -->
    </a-drawer>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        reactive,
        computed,
        toRefs,
        watch,
        provide,
    } from 'vue'
    import { message, TreeSelect } from 'ant-design-vue'
    import { onKeyStroke } from '@vueuse/core'
    import {
        ATTRIBUTE_INPUT_VALIDATION_RULES,
        ATTRIBUTE_TYPES,
    } from '~/constant/businessMetadataTemplate'
    import { Types } from '~/services/meta/types'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import Truncate from '@/common/ellipsis/index.vue'
    import access from '~/constant/accessControl/map'
    import MultiInput from '@/common/input/customizedTagInput.vue'
    import { applicableTypeList } from '~/composables/custommetadata/useApplicableTypes'
    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'

    // sub-modules
    import Header from '@/governance/custom-metadata/propertyDrawer/header.vue'
    import Overview from '@/governance/custom-metadata/propertyDrawer/overview/overview.vue'
    import Options from '@/governance/custom-metadata/propertyDrawer/options/options.vue'
    import {
        executeCreateEnum,
        validate as enumFormValidate,
    } from '@/governance/custom-metadata/propertyDrawer/options/useCreateEnum'

    const CHECKEDSTRATEGY = TreeSelect.SHOW_PARENT

    export default defineComponent({
        components: {
            Overview,
            Header,
            Options,
        },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['addedProperty', 'openIndex'],
        setup(props, { emit }) {
            const { getDefaultAttributeTemplate } = useBusinessMetadata()
            const initializeForm = (): CMA => getDefaultAttributeTemplate()
            // data
            const visible = ref<boolean>(false)
            const createMore = ref<boolean>(false)
            const form = ref<CMA>(initializeForm())
            const overviewRef = ref()
            const optionsRef = ref()
            const loading = ref<boolean>(false)
            const isEdit = ref<boolean>(false)

            const formRef = ref()
            const newEnumFormRef = ref(null)
            const propertyIndex = ref(-1)
            const typeTreeSelect = ref(null)

            const applicableEntityTypesOptions = applicableTypeList()
            const viewOnly = computed(
                () => props.metadata.options?.isLocked === 'true'
            )
            const { metadata } = toRefs(props)
            provide('property', form)

            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )

            const customFilter = (v, o) =>
                o.label.toLowerCase().includes(v.toLowerCase())

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
                // before create or update, check if is in createEnum, first create enum then enum will continue property flow if successful
                // validate first

                const isCreatingEnum =
                    [true, 'true'].includes(form.value.options.isEnum) &&
                    form.value.options.enumType === 'New Option'

                if (isCreatingEnum) {
                    const promises = [
                        formRef.value.validate(),
                        enumFormValidate(),
                    ]
                    await Promise.allSettled(promises)
                    await executeCreateEnum()
                } else await formRef.value.validate()

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

            const handleClose = () => {
                loading.value = false
                setTimeout(() => {
                    visible.value = false
                }, 100)
            }

            /** ? Edit Enum properties logic end ends   */

            const getAllLeafNodes = (node) => {
                const leaf: any = []

                const category = applicableEntityTypesOptions.find(
                    (_category) => _category.value === node
                )

                // ? if selection is a category , extract all child leaf
                if (category) {
                    category.children.forEach((c) => {
                        // ? if child of category has child, then it is a source
                        if (c.children) {
                            leaf.push(
                                ...c.children.map((leafNode) => leafNode.value)
                            )
                            // ? else it is a leaf
                        } else leaf.push(c.value)
                    })
                    // ? if not a category its either a source or a leaf
                } else {
                    // ? flatten all node at 2nd level
                    const allSourceAndLeaf: any = []
                    applicableEntityTypesOptions.forEach((cat) => {
                        const sourceAndLeaf: any[] = cat.children.reduce(
                            (acc, cur) => {
                                if (cur.children) acc.push(...cur.children)
                                else acc.push(cur)
                                return acc
                            },
                            []
                        )
                        allSourceAndLeaf.push(...sourceAndLeaf)
                    })

                    allSourceAndLeaf.forEach((_node) => {
                        if (_node.value === node || _node.source === node) {
                            leaf.push(_node.value)
                        }
                    })
                }

                return leaf
            }

            const handleApplicableEntityTypeChange = (data, l, e) => {
                /**
                 * Just trying to flatten the the tree given any node, add all leaf node values
                 */
                const flatValues: any = []
                data.forEach((item) => {
                    flatValues.push(...getAllLeafNodes(item))
                })
                form.value.options.customApplicableEntityTypes = flatValues
            }

            const isMultiValuedSupport = computed(() => {
                const blackList = ['boolean', 'date', 'SQL']
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
                    else if (['users', 'url', 'groups', 'SQL'].includes(v1))
                        form.value.typeName = 'string'
                    else form.value.typeName = v1
                },
                { immediate: true }
            )

            return {
                overviewRef,
                optionsRef,
                // createEnum,
                applicableEntityTypesOptions,
                customFilter,
                viewOnly,
                access,
                createMore,
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
                formRef,
                newEnumFormRef,
                open,
                initializeForm,
                handleUpdateProperty,
                handleClose,
                handleApplicableEntityTypeChange,
            }
        },
    })
</script>

<style lang="less">
    .propertyDrawer {
        .ant-form-undo-flex-direction.ant-form-item {
            flex-direction: unset !important;
        }
        .ant-row {
            display: block;
        }

        .ant-input,
        .ant-select-selector {
            @apply border border-gray-300 !important;
        }

        .ant-form-item-label > label {
            @apply text-gray-500;
        }
    }
</style>
