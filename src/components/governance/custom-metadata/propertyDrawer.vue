<template>
    <div>
        <a-drawer
            :visible="visible"
            :mask="false"
            :width="450"
            :closable="false"
        >
            <div class="flex items-center justify-between px-3 py-4 border-b">
                <div>
                    <p class="text-gray-500">Property</p>
                    <p class="text-xl">
                        {{ isEdit ? form.displayName : 'Add new' }}
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
            <div class="px-3 py-4">
                <a-form
                    ref="formRef"
                    layout="vertical"
                    :rules="rules"
                    :model="form"
                >
                    <div class="grid grid-cols-2 gap-4">
                        <a-form-item
                            label="Name"
                            :name="['displayName']"
                            class=""
                        >
                            <a-input
                                v-model:value="form.displayName"
                                placeholder="Enter a property name"
                                type="text"
                                class=""
                            />
                        </a-form-item>
                        <a-form-item
                            class="w-full"
                            name="typeName"
                            label="Type"
                        >
                            <a-select
                                v-model:value="form.typeName"
                                show-search
                                :disabled="isEdit"
                                :get-popup-container="
                                    (target) => target.parentNode
                                "
                                @change="handleTypeNameChange"
                            >
                                <a-select-option
                                    v-for="(type, index) in attributesTypes"
                                    :key="type.id"
                                    :value="type.id"
                                >
                                    <span>
                                        <AtlanIcon
                                            class="inline h-4 mr-2"
                                            :icon="type.icon"
                                        />

                                        <span>
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
                            (form.options.isEnum === 'true' ||
                                form.options.isEnum === true) &&
                            !isEdit
                        "
                        class="p-3 mb-4 border rounded"
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
                                @change="updateEnumValues"
                            >
                                <template #dropdownRender="{ menuNode: menu }">
                                    <v-nodes :vnodes="menu" />
                                    <a-divider style="margin: 4px 0" />

                                    <p
                                        class="mt-3 text-center cursor-pointer text-primary"
                                        @click="
                                            () => {
                                                form.options.enumType = null
                                                newEnumMode = !newEnumMode
                                            }
                                        "
                                    >
                                        <AtlanIcon
                                            class="inline h-4"
                                            icon="Add"
                                        />

                                        Create new enum
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
                                    class="mb-1 lowercase bg-gray-100 border-0 rounded-full "
                                    >{{ e.title }}</a-tag
                                >
                            </p>
                        </div>

                        <div v-if="newEnumMode" class="mt-6">
                            <NewEnumForm
                                v-if="newEnumMode"
                                ref="newEnumFormRef"
                                @success="handleEnumCreateSuccess"
                            />
                        </div>
                    </div>
                    <!-- <pre>{{ finalEnumsList }}</pre> -->
                    <!-- <pre>{{ form.typeName }}</pre>
                    <pre>{{ form.enumValues }}</pre> -->
                    <!-- End of conditonals ========================================= -->
                    <!-- Applicable Asset type ========================================= -->

                    <div class="flex mb-6">
                        <div class="relative" style="width: 100%">
                            <a-form-item
                                :name="['options', 'customEntityTypes']"
                                class="mb-0"
                            >
                                <template #label>
                                    <span>Applicable Asset type</span>
                                    <a-popover>
                                        <template #content>
                                            <div
                                                class="flex flex-col items-center w-60"
                                            >
                                                Applicable asset type once saved
                                                cannot be removed, you can still
                                                add new Applicable Asset type if
                                                available.
                                            </div>
                                        </template>

                                        <fa
                                            icon="fal info-circle"
                                            class="ml-2 text-xs"
                                        ></fa>
                                    </a-popover>
                                </template>
                                <div class="w-100">
                                    <div ref="typeTreeSelect">
                                        <a-tree-select
                                            :value="
                                                form.options.customEntityTypes
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
                                            :show-checked-strategy="SHOW_CHILD"
                                            @change="
                                                form.options.customEntityTypes =
                                                    $event
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
                        class="flex items-center justify-around w-full gap-4 p-4 bg-gray-100 border rounded "
                    >
                        <div class="w-full">
                            <a-form-item class="mb-2">
                                <div class="flex justify-between">
                                    <label :for="`${form.name}-isFacet`"
                                        >Allow multiple values</label
                                    >
                                    <a-switch
                                        :id="`${form.name}-isFacet`"
                                        v-model:checked="
                                            form.options.multiValueSelect
                                        "
                                        class=""
                                        :name="`${form.name}-isFacet`"
                                        size="small"
                                    />
                                </div>
                            </a-form-item>
                            <a-form-item class="mb-2">
                                <div class="flex justify-between">
                                    <label :for="`${form.name}-isBadge`"
                                        >Allow filtering</label
                                    >
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
                            <a-form-item class="mb-0">
                                <div class="flex justify-between">
                                    <label :for="`${form.name}-isBadge`"
                                        >Allow search</label
                                    >
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
                            </a-form-item>
                        </div>
                    </div>
                    <div
                        :style="{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                            zIndex: 1,
                        }"
                    >
                        <a-button
                            :style="{ marginRight: '8px' }"
                            @click="handleClose"
                        >
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
                </a-form>
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
    } from 'vue'
    import { message, TreeSelect } from 'ant-design-vue'
    import {
        DEFAULT_ATTRIBUTE,
        ATTRIBUTE_INPUT_VALIDATION_RULES,
        ATTRIBUTE_TYPES,
        applicableEntityTypes,
        customEntityTypes,
    } from '~/constant/businessMetadataTemplate'
    import { Types } from '~/services/meta/types'
    import NewEnumForm from './newEnumForm.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    const SHOW_CHILD = TreeSelect.SHOW_CHILD

    export default defineComponent({
        components: {
            NewEnumForm,
            VNodes: (_, { attrs }) => {
                return attrs.vnodes
            },
        },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['addedProperty'],
        setup(props, { emit }) {
            const initializeForm = () => ({
                ...DEFAULT_ATTRIBUTE,
            })
            // data
            const visible = ref<boolean>(false)
            const form = ref<object>(initializeForm())
            const loading = ref<boolean>(false)
            const isEdit = ref<boolean>(false)
            const newEnumMode = ref<boolean>(false)
            const formRef = ref(null)
            const newEnumFormRef = ref(null)
            const propertyIndex = ref(null)
            const typeTreeSelect = ref(null)
            const { metadata } = toRefs(props)

            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )
            const finalApplicableTypeNamesOptions = computed(() => {
                const options = JSON.parse(JSON.stringify(customEntityTypes))
                return options
            })

            const rules = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES))
            )

            const transfromJson = (theProperty) => {
                if (typeof this.form.options.customEntityTypes === 'string')
                    JSON.parse(this.form.options.customEntityTypes)
            }

            // methods
            const open = (theProperty, makeEdit, index) => {
                // when open we send the property value and if is undefined, means we creating new prioperty
                if (theProperty !== undefined) {
                    const customEntityTypes =
                        theProperty.options.customEntityTypes
                    if (customEntityTypes) {
                        if (typeof customEntityTypes === 'string') {
                            theProperty.options.customEntityTypes =
                                JSON.parse(customEntityTypes)
                        }
                    }
                    form.value = theProperty
                } else {
                    form.value = initializeForm()
                    // somehow these 2 remained, so reset them
                    form.value.options.isEnum = false
                    delete form.value.options.enumType
                    delete form.value.enumValues
                }

                propertyIndex.value = index
                isEdit.value = makeEdit
                visible.value = true
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
                tempForm.options.customEntityTypes = JSON.stringify(
                    tempForm.options.customEntityTypes
                )

                // make copy to prevent updating
                const tempBM = JSON.parse(JSON.stringify(metadata.value))
                // transform the customEntityTypes in the other attributeDefs as they would be object
                tempBM.attributeDefs.forEach((x, index) => {
                    if (typeof x.options.customEntityTypes === 'object') {
                        tempBM.attributeDefs[index].options.customEntityTypes =
                            JSON.stringify(x.options.customEntityTypes)
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
                            visible.value = false
                        }
                        if (newError) {
                            loading.value = false
                        }
                    })
                } else {
                    //handle if is Enum, to change typeName to selected Enum
                    if (
                        form.value.options.isEnum === 'true' ||
                        form.value.options.isEnum === true
                    )
                        tempForm.typeName = tempForm.options.enumType
                    // handle if is user, group or name
                    if (
                        form.value.typeName === 'users' ||
                        form.value.typeName === 'url' ||
                        form.value.typeName === 'groups'
                    )
                        tempForm.typeName = 'string'

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
                            visible.value = false
                        }
                        if (newError) {
                            message.error('Error creating attribute, try again')
                            loading.value = false
                        }
                    })
                }
            }

            const handleEnumCreateSuccess = (newEnum) => {
                console.log(newEnum)
                newEnumMode.value = false
                form.value.options.enumType = newEnum.name
                handleUpdateProperty()
            }

            const handleClose = () => {
                loading.value = false
                setTimeout(() => {
                    visible.value = false
                }, 100)
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

            // * Composables
            const { enumList } = useTypedefData()

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

            return {
                visible,
                form,
                attributesTypes,
                finalApplicableTypeNamesOptions,
                isEdit,
                loading,
                rules,
                typeTreeSelect,
                SHOW_CHILD,
                enumTypeOtions,
                finalEnumsList,
                selectedEnumOptions,
                newEnumMode,
                formRef,
                newEnumFormRef,
                // methods
                open,
                initializeForm,
                handleUpdateProperty,
                handleClose,
                handleTypeNameChange,
                updateEnumValues,
                handleEnumCreateSuccess,
            }
        },
        data() {
            return {
                test: [],
                treeSelectOpen: false,
            }
        },
        computed: {
            // name: {
            //     get() {
            //         return this.form.displayName
            //     },
            //     set(newValue) {
            //         this.form.name = newValue
            //         this.form.displayName = newValue
            //     },
            // },
            customEntityTypes: {
                get() {
                    return this.form.options.customEntityTypes
                },
            },
        },
    })
</script>
