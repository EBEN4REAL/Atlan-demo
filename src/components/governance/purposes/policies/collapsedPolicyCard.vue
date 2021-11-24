<template>
    <div
        class="flex flex-col py-4 mb-2 text-gray-500 border-b border-gray-300 rounded  group hover:shadow"
        style="paddingleft: 12px; paddingroght: 12px"
    >
        <div class="flex items-center mb-4 gap-x-3">
            <span class="text-base font-bold text-gray">{{ policy.name }}</span>
            <span v-if="type === 'data'" class="data-policy-pill"
                >Data Policy</span
            >
            <span v-else-if="type === 'meta'" class="metadata-policy-pill"
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
                    <span v-else>{{ policy.mask }}</span>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between w-full">
            <div style="width: 70%">
                <Owners
                    v-model:modelValue="ownersData"
                    :read-only="true"
                    :enable-hover="false"
                />
            </div>
            <div
                class="flex items-stretch border border-gray-300 rounded opacity-0  group-hover:opacity-100 text-gray hover:text-primary"
            >
                <AtlanBtn
                    class="flex-none px-2 border-l border-gray-300 border-none  hover:text-primary"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click.prevent="$emit('edit')"
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

    export default defineComponent({
        name: 'Purpose Policy',
        components: {
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
            const showAll = ref(false)
            const ownersData = computed(() => {
                return {
                    ownerUsers: policy.value.users,
                    ownerGroups: policy.value.groups,
                }
            })
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
        @apply rounded-full text-sm px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .denied-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #fdf5f1;
        color: #e04f1a;
    }
    .card {
        box-shadow: 1px 2px 3px 3px rgba(0, 0, 0, 0.05);
    }
</style>
