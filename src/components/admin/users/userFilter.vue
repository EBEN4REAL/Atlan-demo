<template>
    <!-- <a-dropdown v-model:visible="filterOpened"> -->
    <!-- <template #overlay> -->
    <div
        class="rounded p-4 w-36 justify-center bg-white"
    >
        <a-form layout="vertical" class="p-0">
            <a-form-item label="USER STATUS" class="mb-0">
                <a-checkbox-group
                    v-model:value="statusFilter"
                    class="grid gap-y-2"
                    :options="userStatusOptions"
                    @change="handleStatusFilterChange"
                ></a-checkbox-group>
            </a-form-item>
        </a-form>
    </div>
    <!-- </template> -->
    <!-- <a-button size="default" class="px-2 text-gray-500 rounded-md">
            <AtlanIcon icon="FilterFunnel" />
            <div
                v-if="statusFilter?.length"
                class="absolute w-2 h-2 bg-blue-500 rounded -top-1 -right-1"
            ></div>
        </a-button> -->
    <!-- </a-dropdown> -->
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { userStatusOptions } from '~/constant/users'

    export default defineComponent({
        name: 'UserFilter',
        props: {
            modelValue: {
                type: Array,
                default: () => null,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const activeCollapse = ref<Array<String>>(['1'])
            const statusFilter = ref<Array<any>>(props.modelValue)
            const filterOpened = ref(false)
            const handleStatusFilterChange = () => {
                // to ensure that I can do checks for null when updating filter, can use length check
                const valueToUpdate =
                    statusFilter.value.length === 0
                        ? null
                        : statusFilter.value.map((v) => JSON.parse(v))
                emit('update:modelValue', valueToUpdate)
                emit('change', valueToUpdate)
            }
            watch(
                () => props.modelValue,
                () => {
                    if (!props.modelValue?.length) statusFilter.value = []
                }
            )

            return {
                userStatusOptions,
                statusFilter,
                handleStatusFilterChange,
                activeCollapse,
                filterOpened,
            }
        },
    })
</script>
