<template>
    <div
        class="flex flex-wrap items-center gap-1 text-sm"
        data-test-id="owners-popover"
    >
        <a-popover
            v-model:visible="isEdit"
            placement="leftBottom"
            :overlay-class-name="$style.ownerPopover"
            :trigger="['click']"
            :destroy-tooltip-on-hide="destroyTooltipOnHide"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div class="">
                    <OwnerFacets
                        ref="ownerInputRef"
                        v-model="localValue"
                        :show-none="false"
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
            <PopOverUser :item="username">
                <UserPill
                    :username="username"
                    :allow-delete="!readOnly"
                    :enable-hover="enableHover"
                    @delete="handleDeleteUser"
                    @click="handleClickUser(username)"
                ></UserPill>
            </PopOverUser>
        </template>

        <template v-for="name in localValue?.ownerGroups" :key="name">
            <PopOverGroup :item="name">
                <GroupPill
                    :name="name"
                    :allow-delete="!readOnly"
                    :enable-hover="enableHover"
                    @delete="handleDeleteGroup"
                    @click="handleClickGroup(name)"
                ></GroupPill>
            </PopOverGroup>
        </template>
        <span
            class="-ml-1 text-gray-500"
            v-if="
                readOnly &&
                localValue?.ownerGroups?.length < 1 &&
                localValue?.ownerUsers?.length < 1
            "
            >No owners assigned</span
        >
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        Ref,
        ref,
        toRefs,
        PropType,
        watch,
    } from 'vue'

    // Utils
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
    } from '@vueuse/core'

    // Components
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import PopOverGroup from '@/common/popover/user/groups.vue'

    // Composables
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'OwnersWidget',
        components: {
            UserPill,
            GroupPill,
            AtlanIcon,
            OwnerFacets,
            PopOverUser,
            PopOverGroup,
        },
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
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { selectedAsset } = toRefs(props)

            const localValue = ref(modelValue.value)

            const { ownerGroups, ownerUsers } = useAssetInfo()

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
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
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

            watch(selectedAsset, () => {
                localValue.value.ownerUsers = ownerUsers(selectedAsset.value)
                localValue.value.ownerGroups = ownerGroups(selectedAsset.value)
            })

            return {
                ownerGroups,
                ownerUsers,
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
