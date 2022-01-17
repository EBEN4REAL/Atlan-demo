<template>
    <div
        class="relative bg-white border border-gray-300 rounded container-policy-card"
    >
        <div
            class="flex flex-col px-3 py-3 rounded cursor-pointer group hover:bg-gray-100 card-policy"
            :class="selectedPolicy.id === policy.id ? 'outline-primary' : ''"
            @click="handleClickPlicyCard"
        >
            <div class="flex items-center mb-1">
                <AtlanIcon
                    v-if="type === 'meta'"
                    icon="Settings"
                    class="-mt-0.5"
                />
                <AtlanIcon
                    v-if="type === 'data'"
                    icon="QueryGrey"
                    class="-mt-0.5"
                />
                <span
                    class="ml-1 tracking-wider text-gray-500 uppercase"
                    data-test-id="policy-type"
                    >{{
                        type === 'meta' ? 'Metadata Policy' : 'Data Policy'
                    }}</span
                >
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-x-3">
                    <div class="text-gray-700">
                        <span class="ml-1">{{ policy?.name }}</span>
                    </div>

                    <div class="flex justify-items-end">
                        <span v-if="splitAssets.a.length > 0" class="">
                            <strong>{{ splitAssets.a.length }}</strong>
                            {{ splitAssets.a.length === 1 ? 'user' : 'users' }}
                        </span>
                        <span
                            v-if="
                                splitAssets.b.length > 0 &&
                                splitAssets.a.length > 0
                            "
                            >,</span
                        >
                        <span v-if="splitAssets.b.length > 0" class="ml-2">
                            <strong>{{ splitAssets.b.length }}</strong>
                            {{
                                splitAssets.b.length === 1 ? 'Group' : 'Groups'
                            }}
                        </span>
                    </div>
                </div>
                <span v-if="!policy.allow" class="mr-5 denied-policy-pill">
                    {{
                        type === 'meta' ? 'Denied Permissions' : 'Denied Query'
                    }}
                </span>
            </div>
        </div>
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
                class="absolute flex-none px-2 border-r border-gray-300 border-none right-2 bottom-2 hover:text-red-500 button-hide"
                size="sm"
                color="secondary"
                data-test-id="policy-delete"
                padding="compact"
                @click="() => (visibleDelete = true)"
            >
                <AtlanIcon icon="Delete" class="" />
            </AtlanBtn>
        </a-popover>
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
            const removePolicy = () => {
                /* Delete when the policy is saved */
                if (!policy.value?.isNew) emit('delete')
                emit('cancel')
            }
            const handleClickPlicyCard = () => {
                emit('clickCard', { ...policy.value, type: type.value })
            }
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
            }
        },
    })
</script>
<style lang="less">
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
        .button-hide {
            opacity: 0;
            transition: all ease 0.3s;
        }
        &:hover {
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
