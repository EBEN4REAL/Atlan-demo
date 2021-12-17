<template>
    <div class="flex self-start flex-grow">
        <MultiInput
            v-if="
                [
                    'number',
                    'int',
                    'long',
                    'float',
                    'url',
                    'string',
                    'text',
                ].includes(typeName.toLowerCase()) && isMultivalued
            "
            v-model="localValue"
            class="flex-grow shadow-none"
            placeholder="Press Enter to add"
            :data-type="typeName"
            @change="handleChange"
        />

        <a-input
            v-else-if="typeName === 'number'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="number"
            placeholder="Enter an integer..."
            @change="handleChange"
        />
        <a-input
            v-else-if="typeName === 'float'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="Enter decimal value..."
            @change="handleChange"
        />
        <a-input
            v-else-if="typeName === 'url'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="url"
            placeholder="Enter a URL..."
            @change="handleChange"
        />
        <a-radio-group
            v-else-if="typeName === 'boolean'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow"
            @change="handleChange"
        >
            <a-radio :value="true">Yes</a-radio>
            <a-radio :value="false">No</a-radio>
        </a-radio-group>
        <a-date-picker
            v-else-if="typeName === 'date'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow w-100"
            value-format="x"
            @change="handleChange"
        />
        <a-textarea
            v-else-if="typeName === 'text'"
            v-model:value="localValue"
            :allow-clear="true"
            :auto-size="true"
            :show-count="parseInt(attribute.options.maxStrLength) < 1000"
            :maxlength="parseInt(attribute.options.maxStrLength)"
            placeholder="Type..."
            type="text"
            class="flex-grow shadow-none"
            @change="handleChange"
        />
        <UserSelector
            v-if="typeName === 'users'"
            v-model:value="localValue"
            :multiple="isMultivalued"
            @change="handleChange"
        />
        <GroupSelector
            v-if="typeName === 'groups'"
            v-model:value="localValue"
            :multiple="isMultivalued"
            @change="handleChange"
        />
        <a-select
            v-else-if="typeName === 'enum'"
            v-model:value="localValue"
            class="flex-grow shadow-none border-1"
            :allow-clear="true"
            :placeholder="`Select ${isMultivalued ? 'enums' : 'an enum'}`"
            :mode="isMultivalued ? 'multiple' : null"
            style="width: 100%"
            :show-arrow="true"
            :options="getEnumOptions(attribute.options.enumType)"
            @change="handleChange"
        >
            <template #suffixIcon>
                <AtlanIcon icon="CaretDown" />
            </template>
        </a-select>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, computed } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'

    import MultiInput from '@/common/input/customizedTagInput.vue'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'
    import UserSelector from '@/common/select/users.vue'
    import GroupSelector from '@/common/select/groups.vue'

    export default defineComponent({
        name: 'EditCustomMetadata',
        components: { MultiInput, UserSelector, GroupSelector },
        props: {
            attribute: {
                type: Object,
                required: true,
            },
            modelValue: {
                type: String,
                required: false,
                default: () => undefined,
            },
        },

        emits: ['change', 'update:modelValue'],

        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getEnumOptions,
            } = useCustomMetadataHelpers()
            const typeName = computed(() =>
                getDatatypeOfAttribute(props.attribute as CMA)
            )

            const localValue: any = ref(modelValue.value)

            if (typeName.value === 'date' && localValue.value)
                localValue.value = localValue.value.toString()

            const isMultivalued = ref(
                props.attribute.options.multiValueSelect === 'true'
            )

            // set proper default value
            if (isMultivalued.value && !localValue.value) localValue.value = []
            else if (!localValue.value) localValue.value = ''

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                typeName,
                isMultivalued,
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                localValue,
                getEnumOptions,
                handleChange,
            }
        },
    })
</script>

<style lang="less" scoped></style>
