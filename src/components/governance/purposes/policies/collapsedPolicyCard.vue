<template>
    <div class="relative border-b container-policy-card">
        <div
            class="flex items-center px-3 py-3 rounded cursor-pointer group hover:bg-gray-100 card-policy"
            :class="selectedPolicy.id === policy.id ? '' : ''"
            @click="handleClickPlicyCard"
        >
            <div class="flex items-center flex-1 mb-1">
                <div
                    v-if="type === 'meta'"
                    class="flex items-center justify-center mr-2 bg-gray-100 border border-gray-200 rounded-full w-9 h-9"
                >
                    <AtlanIcon v-if="type === 'meta'" icon="Policies" />
                </div>
                <div
                    v-if="type === 'data'"
                    class="flex items-center justify-center mr-2 bg-gray-100 border border-gray-200 rounded-full w-9 h-9"
                >
                    <AtlanIcon icon="QueryGrey" />
                </div>
                <div class="pl-1">
                    <!-- <div>
                        <span
                            class="text-gray-500"
                            data-test-id="policy-type"
                            >{{
                                type === 'meta'
                                    ? 'Metadata Policy'
                                    : 'Data Policy'
                            }}</span
                        >
                        <span class="mx-1 text-gray-500">/</span>
                        <span class="text-gray-500">{{ policy?.name }}</span>
                    </div> -->
                    <div>
                        <span class="text-gray-500">{{ policy?.name }}</span>
                        <span class="text-gray-300 mx-1.5">•</span>
                        <span class="text-gray-500">{{
                            type === 'meta' ? 'Metadata' : 'Data'
                        }}</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between flex-1">
                <div class="flex items-center">
                    <div class="flex justify-items-end">
                        <span
                            v-if="policy.groups.length > 0"
                            class="font-semibold"
                        >
                            <a-tooltip placement="top">
                                <template #title>
                                    {{ policy.groups.length }} Groups
                                </template>
                                <AtlanIcon icon="Group" class="-mt-1" />
                                {{ policy.groups.length }}
                            </a-tooltip>
                        </span>
                        <span
                            v-if="
                                policy.users.length > 0 &&
                                policy.groups.length > 0
                            "
                            class="text-gray-300 mx-1.5"
                            >•</span
                        >
                        <span
                            v-if="policy.users.length > 0"
                            class="font-semibold"
                        >
                            <a-tooltip placement="top">
                                <template #title>
                                    {{
                                        policy.users.length > 1
                                            ? `${policy.users.length} Users`
                                            : `${policy.users.length} User`
                                    }}
                                </template>
                                <AtlanIcon icon="User" class="-mt-1" />
                                {{ policy.users.length }}
                            </a-tooltip>
                        </span>
                    </div>
                    <div v-if="permissions.length > 0 && type === 'meta'">
                        <span class="text-gray-300 mx-1.5">•</span>
                        <a-tooltip placement="top">
                            <template #title>
                                {{
                                    permissions.length > 1
                                        ? `${permissions.length} permissions`
                                        : `${permissions.length} permission`
                                }}
                            </template>
                            <span class="flex-none text-sm font-semibold">
                                <AtlanIcon
                                    icon="ShieldBlank"
                                    class="-mt-1 icon-gray"
                                />
                                {{ permissions.length }}
                            </span>
                        </a-tooltip>
                    </div>
                    <!-- <div v-if="type === 'data'">
                        <span class="text-gray-300 mx-1.5">•</span>
                        <span class="flex-none text-sm">Query Access </span>
                    </div> -->
                    <div
                        v-if="
                            type === 'data' &&
                            policy?.mask &&
                            policy?.mask != 'null'
                        "
                    >
                        <span class="text-gray-300 mx-1.5">•</span>
                        <span
                            v-if="maskComputed"
                            class="flex-none text-sm font-semibold"
                        >
                            <a-tooltip placement="top">
                                <template #title>
                                    {{ maskComputed }}
                                </template>
                                <AtlanIcon
                                    icon="Number"
                                    class="-mt-1 icon-gray"
                                />
                                {{ maskComputed }}
                            </a-tooltip>
                        </span>
                    </div>
                </div>
                <!-- <span v-if="!policy.allow" class="mr-5 denied-policy-pill">
                    {{
                        type === 'meta' ? 'Denied Permissions' : 'Denied Query'
                    }}
                </span> -->
            </div>
            <div class="flex justify-end flex-1 pr-8">
                <span v-if="!policy.allow" class="text-sm text-red-500">{{
                    type === 'meta' ? 'Denied Permission' : 'Denied Query'
                }}</span>
            </div>
            <div class="items-center justify-end flex-1 gap-1 pr-3 default-s4">
                <a-tooltip placement="top">
                    <template #title>
                        <div class="text-gray-300">Created by</div>
                        <div>
                            {{ policy.createdBy }}
                            {{ createdAtFormated }}
                        </div>
                    </template>
                    <AtlanBtn
                        class="px-2 bg-transparent border-none hover:bg-gray-200"
                        size="sm"
                        color="secondary"
                        data-test-id="policy-delete"
                        padding="compact"
                    >
                        <AtlanIcon icon="WarningIcon" />
                    </AtlanBtn>
                </a-tooltip>
                <a-popover
                    v-model:visible="visibleDelete"
                    trigger="click"
                    placement="topRight"
                    @onMouseleave="() => (visibleDelete = false)"
                >
                    <template #content>
                        <div class="popover-delete">
                            <span>
                                Are you sure you want to delete
                                <strong>{{ policy?.name }}</strong> ?
                            </span>
                            <div class="btn-wrapper">
                                <AtlanBtn
                                    padding="compact"
                                    color="minimal"
                                    class="btn-asset"
                                    size="sm"
                                    @click="() => (visibleDelete = false)"
                                >
                                    Cancel
                                </AtlanBtn>
                                <AtlanBtn
                                    padding="compact"
                                    class="btn-asset"
                                    size="sm"
                                    color="danger"
                                    @click="removePolicy"
                                >
                                    Delete
                                </AtlanBtn>
                            </div>
                        </div>
                    </template>
                    <AtlanBtn
                        class="flex-none px-2 bg-transparent border-none hover:text-red-500 bg-none hover:bg-primary-light"
                        size="sm"
                        color="secondary"
                        data-test-id="policy-delete"
                        padding="compact"
                        @click.stop="() => (visibleDelete = true)"
                    >
                        <AtlanIcon icon="Delete" class="" />
                    </AtlanBtn>
                </a-popover>
                <AtlanBtn
                    class="px-2 bg-transparent border-none"
                    size="sm"
                    color="secondary"
                    data-test-id="policy-delete"
                    padding="compact"
                >
                    <AtlanIcon class="text-primary" icon="ArrowRight" />
                </AtlanBtn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import AtlanBtn from '@/UI/button.vue'
    import {
        DataPolicies,
        MetadataPolicies,
    } from '~/types/accessPolicies/purposes'
    import Owners from '~/components/common/input/owner/index.vue'
    import useScopeService from '~/components/governance/personas/composables/useScopeService'
    import { splitArray } from '~/utils/string'
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import { maskPurpose } from '~/constant/policy'

    export default defineComponent({
        name: 'Purpose Policy',
        components: {
            UserPill,
            GroupPill,
            Owners,
            AtlanBtn,
            PillGroup,
        },
        props: {
            policy: {
                type: Object as PropType<DataPolicies & MetadataPolicies>,
                required: true,
            },
            selectedPolicy: {
                type: Object as PropType<DataPolicies & MetadataPolicies>,
                required: true,
            },
            type: {
                type: String as PropType<'meta' | 'data'>,
                required: true,
            },
        },
        emits: ['edit', 'cancel', 'delete'],
        setup(props, { emit }) {
            const { policy, type } = toRefs(props)
            const { findActions } = useScopeService()
            const editToggle = ref(false)
            const showAll = ref(false)
            const ownersData = computed(() => ({
                ownerUsers: policy.value.users,
                ownerGroups: policy.value.groups,
            }))
            const splitAssets = computed(() =>
                splitArray(3, [
                    ...ownersData.value.ownerUsers.map((username) => ({
                        type: 'user',
                        value: username,
                    })),
                    ...ownersData.value.ownerGroups.map((name) => ({
                        type: 'group',
                        value: name,
                    })),
                ])
            )
            const getPopoverContent = (policy: any) =>
                `Are you sure you want to delete ${policy?.name}?`
            const actions = computed(
                () => findActions(policy.value.actions),
                type.value
            )
            const permissions = computed(() => {
                if (actions?.value?.length) {
                    const allPermissions = []
                    actions.value.forEach((action) => {
                        if (action?.action?.length)
                            action.action.forEach((a) => allPermissions.push(a))
                    })
                    return allPermissions
                }
                return []
            })
            const removePolicy = () => {
                /* Delete when the policy is saved */
                if (!policy.value?.isNew) emit('delete')
                emit('cancel')
            }
            const handleClickPlicyCard = () => {
                emit('clickCard', { ...policy.value, type: type.value })
            }
            const maskComputed = computed(
                () =>
                    maskPurpose.find((el) => el.value === policy.value.mask)
                        ?.label
            )
            const visibleDelete = ref(false)
            return {
                editToggle,
                splitAssets,
                showAll,
                ownersData,
                policy,
                getPopoverContent,
                removePolicy,
                actions,
                handleClickPlicyCard,
                permissions,
                maskComputed,
                visibleDelete,
            }
        },
    })
</script>
<style lang="less">
    .icon-gray {
        path {
            fill: #6f7590 !important;
        }
    }
    // .button-hidden {
    //     right: 10px;
    //     z-index: 2;
    //     bottom: 8px;
    //     background-color: transparent;
    //     background: none !important;
    // }
    .allow-icon {
        path {
            fill: #00a680 !important;
        }
    }
</style>
<style lang="less" scoped>
    .card-policy {
        min-height: 70px;
    }
    .container-policy-card {
        .default-s4 {
            display: none !important;
        }
        .button-hide {
            opacity: 0;
            transition: all ease 0.3s;
        }

        &:hover {
            .default-s4 {
                display: flex !important;
                position: absolute;
                right: 0;
                background: rgb(250, 250, 250);
                background: linear-gradient(
                    90deg,
                    rgba(250, 250, 250, 0.779171043417367) 32%,
                    rgba(250, 250, 250, 1) 53%
                );

                padding: 10px 0;
                width: 30%;
                top: 50%;
                transform: translateY(-50%);
            }
            .button-hide {
                opacity: 1;
                background-color: transparent !important;
            }
        }
    }
    .dot {
        height: 4px;
        width: 4px;
        background-color: #e6e6eb;
        border-radius: 50%;
    }
    .data-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .denied-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #fdf5f1;
        color: #e04f1a;
    }
    .card {
        box-shadow: 1px 2px 3px 3px rgba(0, 0, 0, 0.05);
    }
    .popover-delete {
        padding: 20px;
        max-width: 350px;
    }
    .btn-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
    }
</style>
