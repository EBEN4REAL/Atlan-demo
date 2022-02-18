<template>
    <div class="bg-white rounded-lg shadow" style="">
        <div class="flex items-center p-4 pb-3 border-b">
            <h1 class="flex items-start text-sm font-bold gap-x-2">
                <AtlanIcon icon="Info" class="text-gray-800" />
                Overview
            </h1>
        </div>
        <a-form
            ref="formRef"
            class="p-4"
            layout="vertical"
            :rules="rules"
            :model="form"
            :validate-trigger="['click', 'submit']"
        >
            <div class="grid grid-cols-2 gap-4">
                <a-form-item
                    label="Name"
                    :name="['displayName']"
                    class="mb-0 ant-form-undo-flex-direction"
                >
                    <a-input
                        v-model:value="form.displayName"
                        type="text"
                        :class="$style.input"
                        :disabled="internal"
                    />
                </a-form-item>
                <a-form-item
                    class="mb-0 ant-form-undo-flex-direction"
                    :name="['options', 'primitiveType']"
                    label="Type"
                >
                    <a-select
                        v-model:value="form.options.primitiveType"
                        show-search
                        :disabled="editing"
                        :get-popup-container="(target) => target.parentNode"
                        :list-height="240"
                        :class="$style.input"
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
                <a-form-item
                    label="Description"
                    :name="['description']"
                    class="col-span-2 mb-0 ant-form-undo-flex-direction"
                >
                    <a-textarea
                        v-model:value="form.options.description"
                        type="text"
                        class=""
                        :class="$style.input"
                    />
                </a-form-item>
            </div>
        </a-form>
    </div>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { computed, ref, watch } from 'vue'
    import access from '~/constant/accessControl/map'
    import {
        ATTRIBUTE_INPUT_VALIDATION_RULES,
        ATTRIBUTE_TYPES,
    } from '~/constant/businessMetadataTemplate'

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
    })
    const emit = defineEmits(['update'])

    const formRef = ref()

    const validate = async () => {
        await formRef.value.validate()
    }

    defineExpose({
        validate,
    })

    const { form } = useVModels(props, emit)

    const rules = ref(
        JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES))
    )

    const customFilter = (v, o) =>
        o.label.toLowerCase().includes(v.toLowerCase())

    const attributesTypes = ref(JSON.parse(JSON.stringify(ATTRIBUTE_TYPES)))

    /**
     * @param {String} value new type name selected
     * @desc set enum boolean in options & emit changes
     */
    const handleTypeNameChange = (value: string) => {
        // ? check if enum
        if (value === 'enum') {
            form.value.options.isEnum = true
            // handleEnumSelect()
        } else {
            form.value.options.isEnum = false
            delete form.value.enumValues
        }

        if (['groups', 'users', 'url', 'SQL'].includes(value))
            form.value.options.customType = value
        else delete form.value.options.customType
    }
</script>

<style lang="less" module>
    .input {
        &:global(.ant-input),
        :global(.ant-select-selector) {
            @apply border border-gray-300 !important;
        }
    }
</style>
