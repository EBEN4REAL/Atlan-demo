<template>
    <div class="flex flex-wrap gap-1 text-sm">
        <template v-for="username in localValue?.ownerUsers" :key="username">
            <UserPill
                :username="username"
                :allowDelete="true"
                @delete="handleDeleteUser"
            ></UserPill>
        </template>

        <template v-for="name in localValue?.ownerGroups" :key="name">
            <GroupPill :name="name" :allowDelete="true"></GroupPill>
        </template>
        <a-popover placement="leftBottom" class="owner-popover">
            <template #content>
                <OwnerFacets
                    :key="guid"
                    v-model="localValue"
                    @change="handleChange"
                ></OwnerFacets>
            </template>
            <a-button shape="circle" class="text-center">
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'

    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'OwnersWidget',
        components: { UserPill, GroupPill, AtlanIcon, OwnerFacets },
        props: {
            guid: {
                type: String,
                required: false,
            },
            modelValue: {
                type: Array,
                required: false,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { modelValue, guid } = toRefs(props)
            const localValue = ref(modelValue.value)
            watch(modelValue, () => {
                localValue.value = modelValue.value
            })
            const handleChange = () => {
                emit('change', localValue.value)
            }

            const handleDeleteUser = (username) => {
                localValue.value.ownerUsers =
                    localValue.value?.ownerUsers.filter(
                        (item) => item !== username
                    )
            }

            return {
                localValue,
                handleChange,
                handleDeleteUser,
                guid,
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
