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

        <div
            v-else-if="
                typeof type === 'object' &&
                getDatatypeOfAttribute(a.typeName).type === 'enum'
            "
        >
            <!-- <a-select
                v-model:value="value"
                style="width: 100%"
                size="small"
                :max-tag-count="1"
                :show-arrow="true"
                class=""
                placeholder=""
                :options="
                    getDatatypeOfAttribute(a.typeName).enum.elementDefs.map(
                        (item) => ({
                            value: item.value,
                            title: item.value,
                        })
                    )
                "
                @change=""
            /> -->
            <!-- <div
                v-if="getDatatypeOfAttribute(a.typeName).isMultivalues"
                class="flex justify-end mt-2"
            >
                <a-tag
                    class="mr-0 bg-white cursor-pointer"
                    style="background: #fff; border-style: dashed"
                    @click="
                        () => {
                            updateAttribute()
                            a.isEdit = false
                        }
                    "
                >
                    Done
                </a-tag>
            </div> -->
        </div>
        <a-input
            v-else
            v-model:value="value"
            placeholder="Type..."
            type="text"
            class="px-2 mr-2 shadow-none border-1"
            @change="() => debounce(() => handleChange(), 800)"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onBeforeUnmount, onMounted } from 'vue'
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
                debounce: createDebounce(),
            }
        },
    })
</script>

<style scoped></style>
