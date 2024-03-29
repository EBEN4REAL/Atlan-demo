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
        <div
            class="flex items-center justify-between px-3 py-4 border-b border-gray-300"
        >
            <div class="flex items-center flex-grow gap-x-2">
                <div
                    class="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-primary-light"
                >
                    <AtlanIcon icon="Metadata" class="text-primary" />
                </div>
                <div class="flex-grow font-bold">
                    <Truncate
                        :tooltip-text="
                            (isArchived && form.displayName + ' (deleted)') ||
                            form.displayName ||
                            'New Property'
                        "
                        class=""
                        :rows="2"
                    />
                </div>
            </div>
        </div>
        <!-- Form =============================================================================================================== -->
        <a-form
            ref="formRef"
            layout="vertical"
            class=""
            :rules="rules"
            :model="form"
            :validate-trigger="['click', 'submit']"
        >
            <div class="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-100">
                <Overview
                    ref="overviewRef"
                    v-model:form="form"
                    :readOnly="isArchived"
                    :internal="viewOnly || isArchived"
                    :editing="isEdit"
                />

                <Options
                    v-if="[true, 'true'].includes(form.options.isEnum)"
                    ref="optionsRef"
                    v-model:form="form"
                    :internal="viewOnly || isArchived"
                    :editing="isEdit"
                />

                <ApplicableTypes
                    v-model:form="form"
                    :internal="viewOnly || isArchived"
                    :editing="isEdit"
                />

                <Configurations
                    v-model:form="form"
                    :internal="viewOnly"
                    :readOnly="isArchived"
                    :editing="isEdit"
                />
            </div>
        </a-form>

        <Header
            v-if="!isArchived"
            v-model:createMore="createMore"
            :title="form.displayName || undefined"
            :editing="isEdit"
            :loading="loading"
            @close="handleClose"
            @update="handleUpdateProperty"
        />
        <Shortcut
            v-else
            shortcut-key="esc"
            action="close"
            placement="left"
            :delay="0"
            :edit-permission="true"
        >
            <div class="close-btn-sidebar" @click="handleClose">
                <AtlanIcon icon="Add" class="text-white outline-none" />
            </div>
        </Shortcut>
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
    import { message } from 'ant-design-vue'
    import v from 'event-source-polyfill'
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
    // import { applicableTypeList } from '~/composables/custommetadata/useApplicableTypes'
    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'

    // sub-modules
    import Header from '@/governance/custom-metadata/propertyDrawer/header.vue'
    import Overview from '@/governance/custom-metadata/propertyDrawer/overview/overview.vue'
    import Options from '@/governance/custom-metadata/propertyDrawer/options/options.vue'
    import ApplicableTypes from '@/governance/custom-metadata/propertyDrawer/applicableTypes/applicableTypes.vue'
    import Configurations from '@/governance/custom-metadata/propertyDrawer/configurations/configurations.vue'
    import { getAnalyticsProperties } from '@/governance/custom-metadata/properties/properties.utils'

    import {
        executeCreateEnum,
        validate as enumFormValidate,
    } from '@/governance/custom-metadata/propertyDrawer/options/useCreateEnum'

    export default defineComponent({
        components: {
            Truncate,
            Overview,
            Header,
            Options,
            ApplicableTypes,
            Configurations,
        },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['addedProperty', 'openDirection'],
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
            const isArchived = ref<boolean>(false)

            const formRef = ref()
            const newEnumFormRef = ref(null)
            const typeTreeSelect = ref(null)

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

            const rules = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES))
            )

            // methods
            const open = (property, makeEdit) => {
                // when open we send the property value and if is undefined, means we creating new prioperty
                if (!property) {
                    form.value = initializeForm()
                } else {
                    const localProperty = JSON.parse(JSON.stringify(property))
                    if (localProperty) {
                        // ? parse customApplicableEntityTypes string
                        const { customApplicableEntityTypes } =
                            localProperty.options
                        if (customApplicableEntityTypes) {
                            if (
                                typeof customApplicableEntityTypes === 'string'
                            ) {
                                // eslint-disable-next-line no-param-reassign
                                localProperty.options.customApplicableEntityTypes =
                                    JSON.parse(customApplicableEntityTypes)
                            }
                        }

                        // ? migrate old desc to new as form is using localProperty.description
                        if (
                            !localProperty?.description &&
                            localProperty?.options?.description
                        )
                            localProperty.description =
                                localProperty?.options?.description

                        // ? check for isArchived
                        isArchived.value = ['true', true].includes(
                            localProperty?.options?.isArchived
                        )

                        // ? parse configuraton options
                        localProperty.options.allowFiltering = [
                            true,
                            'true',
                        ].includes(localProperty.options.allowFiltering)
                        localProperty.options.allowSearch = [
                            true,
                            'true',
                        ].includes(localProperty.options.allowSearch)
                        localProperty.options.showInOverview = [
                            true,
                            'true',
                        ].includes(localProperty.options.showInOverview)
                        localProperty.options.multiValueSelect = [
                            true,
                            'true',
                        ].includes(localProperty.options.multiValueSelect)

                        form.value = localProperty
                    }
                }

                isEdit.value = makeEdit
                visible.value = true
            }

            const openPrev = (name) => {
                emit('openDirection', {
                    name,
                    direction: 'previous',
                    isArchived: isArchived.value,
                })
            }

            const openNext = (name) => {
                emit('openDirection', {
                    name,
                    direction: 'next',
                    isArchived: isArchived.value,
                })
            }

            // FIXME remove indexing logic
            onKeyStroke(['ArrowUp', 'ArrowDown'], (e) => {
                if (!visible.value) return
                if (e.key === 'ArrowUp') openPrev(form.value.name)

                if (e.key === 'ArrowDown') openNext(form.value.name)
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
                    await Promise.all(promises)
                    await executeCreateEnum()
                } else await formRef.value.validate()

                loading.value = true

                // stringify
                const tempForm = JSON.parse(JSON.stringify(form.value))
                tempForm.options.customApplicableEntityTypes = JSON.stringify(
                    tempForm.options.customApplicableEntityTypes
                )

                /**
                 * if new desc is present, delete old description
                 *  this is done because if user is deleting new description, it will fall back to old description
                 */
                if (tempForm.description) delete tempForm.options.description

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
                    const propertyIndex = tempBM.attributeDefs.findIndex(
                        (attr) => attr.name === tempForm.name
                    )
                    tempBM.attributeDefs[propertyIndex] = tempForm
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
                            message.success('Attribute updated')
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
                                getAnalyticsProperties(
                                    tempForm,
                                    metadata.value.displayName
                                )
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
                                getAnalyticsProperties(
                                    tempForm,
                                    metadata.value.displayName
                                )
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
                customFilter,
                viewOnly,
                access,
                createMore,
                handleArrayType,
                visible,
                form,
                attributesTypes,
                isEdit,
                isArchived,
                loading,
                rules,
                typeTreeSelect,
                formRef,
                newEnumFormRef,
                open,
                initializeForm,
                handleUpdateProperty,
                handleClose,
            }
        },
    })
</script>

<style lang="less">
    .propertyDrawer {
        .ant-form {
            @apply flex flex-col flex-grow overflow-hidden;
        }
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
