<template>
    <div
        class="relative pt-1 pb-1 border-b border-gray-300 container-policy-card last:border-0"
    >
        <div
            class="flex flex-col p-3 text-gray-500 rounded cursor-pointer group hover:bg-primary-light card-policy"
            :class="
                selectedPolicy.id === policy.id
                    ? 'outline-primary bg-primary-light'
                    : ''
            "
            @click="handleClickPlicyCard"
        >
            <!-- <div
                class="flex flex-col px-4 py-3 mb-1 text-gray-500 rounded cursor-pointer"
                @mouseover="
                    () => {
                        editToggle = true
                    }
                "
                @mouseout="
                    () => {
                        editToggle = false
                    }
                "
                @click="handleClickPlicyCard"
            > -->
            <div class="flex items-center gap-x-3">
                <span
                    class="text-base font-bold text-gray"
                    data-test-id="policy-name"
                >
                    {{ policy.name }}
                </span>
                <AtlanIcon
                    icon="ShieldBlank"
                    :class="policy.allow ? 'allow-icon' : ''"
                />
                <span v-if="!policy.allow" class="denied-policy-pill">
                    {{
                        type === 'meta' ? 'Denied Permissions' : 'Denied Query'
                    }}
                </span>
                <!-- <span
                    v-if="type === 'data'"
                    class="bg-gray-200 data-policy-pill"
                    data-test-id="policy-type"
                    >Data Policy</span
                > -->
                <span
                    class="p-1 ml-auto text-xs bg-gray-200 rounded"
                    data-test-id="policy-type"
                    >{{
                        type === 'meta' ? 'Metadata Policy' : 'Data Policy'
                    }}</span
                >
            </div>
            <!-- <div class="flex items-center mb-3 gap-x-6">
                <div
                    v-if="type === 'meta'"
                    class="flex items-center overflow-hidden gap-x-1"
                >
                    <AtlanIcon class="flex-none -mt-1 text-gray-500" icon="Lock" />
                    <div class="flex items-center">
                        <div
                            v-if="actions[0].action.length > 0"
                            class="flex items-center"
                        >
                            <span>{{ actions[0].label }}: &nbsp;</span>
                            <span>{{ actions[0].action.join(', ') }}</span>
                        </div>
                        <div
                            v-if="actions[1].action.length > 0"
                            class="w-1 h-1 mx-1 bg-gray-300 rounded-full"
                        ></div>
                        <div
                            v-if="actions[1].action.length > 0"
                            class="flex items-center"
                        >
                            <span>{{ actions[1].label }}: &nbsp;</span>
                            <span>{{ actions[1].action.join(', ') }}</span>
                        </div>
                        <div
                            v-if="actions[1].action.length > 0"
                            class="w-1 h-1 mx-1 bg-gray-300 rounded-full"
                        ></div>
                        <div
                            v-if="actions[2].action.length > 0"
                            class="flex items-center mr-1.5"
                        >
                            <span>{{ actions[2].label }}: &nbsp;</span>
                            <span>{{ actions[2].action.join(', ') }}</span>
                        </div>
                    </div>
                </div>
                <div
                    v-if="type === 'data'"
                    class="flex items-center overflow-hidden gap-x-1"
                >
                    <AtlanIcon
                        class="flex-none -mt-1.5 text-gray-500"
                        icon="Hash"
                    />
                    <div class="flex items-center mt-0.5">
                        <span v-if="policy.mask === 'null'">NONE</span>
                        <span v-else>{{ policy.mask?.replace('heka:', '') }}</span>
                    </div>
                </div>
            </div> -->

            <div class="flex flex-wrap items-center gap-y-1.5">
                <div
                    class="flex items-center gap-y-1.5 gap-x-2 flex-1 flex-wrap"
                >
                    <div class="flex mt-1 justify-items-end">
                        <AtlanIcon icon="User" class="" />
                        <span v-if="splitAssets.a.length > 0" class="ml-2">
                            <strong>{{ splitAssets.a.length }}</strong>
                            {{ splitAssets.a.length === 1 ? 'User' : 'Users' }}
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
                    <!-- <template
                        v-for="(item, index) in splitAssets.a"
                        :key="item + index"
                    >
                        <UserPill
                            v-if="item.type === 'user'"
                            :username="item.value"
                            :allow-delete="false"
                        ></UserPill>
                        <GroupPill
                            v-else-if="item.type === 'group'"
                            :name="item.value"
                            :allow-delete="false"
                        ></GroupPill>
                    </template> -->

                    <!-- <template v-for="item in splitAssets.b" :key="item + index">
                        <UserPill
                            v-if="item.type === 'user'"
                            :username="item.value"
                            :allow-delete="false"
                        ></UserPill>
                        <GroupPill
                            v-else-if="item.type === 'group'"
                            :name="item.value"
                            :allow-delete="false"
                        ></GroupPill>
                    </template> -->
                    <!-- <div
                        class="font-bold text-gray-500 cursor-pointer"
                        @click="
                            () => {
                                showAll = !showAll
                            }
                        "
                    >
                        <span v-if="!showAll && splitAssets.b.length > 0"
                            >Show {{ splitAssets.b.length }} more</span
                        >
                        <span v-else-if="showAll">Show less</span>
                    </div> -->
                </div>
                <div
                    class="flex items-stretch border border-gray-300 rounded opacity-0 text-gray hover:text-primary"
                    :class="editToggle ? 'opacity-100' : ''"
                >
                    <!-- <AtlanBtn
                        class="flex-none px-2 border-l border-gray-300 border-none hover:text-primary"
                        size="sm"
                        color="secondary"
                        padding="compact"
                        data-test-id="policy-edit"
                        @click.prevent="$emit('edit')"
                    >
                        <AtlanIcon icon="Pencil" class="" />
                    </AtlanBtn> -->
                    <!-- <div
                        class="h-full bg-gray-300"
                        style="width: 1px; height: 30px !important"
                    ></div> -->
                </div>
            </div>
            <!-- </div> -->
            <!-- <a-popconfirm
                placement="leftTop"
                :title="getPopoverContent(policy)"
                ok-text="Yes"
                :ok-type="'default'"
                overlay-class-name="popoverConfirm"
                cancel-text="Cancel"
                @confirm="removePolicy"
            >
                <AtlanBtn
                    class="absolute flex-none px-2 border-r border-gray-300 border-none hover:text-red-500 button-hidden"
                    size="sm"
                    color="secondary"
                    data-test-id="policy-delete"
                    padding="compact"
                >
                    <AtlanIcon icon="Delete" />
                </AtlanBtn>
            </a-popconfirm> -->
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
