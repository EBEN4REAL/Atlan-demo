<template>
    <!-- <a-dropdown v-model:visible="filterOpened"> -->
    <!-- <template #overlay> -->
    <a-collapse
        v-model="activeCollapse"
        bordered
        :default-active-key="['1', '2']"
        class="-mt-3"
        @change="handleChange"
    >
        <div
            class="w-full p-2.5 text-sm text-gray-500 uppercase bg-white rounded-md flex justify-between"
        >
            {{
                statusFilter.length > 0 && role
                    ? statusFilter.length + 1
                    : statusFilter.length > 0
                    ? statusFilter.length
                    : role
                    ? 1
                    : ''
            }}
            filters
            <span
                v-if="role || statusFilter.length > 0"
                class="capitalize cursor-pointer text-primary"
                @click="handleClearFilter"
            >
                Clear All
            </span>
        </div>

        <a-collapse-panel
            :key="'1'"
            class="border-t-0 group"
            :show-arrow="false"
        >
            <template #header>
                <div class="flex justify-between w-48 hover:text-primary">
                    <span
                        ><span
                            class="text-sm text-gray-500 uppercase hover:text-primary"
                            :class="`${
                                activeCollapse.includes('1')
                                    ? 'text-primary'
                                    : ''
                            }`"
                            >status</span
                        >
                    </span>
                    <span
                        v-if="statusFilter.length"
                        class="ml-auto text-sm text-gray-500 opacity-100 hover:text-red-500"
                        @click.stop.prevent="handleClearStatusFilter"
                    >
                        clear
                    </span>
                    <AtlanIcon
                        icon="CaretDown"
                        class="ml-3 text-gray-500 transition-transform duration-300 transform h2 hover:text-primary"
                        :class="`${
                            activeCollapse.includes('1') ? 'blue-icon' : ''
                        }`"
                    />
                </div>
            </template>
            <div class="justify-center w-full bg-white">
                <a-form layout="vertical" class="px-2">
                    <a-form-item class="mb-0">
                        <a-checkbox-group
                            v-model:value="statusFilter"
                            @change="handleStatusFilterChange"
                        >
                            <div class="flex flex-col w-full">
                                <template
                                    v-for="item in userStatusOptions"
                                    :key="item.id"
                                >
                                    <a-checkbox
                                        class="flex flex-row-reverse justify-between w-48 mb-1 atlan-reverse"
                                        :value="item.value"
                                    >
                                        <!-- <div
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
                                        ></div> -->
                                        <span class="mb-0 text-gray">
                                            {{ item.label }}
                                            <span class="text-sm text-gray-500"
                                                >({{
                                                    userTypeAgg[item.id]
                                                }})</span
                                            >
                                        </span>
                                    </a-checkbox>
                                </template>
                            </div>
                        </a-checkbox-group>
                    </a-form-item>
                </a-form>
            </div>
        </a-collapse-panel>
        <a-collapse-panel
            :key="'2'"
            class="border-t-0 group"
            :show-arrow="false"
        >
            <template #header>
                <div
                    class="flex justify-between w-48 border-t-0 hover:text-primary"
                >
                    <span
                        ><span
                            class="text-sm text-gray-500 uppercase border-t-0"
                            :class="`${
                                activeCollapse.includes('2')
                                    ? 'text-primary'
                                    : ''
                            }`"
                            >role</span
                        ></span
                    >
                    <span
                        v-if="role"
                        class="ml-auto text-sm text-gray-500 opacity-100 hover:text-red-500"
                        @click.stop.prevent="handleClearRoleFilter"
                    >
                        clear
                    </span>
                    <AtlanIcon
                        icon="CaretDown"
                        class="ml-3 text-gray-500 transition-transform duration-300 transform h2 hover:text-primary"
                        :class="`${
                            activeCollapse.includes('2') ? 'blue-icon' : ''
                        }`"
                    />
                </div>
            </template>
            <div class="w-48 p-2 pt-0 text-left bg-white rounded">
                <a-radio-group
                    v-model:value="role"
                    class="grid w-full text-left gap-y-2"
                    @change="handleChangeRoleFilter"
                >
                    <div class="flex flex-col w-full">
                        <template v-for="item in rolesWithCount" :key="item.id">
                            <a-radio
                                class="flex flex-row-reverse justify-between w-48 mb-1 atlan-reverse"
                                :value="item.value"
                            >
                                <span class="mb-0 ml-1 text-gray">
                                    {{ item.label }}
                                    <span class="text-sm text-gray-500"
                                        >({{ item?.memberCount }})</span
                                    >
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
    import { defineComponent, ref, watch, computed, toRefs } from 'vue'
    import { storeToRefs } from 'pinia'
    import { userStatusOptions, roleOptions } from '~/constant/users'

    import useUserStore from '~/store/users'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'UserFilter',
        props: {
            modelValue: {
                type: Array,
                default: () => null,
            },
            role: {
                type: String,
                required: true,
            },
            userTypeAgg: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['update:modelValue', 'change', 'changeRole'],
        setup(props, { emit }) {
            const activeCollapse = ref<Array<String>>(['1', '2'])
            const statusFilter = ref<Array<any>>(props.modelValue)
            const { role } = useVModels(props, emit)
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
            const handleChangeRoleFilter = () => {
                emit('changeRole', role.value)
            }
            const handleClearStatusFilter = () => {
                statusFilter.value = []
                handleStatusFilterChange()
            }
            const handleClearRoleFilter = () => {
                role.value = ''
                emit('changeRole', role.value)
            }
            const handleClearFilter = () => {
                role.value = ''
                statusFilter.value = []
                emit('update:modelValue', [])
                emit('changeRole', role.value)
            }

            const storeUser = useUserStore()
            const { roles } = storeToRefs(storeUser)
            const rolesWithCount = computed(() =>
                roleOptions.map((item, i) => ({ ...item, ...roles?.value[i] }))
            )
            const {
                numberOfActiveUser,
                numberOfDisableUser,
                numberOfInvitedUser,
            } = toRefs(props)
            const handleChange = (collapse) => {
                activeCollapse.value = collapse
            }
            return {
                userStatusOptions,
                statusFilter,
                handleStatusFilterChange,
                activeCollapse,
                filterOpened,
                role,
                handleChangeRoleFilter,
                handleClearFilter,
                roles,
                rolesWithCount,
                handleClearRoleFilter,
                handleClearStatusFilter,
                handleChange,
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

<style lang="less">
    .group {
        .ant-collapse-content {
            border: 0 !important;
        }
        .ant-collapse-content-active {
            border: 0 !important;
        }
        .ant-collapse-content-box {
            padding-bottom: 0 !important;
        }
    }
    .blue-icon {
        transform: rotate(180deg) !important;
        path {
            stroke: rgb(82, 119, 215);
        }
    }
</style>
