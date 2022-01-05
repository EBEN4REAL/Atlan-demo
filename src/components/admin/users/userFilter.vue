<template>
    <!-- <a-dropdown v-model:visible="filterOpened"> -->
    <!-- <template #overlay> -->
    <a-collapse>
        <div class="w-full p-2 text-sm text-gray-500 uppercase bg-white">
            filters
        </div>
        <a-collapse-panel class="group" :show-arrow="false">
            <template #header>
                <div class="flex justify-between w-36">
                    <span class="text-sm text-gray-500 uppercase">status</span>
                    <AtlanIcon
                        icon="CaretDown"
                        class="ml-3 text-gray-500 transition-transform duration-300 transform h2 hover:text-primary title"
                    />
                </div>
            </template>
            <div class="justify-center p-2 bg-white rounded w-36">
                <a-form layout="vertical" class="p-0">
                    <a-form-item class="mb-0">
                        <a-checkbox-group
                            v-model:value="statusFilter"
                            class="grid gap-y-2"
                            @change="handleStatusFilterChange"
                        >
                            <div class="flex flex-col w-full">
                                <template
                                    v-for="item in userStatusOptions"
                                    :key="item.id"
                                >
                                    <a-checkbox
                                        class="flex flex-row-reverse justify-between mb-1 atlan-reverse w-36"
                                        :value="item.value"
                                    >
                                        <div
                                            class="inline-flex -mt-1 align-middle dot"
                                            :class="`${
                                                item.label.toLocaleLowerCase() ===
                                                'active'
                                                    ? 'bg-success'
                                                    : item.label.toLocaleLowerCase() ===
                                                      'disabled'
                                                    ? 'bg-error'
                                                    : 'bg-alert'
                                            }`"
                                        ></div>
                                        <span class="mb-0 text-gray">
                                            {{ item.label }}
                                        </span>
                                    </a-checkbox>
                                </template>
                            </div>
                        </a-checkbox-group>
                    </a-form-item>
                </a-form>
            </div>
        </a-collapse-panel>
        <a-collapse-panel class="group" :show-arrow="false">
            <template #header>
                <div class="flex justify-between w-36">
                    <span class="text-sm text-gray-500 uppercase">role</span>
                    <AtlanIcon
                        icon="CaretDown"
                        class="ml-3 text-gray-500 transition-transform duration-300 transform h2 hover:text-primary title"
                    />
                </div>
            </template>
            <div class="p-2 text-left bg-white rounded w-36">
                <a-radio-group
                    v-model:value="statusFilter"
                    class="grid w-full text-left gap-y-2"
                    @change="handleStatusFilterChange"
                >
                    <div class="flex flex-col w-full">
                        <template v-for="item in roleOptions" :key="item.id">
                            <a-radio
                                class="flex flex-row-reverse justify-between mb-1 atlan-reverse w-36"
                                :value="item.value"
                            >
                                <span class="mb-0 ml-1 text-gray">
                                    {{ item.label }}
                                </span>
                            </a-radio>
                        </template>
                    </div>
                </a-radio-group>
            </div>
        </a-collapse-panel>
    </a-collapse>
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
    import { userStatusOptions, roleOptions } from '~/constant/users'

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
                roleOptions,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
        margin-right: 8px;
    }
</style>
