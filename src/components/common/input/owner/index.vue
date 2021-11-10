<template>
    <div class="flex flex-wrap items-center gap-1 text-sm">
        <a-popover
            placement="leftBottom"
            class="owner-popover"
            @visibleChange="handleVisibleChange"
            :trigger="['click']"
            v-model:visible="isEdit"
        >
            <template #content>
                <OwnerFacets
                    ref="ownerFacetRef"
                    :key="guid"
                    v-model="localValue"
                ></OwnerFacets>
            </template>
            <a-button
                shape="circle"
                size="small"
                class="text-center shadow  hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, ref, toRefs, watch } from 'vue'

    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import { useMagicKeys, useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'OwnersWidget',
        components: { UserPill, GroupPill, AtlanIcon, OwnerFacets },
        props: {
            guid: {
                type: String,
                required: false,
            },
            modelValue: {
                type: Object,
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { guid } = toRefs(props)
            const localValue = ref(modelValue.value)

            const isEdit = ref(false)

            const dirtyTimestamp = ref()

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleDeleteUser = (username) => {
                localValue.value.ownerUsers =
                    localValue.value?.ownerUsers.filter(
                        (item) => item !== username
                    )

                handleChange()
            }

            // const { o, Escape, d } = useMagicKeys()

            // watch(o, (v) => {
            //     if (v) {
            //         console.log('o')
            //         if (!isEdit.value) {
            //             isEdit.value = true
            //         }
            //     }
            // })
            // watch(Escape, (v) => {
            //     if (v) {
            //         console.log('esc')
            //         if (isEdit.value) {
            //             isEdit.value = false
            //         }
            //     }
            // })

            const ownerFacetRef: Ref<null | HTMLInputElement> = ref(null)

            const handleVisibleChange = () => {
                console.log(isEdit.value)
                if (isEdit.value) {
                    if (ownerFacetRef.value?.forceFocus) {
                        ownerFacetRef.value?.forceFocus()
                    }
                }
                handleChange()
            }

            return {
                localValue,
                handleChange,
                handleDeleteUser,
                handleVisibleChange,
                isEdit,
                ownerFacetRef,
            }
        },
    })
</script>
<style lang="less" scoped>
    .owner-popover {
        :global(.ant-popover-content) {
            width: 250px !important;
        }
    }
</style>
