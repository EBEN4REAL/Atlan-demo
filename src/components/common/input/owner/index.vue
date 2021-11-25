<template>
    <div class="flex flex-wrap items-center gap-1 text-sm">
        <a-popover
            placement="leftBottom"
            :overlayClassName="$style.ownerPopover"
            @visibleChange="handleVisibleChange"
            :trigger="['click']"
            v-model:visible="isEdit"
            :destroyTooltipOnHide="destroyTooltipOnHide"
        >
            <template #content>
                <div class="">
                    <OwnerFacets
                        ref="ownerInputRef"
                        v-model="localValue"
                        :showNone="false"
                    ></OwnerFacets>
                </div>
            </template>
            <a-button
                v-if="!readOnly"
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
                :allowDelete="!readOnly"
                @delete="handleDeleteUser"
                :enableHover="enableHover"
            ></UserPill>
        </template>

        <template v-for="name in localValue?.ownerGroups" :key="name">
            <GroupPill
                :name="name"
                :allowDelete="!readOnly"
                @delete="handleDeleteGroup"
                :enableHover="enableHover"
            ></GroupPill>
        </template>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, Ref, ref, toRefs, watch } from 'vue'

    // Components
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    // Composables
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    // Utils
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
    } from '@vueuse/core'

    export default defineComponent({
        name: 'OwnersWidget',
        components: { UserPill, GroupPill, AtlanIcon, OwnerFacets },
        props: {
            readOnly: {
                type: Boolean,
                required: false,
                default: false,
            },
            modelValue: {
                type: Object,
                required: false,
                default: () => {},
            },
            enableHover: {
                type: Boolean,
                required: false,
                default: true,
            },
            destroyTooltipOnHide: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { readOnly, enableHover, destroyTooltipOnHide } =
                toRefs(props)
            const localValue = ref(modelValue.value)

            const isEdit = ref(false)

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            const handleClickGroup = (groupAlias: string) => {
                setGroupUniqueAttribute(groupAlias, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

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
            const handleDeleteGroup = (name) => {
                localValue.value.ownerGroups =
                    localValue.value?.ownerGroups.filter(
                        (item) => item !== name
                    )

                handleChange()
            }

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA'
            )
            const { o, Escape } = useMagicKeys()
            whenever(and(o, notUsingInput), () => {
                if (!isEdit.value) {
                    isEdit.value = true
                }
            })

            whenever(and(Escape), () => {
                if (isEdit.value) {
                    handleChange()
                    isEdit.value = false
                }
            })

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

            const handleVisibleChange = (visible) => {
                if (isEdit.value) {
                    if (ownerFacetRef.value?.forceFocus) {
                        ownerFacetRef.value?.forceFocus()
                    }
                }
                if (!visible) {
                    handleChange()
                }
            }

            return {
                enableHover,
                readOnly,
                handleClickUser,
                handleClickGroup,
                localValue,
                handleChange,
                handleDeleteUser,
                handleDeleteGroup,
                handleVisibleChange,
                isEdit,
                ownerFacetRef,
            }
        },
    })
</script>
<style lang="less" module>
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
