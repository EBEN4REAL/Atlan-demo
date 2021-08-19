<template>
    <div class="mb-4 w-100">
        <a-input
            v-if="type === 'number'"
            v-model:value="value"
            class="px-2 mr-2 border shadow-none w-100"
            type="number"
            placeholder="Type..."
            @change="handleChange"
        />
        <a-select
            v-else-if="type === 'boolean'"
            v-model:value="value"
            class="border"
            @change="handleChange"
        >
            <option value="true">True</option>
            <option value="false">False</option>
        </a-select>
        <span v-else-if="type === 'date'">
            <a-date-picker
                v-model:value="value"
                value-format="x"
                class="w-100"
                style="width: 100%"
                @change="handleChange"
            />
        </span>
        <!-- <div v-else-if="type === 'array<date>'" class="">
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
                <div v-for="(i, n) in multiInputs[a.name]" :key="n" class="">
                    <a-date-picker
                        value-format="x"
                        :value="multiInputs[a.name][n]"
                        size="small"
                        :allow-clear="true"
                        @change="
                            (timestamp, string) =>
                                handleMultiInputChange(
                                    x,
                                    true,
                                    a.name,
                                    timestamp,
                                    n
                                )
                        "
                    />
                </div>
            </div>
            <div class="flex justify-end">
                <a-tag
                    class="bg-white cursor-pointer"
                    style="background: #fff; border-style: none"
                    @click="addMoreMultiElement(a.name)"
                >
                    <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
                ><a-tag
                    class="mr-0 bg-white cursor-pointer"
                    style="background: #fff; border-style: dashed"
                    @click="
                        () => {
                            updateAttribute()
                            a.isEdit = false
                            multiInputs[a.name] = ['', '']
                        }
                    "
                >
                    Done
                </a-tag>
            </div>
        </div>
        <div v-else-if="type === 'array<number>'" class="">
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
                <div v-for="(i, n) in multiInputs[a.name]" :key="n" class="">
                    <a-input-number
                        :key="n"
                        size="small"
                        :placeholder="`Value ${n + 1}`"
                        class="mb-1"
                        allow-clear
                        style="width: 100%"
                        :value="multiInputs[a.name][n]"
                        @change="
                            (v) =>
                                handleMultiInputChange(x, false, a.name, v, n)
                        "
                    />
                </div>
            </div>
            <div class="flex justify-end">
                <a-tag
                    class="bg-white cursor-pointer"
                    style="background: #fff; border-style: none"
                    @click="addMoreMultiElement(a.name)"
                >
                    <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
                ><a-tag
                    class="mr-0 bg-white cursor-pointer"
                    style="background: #fff; border-style: dashed"
                    @click="
                        () => {
                            updateAttribute()
                            a.isEdit = false
                            multiInputs[a.name] = ['', '']
                        }
                    "
                >
                    Done
                </a-tag>
            </div>
        </div>
        <div v-else-if="type === 'array<text>'" class="text-center">
            <div class="grid grid-cols-2 mb-2 gap-x-2 gap-y-1">
                <div v-for="(i, n) in multiInputs[a.name]" :key="n" class="">
                    <a-input
                        :key="n"
                        size="small"
                        :placeholder="`Value ${n + 1}`"
                        class="mb-1"
                        allow-clear
                        :value="multiInputs[a.name][n]"
                        @change="
                            (e) =>
                                handleMultiInputChange(
                                    x,
                                    false,
                                    a.name,
                                    e.target.value,
                                    n
                                )
                        "
                    />
                </div>
            </div>
            <div class="flex justify-end">
                <a-tag
                    class="bg-white cursor-pointer"
                    style="background: #fff; border-style: none"
                    @click="addMoreMultiElement(a.name)"
                >
                    <fa icon="fal plus" class="pushtop"></fa> add more </a-tag
                ><a-tag
                    class="mr-0 bg-white cursor-pointer"
                    style="background: #fff; border-style: dashed"
                    @click="
                        () => {
                            updateAttribute()
                            a.isEdit = false
                            multiInputs[a.name] = ['', '']
                        }
                    "
                >
                    Done
                </a-tag>
            </div>
        </div> -->
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
            @change="handleChange"
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
        emits: ['handleChange', 'removeFilter'],
        setup(props, { emit }) {
            const { getDatatypeOfAttribute } = useBusinessMetadataHelper()
            const value = ref(null)

            const handleChange = () => {
                emit('handleChange', props.type, props.operator, value.value)
            }

            onBeforeUnmount(() => {
                // ? unmounting this === unchecking the checkbox, remove any value is applied
                if (value.value) {
                    emit('removeFilter', props.operator)
                }
            })

            onMounted(() => {
                value.value = props.defaultValue
            })
            return {
                getDatatypeOfAttribute,
                value,
                handleChange,
            }
        },
    })
</script>

<style scoped></style>
