<template>
    <div
        class="flex flex-col py-4 mb-2 text-gray-500 border-b border-gray-300 rounded  hover:shadow"
        style="paddingleft: 12px; paddingroght: 12px"
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
    >
        <div class="flex items-center mb-4 gap-x-3">
            <span
                class="text-base font-bold text-gray"
                data-test-id="policy-name"
                >{{ policy.name }}</span
            >
            <span
                v-if="type === 'data'"
                class="data-policy-pill"
                data-test-id="policy-type"
                >Data Policy</span
            >
            <span
                v-else-if="type === 'meta'"
                class="metadata-policy-pill"
                data-test-id="policy-type"
                >Metadata Policy</span
            >
            <span v-if="!policy.allow" class="denied-policy-pill">
                {{ type === 'meta' ? 'Denied Permissions' : 'Denied Query' }}
            </span>
        </div>
        <div class="flex items-center mb-3 gap-x-6">
            <div
                v-if="type === 'meta'"
                class="flex items-center overflow-hidden gap-x-1"
            >
                <AtlanIcon class="flex-none -mt-1 text-gray-500" icon="Lock" />
                <div class="flex items-center">
                    <div
                        class="flex items-center"
                        v-if="actions[0].action.length > 0"
                    >
                        <span>{{ actions[0].label }}: &nbsp;</span>
                        <span>{{ actions[0].action.join(', ') }}</span>
                    </div>
                    <div
                        class="w-1 h-1 mx-1 bg-gray-300 rounded-full"
                        v-if="actions[1].action.length > 0"
                    ></div>
                    <div
                        class="flex items-center"
                        v-if="actions[1].action.length > 0"
                    >
                        <span>{{ actions[1].label }}: &nbsp;</span>
                        <span>{{ actions[1].action.join(', ') }}</span>
                    </div>
                    <div
                        class="w-1 h-1 mx-1 bg-gray-300 rounded-full"
                        v-if="actions[1].action.length > 0"
                    ></div>
                    <div
                        class="flex items-center mr-1.5"
                        v-if="actions[2].action.length > 0"
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
        </div>

        <div class="flex flex-wrap items-center gap-y-1.5">
            <div class="flex items-center gap-y-1.5 gap-x-2 flex-1 flex-wrap">
                <template
                    v-for="(item, index) in splitAssets.a"
                    :key="item + index"
                >
                    <UserPill
                        v-if="item.type === 'user'"
                        :username="item.value"
                        :allowDelete="false"
                    ></UserPill>
                    <GroupPill
                        v-else-if="item.type === 'group'"
                        :name="item.value"
                        :allowDelete="false"
                    ></GroupPill>
                </template>

                <template v-for="item in splitAssets.b" :key="item + index">
                    <UserPill
                        v-if="item.type === 'user'"
                        :username="item.value"
                        :allowDelete="false"
                    ></UserPill>
                    <GroupPill
                        v-else-if="item.type === 'group'"
                        :name="item.value"
                        :allowDelete="false"
                    ></GroupPill>
                </template>
                <div
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
                </div>
            </div>
            <div
                class="flex items-stretch border border-gray-300 rounded opacity-0  text-gray hover:text-primary"
                :class="editToggle ? 'opacity-100' : ''"
            >
                <AtlanBtn
                    class="flex-none px-2 border-l border-gray-300 border-none  hover:text-primary"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click.prevent="$emit('edit')"
                    data-test-id="policy-edit"
                >
                    <AtlanIcon icon="Pencil" class="" />
                </AtlanBtn>
                <div
                    class="h-full bg-gray-300"
                    style="width: 1px; height: 30px !important"
                ></div>

                <a-popconfirm
                    placement="leftTop"
                    :title="getPopoverContent(policy)"
                    ok-text="Yes"
                    :ok-type="'default'"
                    overlayClassName="popoverConfirm"
                    cancel-text="Cancel"
                    @confirm="removePolicy"
                >
                    <AtlanBtn
                        class="flex-none px-2 border-r border-gray-300 border-none  hover:text-red-500"
                        size="sm"
                        color="secondary"
                        data-test-id="policy-delete"
                        padding="compact"
                    >
                        <AtlanIcon icon="Delete" class="" />
                    </AtlanBtn>
                </a-popconfirm>
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
            const ownersData = computed(() => {
                return {
                    ownerUsers: policy.value.users,
                    ownerGroups: policy.value.groups,
                }
            })
            const splitAssets = computed(() =>
                splitArray(3, [
                    ...ownersData.value.ownerUsers.map((username) => {
                        return { type: 'user', value: username }
                    }),
                    ...ownersData.value.ownerGroups.map((name) => {
                        return { type: 'group', value: name }
                    }),
                ])
            )
            const getPopoverContent = (policy: any) => {
                return `Are you sure you want to delete ${policy?.name}?`
            }
            const actions = computed(() => findActions(policy.value.actions))
            const removePolicy = () => {
                /* Delete when the policy is saved */
                if (!policy.value?.isNew) emit('delete')
                emit('cancel')
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
            }
        },
    })
</script>

<style lang="less" scoped>
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
</style>
