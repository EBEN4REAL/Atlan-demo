<template>
    <div class="flex flex-col py-6 border-b border-gray-300 gap-y-2 group">
        <div class="flex items-center mb-1 gap-x-3">
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

            <span class="ml-auto">SNOWFLAKE</span>
        </div>
        <div class="flex items-center gap-x-6">
            <span class="flex-none text-sm">
                <b>{{ policy.assets.length }}</b> assets selected
            </span>
            <div
                v-if="type === 'meta'"
                class="flex items-center mb-2 overflow-hidden gap-x-1"
            >
                <AtlanIcon class="text-gray-500" icon="Lock" />
                <span class="text-sm text-gray-500 truncate">{{
                    policy.actions
                }}</span>
            </div>
        </div>
        <div class="flex items-center">
            <PillGroup :data="assets" label-key="label" read-only />
            <AtlanBtn
                class="flex-none opacity-0 group-hover:opacity-100"
                size="sm"
                color="secondary"
                padding="compact"
                @click.prevent="$emit('edit')"
            >
                <AtlanIcon icon="Edit" class="-mx-1 text-gray" />
            </AtlanBtn>
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

    export default defineComponent({
        name: 'DataPolicy',
        components: {
            AtlanBtn,
            PillGroup,
        },
        props: {
            policy: {
                type: Object as PropType<DataPolicies | MetadataPolicies>,
                required: true,
            },
            type: {
                type: String as PropType<'meta' | 'data'>,
                required: true,
            },
        },
        emits: ['edit'],
        setup(props) {
            const { policy } = toRefs(props)
            const assets = computed(() =>
                policy.value.assets.map((name) => ({
                    label: name.split('/').slice(3).join('/'),
                }))
            )
            return { assets }
        },
    })
</script>

<style scoped>
    .data-policy-pill {
        @apply rounded-full text-sm px-2;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-sm px-2;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .denied-policy-pill {
        @apply rounded-full text-sm px-2;
        background-color: #fdf5f1;
        color: #e04f1a;
    }
</style>
