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
            ref="inputRef"
            v-model="localValue"
            class="flex-grow shadow-none"
            :placeholder="`Press Enter to add multiple ${getHumanTypeName(
                typeName
            )}(s)`"
            :data-type="typeName"
            @change="handleChange"
        />

        <a-input
            v-else-if="typeName === 'number'"
            ref="inputRef"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="number"
            placeholder="Enter an integer..."
            @change="handleChange"
            @keydown.e="(e) => e.preventDefault()"
        />
        <a-input
            v-else-if="typeName === 'float'"
            ref="inputRef"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="Enter decimal value..."
            @change="handleChange"
            @keydown.e="(e) => e.preventDefault()"
        />
        <a-input
            v-else-if="typeName === 'url'"
            ref="inputRef"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="url"
            placeholder="Enter a URL..."
            @change="handleChange"
        />
        <a-radio-group
            v-else-if="typeName === 'boolean'"
            ref="inputRef"
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
            ref="inputRef"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow w-100"
            value-format="x"
            @change="handleChange"
        />
        <a-textarea
            v-else-if="typeName === 'text'"
            ref="inputRef"
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
            ref="inputRef"
            v-model:value="localValue"
            :multiple="isMultivalued"
            @change="handleChange"
        />
        <GroupSelector
            v-if="typeName === 'groups'"
            ref="inputRef"
            v-model:value="localValue"
            :multiple="isMultivalued"
            @change="handleChange"
        />
        <a-select
            v-else-if="typeName === 'enum'"
            ref="inputRef"
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
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        onMounted,
        nextTick,
    } from 'vue'
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
            index: {
                type: Number,
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
            const { modelValue, index } = useVModels(props, emit)
            const inputRef = ref()

            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getEnumOptions,
                getHumanTypeName,
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

            onMounted(() => {
                if (index.value === 0)
                    nextTick(() => {
                        inputRef.value.focus()
                    })
            })

            // const getMultiInputPlaceholder = (t: string) => {
            //     if (t === 'url') return 'Press Enter to add a new URL'
            //     if (['number', 'int', 'long'].includes(t))
            //         return 'Press Enter to add a new number'
            //     if (['float'].includes(t))
            //         return 'Press Enter to add a new decimal'
            //     return 'Press Enter to add multiple values'
            // }

            return {
                getHumanTypeName,
                // getMultiInputPlaceholder,
                inputRef,
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
