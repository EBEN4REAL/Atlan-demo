<template>
    <a-dropdown
        trigger="click"
        :on-visible-change="handleVisibleChange"
        :visible="filterOpened"
    >
        <template #overlay>
            <div class="bg-gray-100 rounded shadow-xl" style="width: 240px">
                <a-collapse
                    v-model="activeCollapse"
                    default-active-key="1"
                    :bordered="false"
                    class=""
                >
                    <a-collapse-panel key="1" header="USER STATUS">
                        <div class="">
                            <a-checkbox-group
                                v-model:value="statusFilter"
                                class="grid gap-y-2"
                                :options="userStatusOptions"
                                @change="handleStatusFilterChange"
                            ></a-checkbox-group>
                        </div>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </template>
        <a-button
            size="default"
            class="px-2 text-gray-500 rounded-md"
            @click="filterOpened = !filterOpened"
        >
            <fa icon="fal filter"></fa>
            <div
                v-if="statusFilter?.length"
                class="absolute w-2 h-2 bg-blue-500 rounded -top-1 -right-1"
            ></div>
        </a-button>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        props: {
            modelValue: {
                type: Array,
                default: () => null,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const activeCollapse = ref<Array<String>>(['1'])
            const filterOpened = ref<Boolean>(false)
            const statusFilter = ref<Array<any>>(props.modelValue)
            const handleStatusFilterChange = () => {
                // to ensure that I can do checks for null when updating filter, can use length check
                const valueToUpdate =
                    statusFilter.value.length === 0 ? null : statusFilter.value
                emit('update:modelValue', valueToUpdate)
                emit('change', valueToUpdate)
            }

            const handleVisibleChange = (flag) => {
                filterOpened.value = flag
            }

            return {
                statusFilter,
                handleStatusFilterChange,
                filterOpened,
                handleVisibleChange,
                activeCollapse,
            }
        },
        data() {
            return {
                userStatusOptions: [
                    {
                        label: 'Active',
                        value: { enabled: true, email_verified: true },
                    },
                    { label: 'Disabled', value: { enabled: false } },
                    {
                        label: 'Invited',
                        value: { enabled: true, email_verified: false },
                    },
                ],
            }
        },
    })
</script>
