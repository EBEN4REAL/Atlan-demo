<template>
    <div class="flex flex-wrap gap-1 text-sm">
        <a-popover placement="leftBottom" class="owner-popover">
            <template #content>
                <OwnerFacets v-model="localValue"></OwnerFacets>
            </template>
            <a-button shape="circle" class="text-center">
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
        <template v-for="username in localValue?.ownerUsers" :key="username">
            <UserPill :username="username" :allowDelete="true"></UserPill>
        </template>

        <template v-for="name in localValue?.ownerGroups" :key="name">
            <GroupPill :name="name"></GroupPill>
        </template>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
    } from 'vue'

    import UserAvatar from '@/common/avatar/user.vue'
    import UserPill from '@/common/avatar/userPill.vue'
    import GroupPill from '@/common/avatar/groupPill.vue'

    import OwnerFacets from '@/common/facet/owners/index.vue'

    import { useVModels } from '@vueuse/core'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'OwnersWidget',
        components: { UserPill, GroupPill, AtlanIcon, OwnerFacets },
        props: {
            modelValue: {
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            watch(modelValue, () => {
                localValue.value = modelValue.value
            })

            return {
                localValue,
            }
        },
    })
</script>
<style lang="less" scoped>
    .owner-popover {
        :global(.ant-popover-content) {
            width: 250px !important;
        }
        :global(.ant-popover-inner-content) {
            @apply px-0 mx-0 !important;
            --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }
    }
</style>
