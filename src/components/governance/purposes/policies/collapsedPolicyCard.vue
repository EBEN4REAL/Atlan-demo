<template>
    <div
        class="flex flex-col py-4 mb-2 border-b border-gray-300 rounded  group hover:shadow"
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
                <AtlanIcon class="flex-none text-gray-500" icon="Lock" />
                <span class="text-sm text-gray-500 truncate">{{
                    policy.actions.join(',')
                }}</span>
            </div>
        </div>
        <div class="flex items-center w-full">
            <div style="width: 70%">
                <Owners
                    v-model:modelValue="ownersData"
                    :read-only="true"
                    :enable-hover="false"
                />
            </div>
            <div style="width: 30%" class="flex justify-end">
                <AtlanBtn
                    class="flex-none opacity-0  group-hover:opacity-100 text-gray hover:text-primary"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click.prevent="$emit('edit')"
                >
                    <AtlanIcon icon="Edit" class="mr-0.5" /> Edit
                </AtlanBtn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import AtlanBtn from '@/UI/button.vue'
    import {
        DataPolicies,
        MetadataPolicies,
    } from '~/types/accessPolicies/personas'
    import Owners from '~/components/common/input/owner/index.vue'

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
        emits: ['edit'],
        setup(props) {
            const { policy, type } = toRefs(props)
            const ownersData = computed(() => {
                return {
                    ownerUsers: policy.value.users,
                    ownerGroups: policy.value.groups,
                }
            })

            return { ownersData }
        },
    })
</script>

<style scoped>
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
