<template>
    <CardWrapper title="Overview" icon="Info">
        <div class="grid grid-cols-2 gap-4">
            <a-form-item
                label="Name"
                :name="['displayName']"
                class="mb-0 ant-form-undo-flex-direction"
            >
                <a-input
                    v-model:value="form.displayName"
                    type="text"
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
                />
            </a-form-item>
        </div>
    </CardWrapper>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { computed, ref } from 'vue'
    import { ATTRIBUTE_TYPES } from '~/constant/businessMetadataTemplate'
    import CardWrapper from '@/governance/custom-metadata/propertyDrawer/misc/wrapper.vue'

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
    })
    const emit = defineEmits([])

    const { form } = useVModels(props, emit)

    const customFilter = (v, o) =>
        o.label.toLowerCase().includes(v.toLowerCase())

    const attributesTypes = ref(JSON.parse(JSON.stringify(ATTRIBUTE_TYPES)))

    /**
     * @param {String} value new type name selected
     * @desc set enum boolean in options & emit changes
     */
    const handleTypeNameChange = (value: string) => {
        // ? check if enum
        if (value === 'enum') form.value.options.isEnum = true
        else {
            form.value.options.isEnum = false
            delete form.value.enumValues
        }

        if (['groups', 'users', 'url', 'SQL'].includes(value))
            form.value.options.customType = value
        else delete form.value.options.customType
    }
</script>

<style lang="less" module></style>
