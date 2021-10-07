<template>
    <a-form
        ref="formRef"
        layout="vertical"
        :rules="rules"
        :model="attributeInput.data"
    >
        <div class="grid grid-cols-2 gap-4">
            <a-form-item
                label="Name"
                :name="['options', 'displayName']"
                class=""
            >
                <a-input
                    v-model:value="attributeInput.data.options.displayName"
                    type="text"
                    class=""
                    @change="handleFieldChange"
                />
            </a-form-item>
            <a-form-item class="" name="searchWeight">
                <template #label>
                    <span>Search Weight</span>
                    <a-popover>
                        <template #content>
                            <div class="flex flex-col items-center">
                                <div class="mb-2 text-center font-size-14">
                                    <fa icon="fal arrow-up" class="mr-1"></fa>
                                    the search weight for the attribute,
                                    <br />
                                    <fa icon="fal arrow-up" class="mx-1"></fa>
                                    the entity in the topmost
                                    <br />
                                    search results when searched for by that
                                    attribute
                                </div>
                                <div
                                    class="mb-1 font-bold  font-size-14 text-underline"
                                >
                                    Applicable Ranges
                                </div>
                                <div class="font-size-14">
                                    Quick search: <b>0 - 10</b>
                                </div>
                                <div class="font-size-14">
                                    Suggestion: <b>8 - 10</b>
                                </div>
                            </div>
                        </template>

                        <fa
                            icon="fal question-circle"
                            class="ml-2 text-xs"
                        ></fa>
                    </a-popover>
                </template>
                <a-select
                    v-model:value="attributeInput.data.searchWeight"
                    class=""
                    @change="handleFieldChange"
                >
                    <a-select-option v-for="n in 10" :key="n" :value="n">{{
                        n
                    }}</a-select-option>
                </a-select>
            </a-form-item>
        </div>
        <div class="flex items-center justify-around w-full gap-4">
            <a-form-item class="w-full" name="typeName" label="Type">
                <a-select
                    v-model:value="attributeInput.data.typeName"
                    show-search
                    :disabled="isEdit"
                    :get-popup-container="(target) => target.parentNode"
                    @change="handleTypeNameChange"
                >
                    <a-select-option
                        v-for="type in attributesTypes"
                        :key="type.id"
                        :value="type.id"
                    >
                        {{ type.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <div
                v-if="attributeInput.data.typeName !== 'boolean'"
                class="w-full"
            >
                <a-form-item label="Multivalues">
                    <div class="mb-1">
                        <a-switch
                            :id="`${attributeInput.data.name}-isMultiValued`"
                            v-model:checked="
                                attributeInput.data.options.isMultiValued
                            "
                            class=""
                            :disabled="isEdit"
                            :name="`${attributeInput.data.name}-isMultiValued`"
                            size="small"
                            @change="handleFieldChange"
                        />
                        <label
                            class="ml-1"
                            :for="`${attributeInput.data.name}-isMultiValued`"
                            >{{
                                attributeInput.data.options.isMultiValued
                                    ? 'Enabled'
                                    : 'Disabled'
                            }}</label
                        >
                    </div>
                </a-form-item>
            </div>
        </div>

        <div v-if="attributeInput.data.typeName === 'string'" class="mb-2">
            <a-form-item
                class=""
                label="Max. String Length"
                :name="['options', 'maxStrLength']"
            >
                <a-input-number
                    v-model:value="attributeInput.data.options.maxStrLength"
                    :min="1"
                    style="width: 200px"
                    @change="handleFieldChange"
                />
            </a-form-item>
        </div>
        <div v-if="attributeInput.data.options?.isEnum" class="">
            <a-form-item
                class="mb-3"
                label="Choose Enum"
                :name="['options', 'enumType']"
            >
                <a-tree-select
                    v-model:value="attributeInput.data.options.enumType"
                    no-results-text="No enum found"
                    :tree-data="finalEnumsList"
                    :multiple="false"
                    :async="false"
                    placeholder="Select enum"
                    :disabled="isEdit"
                    @change="handleFieldChange"
                >
                </a-tree-select>
            </a-form-item>
            <div v-show="selectedEnumOptions?.length" class="">
                <div class="mb-2 font-normal font-size-sm">Enum options:</div>
                <p>
                    <a-tag
                        v-for="(e, x) in selectedEnumOptions"
                        :key="x"
                        class="mb-1"
                        >{{ e.title }}</a-tag
                    >
                </p>
            </div>
        </div>
        <div class="flex">
            <div class="relative" style="width: 100%">
                <a-form-item
                    :name="['options', 'applicableEntityTypes']"
                    class="mb-0"
                >
                    <template #label>
                        <span>Applicable Asset type</span>
                        <a-popover>
                            <template #content>
                                <div class="flex flex-col items-center w-60">
                                    Applicable Asset type once saved cannot be
                                    removed, you can still add new Applicable
                                    Asset type if available.
                                </div>
                            </template>

                            <fa
                                icon="fal info-circle"
                                class="ml-2 text-xs"
                            ></fa>
                        </a-popover>
                    </template>
                    <a-tree-select
                        v-model:value="
                            attributeInput.data.options.applicableEntityTypes
                        "
                        no-results-text="No entities found"
                        style="width: 100%"
                        :tree-data="finalApplicableTypeNamesOptions"
                        :multiple="true"
                        :async="false"
                        tree-checkable
                        :placeholder="
                            isEdit ? 'Add more types' : 'Select entity types'
                        "
                        dropdown-class-name="type-select-dd"
                        :max-tag-count="5"
                        :get-popup-container="(target) => target.parentNode"
                        class="mb-2"
                        :allow-clear="true"
                        @change="handleFieldChange"
                    >
                    </a-tree-select>
                    <div v-show="addedEntityTypes?.length" class="">
                        <div class="mb-2 font-normal font-size-sm">
                            Previously added:
                        </div>
                        <p>
                            <a-tag
                                v-for="(t, x) in addedEntityTypes"
                                :key="x"
                                class="mb-1"
                                >{{ t }}</a-tag
                            >
                        </p>
                    </div>
                </a-form-item>
            </div>
        </div>
    </a-form>
</template>
<script lang="ts">
    import { defineComponent, reactive, ref, computed, onMounted } from 'vue'

    import useEnums from '@/admin/enums/composables/useEnums'
    import {
        DEFAULT_ATTRIBUTE,
        ATTRIBUTE_INPUT_VALIDATION_RULES,
        ATTRIBUTE_TYPES,
    } from '~/constant/business_metadata'
    // * Plugins

    // * Utils
    // import { generateUUID } from "~/utils/helper/generator";

    // * Composables
    import useAssetQualifiedName from '~/composables/asset/useAssetQualifiedName'

    export default defineComponent({
        components: {},
        props: {
            attribute: {
                type: Object,
                required: true,
            },
            isEdit: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updateAttribute'],
        setup(props, context) {
            // * Methods
            const getDefaultAttributeTemplate = () =>
                // const uuid4 = generateUUID();
                // TODO change back to uuid4
                ({ ...DEFAULT_ATTRIBUTE })
            // return { ...DEFAULT_ATTRIBUTE, name: uuid4 };
            // * Data
            const formRef = ref()
            const attributeInput = reactive({
                data: JSON.parse(JSON.stringify(getDefaultAttributeTemplate())),
            })

            const rules = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES))
            )
            const attributesTypes = reactive(
                JSON.parse(JSON.stringify(ATTRIBUTE_TYPES))
            )

            const enumTypeOtions = ref(null)

            // * Composables
            const { enumListData: enumsList } = useEnums()
            const { getApplicableEntitiesForBmAttributes } =
                useAssetQualifiedName()

            /** @return all enum list data formatted of the component */
            const finalEnumsList = computed(() => {
                if (enumsList.value && enumsList.value.length) {
                    return enumsList.value.map((item) => ({
                        value: item.name,
                        key: item.guid,
                        title: item.name,
                        children: undefined,
                    }))
                }
                return []
            })

            const addedEntityTypes = ref([])

            /** @desc all applicable entities available to be attached
             * if not new attribute, dont show already added attribute
             * display already added attirbutes in tags
             */
            const finalApplicableTypeNamesOptions = computed(() => {
                const options = getApplicableEntitiesForBmAttributes()
                if (props.attribute?.options?.applicableEntityTypes)
                    return options
                        .filter((t) => !addedEntityTypes.value.includes(t.id))
                        .map((o) => ({
                            title: o.label,
                            value: o.id,
                            key: o.id,
                        }))
                return []
            })
            /**
             * @desc list of the options of the selected enum
             * make it function
             */
            const selectedEnumOptions = computed(() => {
                if (attributeInput.data.options.isEnum) {
                    const reqIndex = enumsList.value.findIndex(
                        (item) =>
                            item.name === attributeInput.data.options.enumType
                    )
                    if (
                        reqIndex > -1 &&
                        enumsList.value[reqIndex].elementDefs &&
                        enumsList.value[reqIndex].elementDefs.length
                    ) {
                        return enumsList.value[reqIndex].elementDefs.map(
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
            // * Methods

            /**
             * @param {Object} data attribute data object
             * @desc formats some attributes of the object based on the user config, ex. if multivalued ,
             *       type === array<type>
             * @returns {Object} modifed attribute data object
             */
            const normalize = (data: object): object => {
                const temp = JSON.parse(JSON.stringify(data))
                // ? stringify applicable type
                temp.options.applicableEntityTypes = JSON.stringify([
                    ...addedEntityTypes.value,
                    ...temp.options.applicableEntityTypes,
                ])

                // ? add enum types as typeName
                if (temp.typeName === 'enum')
                    temp.typeName = temp.options.enumType

                // ? modify typeName for multivalued
                if (temp.options.isMultiValued) {
                    temp.typeName = `array<${temp.typeName}>`
                }

                // ? remove not-required data
                if (!temp.typeName.toLowerCase().includes('string')) {
                    if (temp.options.maxStrLength)
                        delete temp.options.maxStrLength
                }

                return temp
            }

            /**
             * @desc since props is shallow copied, emit the latest changes to parent
             */
            const handleFieldChange = () => {
                context.emit('updateAttribute', normalize(attributeInput.data))
            }

            /**
             * @param {String} value new type name selected
             * @desc set enum boolean in options & emit changes
             */
            const handleTypeNameChange = (value: string) => {
                // ? check if enum
                if (value === 'enum') {
                    attributeInput.data.options.isEnum = true
                } else attributeInput.data.options.isEnum = false
                handleFieldChange()
            }

            // * hooks
            const setAttributeData = () => {
                // ? multiValueSelect if type name contains array, needed for multivalued check default.
                if (props.attribute) {
                    attributeInput.data = JSON.parse(
                        JSON.stringify(props.attribute)
                    )
                    // ? FIX boolean value on saving turns to string
                    if (typeof attributeInput.data.options.isEnum === 'string')
                        attributeInput.data.options.isEnum = JSON.parse(
                            attributeInput.data.options.isEnum
                        )
                    if (
                        typeof attributeInput.data.options.isMultiValued ===
                        'string'
                    )
                        attributeInput.data.options.isMultiValued = JSON.parse(
                            attributeInput.data.options.isMultiValued
                        )
                }
                // ? By default append all applicable types if is new // also emit?
                if (props.attribute.isNew) {
                    attributeInput.data.options.applicableEntityTypes =
                        finalApplicableTypeNamesOptions.value.map(
                            (t) => t.value
                        )
                } else {
                    // ? Display added entity types separately
                    addedEntityTypes.value = JSON.parse(
                        attributeInput.data.options.applicableEntityTypes
                    )
                    attributeInput.data.options.applicableEntityTypes = []

                    // ? parse the original type name if multivalued
                    if (attributeInput.data.options.isEnum) {
                        attributeInput.data.typeName = 'enum'
                    } else if (attributeInput.data.options.isMultiValued) {
                        // eslint-disable-next-line prefer-destructuring
                        attributeInput.data.typeName =
                            attributeInput.data.typeName
                                .split('<')[1]
                                .split('>')[0]
                    }
                }
            }
            onMounted(() => {
                // ? make a local state of the attribute
                setAttributeData()
            })

            return {
                addedEntityTypes,
                attributeInput,
                attributesTypes,
                enumTypeOtions,
                enumsList,
                finalApplicableTypeNamesOptions,
                finalEnumsList,
                formRef,
                handleFieldChange,
                handleTypeNameChange,
                rules,
                selectedEnumOptions,
            }
        },
    })
</script>

<style lang="less">
    .type-select-dd {
        max-height: 30vh !important;
    }
</style>
