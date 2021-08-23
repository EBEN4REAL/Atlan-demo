<template>
    <div class="mb-4 w-100">
        <a-input
            v-if="type === 'number'"
            v-model:value="value"
            class="px-2 mr-2 border shadow-none w-100"
            type="number"
            placeholder="Type..."
            @change="() => debounce(() => handleChange(), 800)"
        />
        <a-radio-group
            v-else-if="type === 'boolean'"
            v-model:value="value"
            class="shadow-none"
            @change="handleChange"
        >
            <a-radio class="shadow-none" value="true">True</a-radio>
            <a-radio class="shadow-none" value="false">False</a-radio>
        </a-radio-group>
        <span v-else-if="type === 'date'">
            <a-date-picker
                v-model:value="value"
                value-format="x"
                class="w-100"
                style="width: 100%"
                @change="handleChange"
            />
        </span>
        <a-input
            v-else-if="type === 'text'"
            v-model:value="value"
            placeholder="Type..."
            type="text"
            class="px-2 mr-2 shadow-none border-1"
            @change="() => debounce(() => handleChange(), 800)"
        />
        <div v-else>
            <a-select
                v-model:value="value"
                style="width: 100%"
                :max-tag-count="1"
                :show-arrow="true"
                class=""
                placeholder=""
                :options="getEnumOptions(type)"
                @change="handleChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, onMounted, inject } from 'vue'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'

    export default defineComponent({
        props: {
            type: {
                type: [String, Object],
                required: true,
                default: 'text',
            },
            operator: {
                type: String,
                required: true,
                default: '=',
            },
            defaultValue: {
                type: String,
                required: true,
            },
        },
        emits: ['handleChange'],
        setup(props, { emit }) {
            const { getDatatypeOfAttribute, createDebounce } =
                useBusinessMetadataHelper()
            const value = ref(null)
            const enumsList: Ref<{}> = inject('enumsList')

            const getEnumOptions = (enumName: string) =>
                enumsList.value
                    .find((e) => e.name === enumName)
                    .elementDefs.map((a) => ({
                        label: a.value,
                        value: a.value,
                    }))

            const handleChange = () => {
                emit('handleChange', props.operator, value.value)
            }

            onMounted(() => {
                value.value = props.defaultValue
            })
            return {
                getDatatypeOfAttribute,
                value,
                handleChange,
                enumsList,
                getEnumOptions,
                debounce: createDebounce(),
            }
        },
    })
</script>

<style scoped></style>
