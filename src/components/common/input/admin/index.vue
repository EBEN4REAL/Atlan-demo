<template>
    <div
        class="flex flex-wrap items-center gap-1 text-sm"
        data-test-id="admins-popover"
    >
        <a-popover
            v-model:visible="isEdit"
            :placement="placementPos"
            :overlay-class-name="$style.adminPopover"
            :trigger="['click']"
            :destroy-tooltip-on-hide="destroyTooltipOnHide"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div class="">
                    <AdminFacets
                        ref="adminInputRef"
                        v-model="localValue"
                        :show-none="false"
                    ></AdminFacets>
                </div>
            </template>
            <a-button
                v-if="editPermission"
                shape="circle"
                size="small"
                class="text-center shadow hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>

        <template v-for="username in localValue?.adminUsers" :key="username">
            <PopOverUser :item="username">
                <UserPill
                    :username="username"
                    :allow-delete="editPermission"
                    :enable-hover="enableHover"
                    @delete="handleDeleteUser"
                    @click="handleClickUser(username)"
                ></UserPill>
            </PopOverUser>
        </template>

        <template v-for="name in localValue?.adminGroups" :key="name">
            <PopOverGroup :item="name">
                <GroupPill
                    :name="name"
                    :allow-delete="editPermission"
                    :enable-hover="enableHover"
                    @delete="handleDeleteGroup"
                    @click="handleClickGroup(name)"
                ></GroupPill>
            </PopOverGroup>
        </template>
        <span
            v-if="
                !editPermission &&
                localValue?.adminGroups?.length < 1 &&
                localValue?.adminUsers?.length < 1
            "
            class="-ml-1 text-gray-500"
            >No admins assigned</span
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
    import AdminFacets from '@/common/facet/admins/index.vue'

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

            AdminFacets,
            PopOverUser,
            PopOverGroup,
        },
        props: {
            editPermission: {
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
            placementPos: {
                type: String,
                default: 'leftBottom',
            },
            inProfile: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { selectedAsset, inProfile, editPermission } = toRefs(props)

            const localValue = ref(modelValue.value)

            const { adminGroups, adminUsers } = useAssetInfo()

            const isEdit = ref(false)

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }
            const setLocalValue = (objOwners) => {
                localValue.value = objOwners
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
                localValue.value.adminUsers =
                    localValue.value?.adminUsers.filter(
                        (item) => item !== username
                    )

                handleChange()
            }
            const handleDeleteGroup = (name) => {
                localValue.value.adminGroups =
                    localValue.value?.adminGroups.filter(
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
            whenever(
                and(o, notUsingInput, !inProfile.value, editPermission.value),
                () => {
                    if (!isEdit.value) {
                        isEdit.value = true
                    }
                }
            )

            whenever(and(Escape), () => {
                if (isEdit.value) {
                    handleChange()
                    isEdit.value = false
                }
            })

            const adminFacetRef: Ref<null | HTMLInputElement> = ref(null)

            const handleVisibleChange = (visible) => {
                if (isEdit.value) {
                    if (adminFacetRef.value?.forceFocus) {
                        adminFacetRef.value?.forceFocus()
                    }
                }
                if (!visible) {
                    handleChange()
                }
            }

            watch(selectedAsset, () => {
                console.log(adminGroups(selectedAsset.value))
                localValue.value.adminUsers = adminUsers(selectedAsset.value)
                localValue.value.adminGroups = adminGroups(selectedAsset.value)
            })

            return {
                adminGroups,
                adminUsers,
                handleClickUser,
                handleClickGroup,
                localValue,
                handleChange,
                handleDeleteUser,
                handleDeleteGroup,
                handleVisibleChange,
                isEdit,
                adminFacetRef,
                setLocalValue,
            }
        },
    })
</script>
<style lang="less" module>
    .adminPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
