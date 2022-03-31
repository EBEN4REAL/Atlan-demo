<template>
    <div data-test-id="owners-popover">
        <a-popover
            v-if="showPopover && editPermission"
            v-model:visible="isEdit"
            :placement="placementPos"
            :overlay-class-name="$style.ownerPopover"
            :trigger="['click']"
            :destroy-tooltip-on-hide="destroyTooltipOnHide"
            :align="align"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div v-if="showPopover">
                    <!-- Uncomment for request creation -->
                    <!-- <div -->
                    <!--     v-if="!editPermission && role !== 'Guest'" -->
                    <!--     class="px-3 py-2 mx-4 mb-3 bg-gray-100" -->
                    <!-- > -->
                    <!--     You don't have edit access. Suggest owners and -->
                    <!--     <span class="cursor-pointer text-primary"> -->
                    <!--         <a-popover placement="rightBottom"> -->
                    <!--             <template #content> -->
                    <!--                 <AdminList></AdminList> -->
                    <!--             </template> -->
                    <!--             <span>Admins</span> -->
                    <!--         </a-popover> -->
                    <!--     </span> -->
                    <!--     can review your request. -->
                    <!-- </div> -->

                    <!-- Uncomment for request creation -->
                    <div class="">
                        <OwnerFacets
                            ref="ownerInputRef"
                            v-model="localValue"
                            :show-none="false"
                        ></OwnerFacets>

                        <!-- <OwnerFacets -->
                        <!--     v-else -->
                        <!--     ref="ownerInputRef" -->
                        <!--     v-model="newOwners" -->
                        <!--     :show-none="false" -->
                        <!-- ></OwnerFacets> -->
                    </div>

                    <!-- Uncomment for request creation -->
                    <!-- <div -->
                    <!--     v-if="!editPermission && role !== 'Guest'" -->
                    <!--     class="flex items-center justify-end mx-2 mt-5 space-x-2" -->
                    <!-- > -->
                    <!--     <a-button @click="handleCancelRequest">Cancel</a-button> -->
                    <!--     <a-button -->
                    <!--         type="primary" -->
                    <!--         :loading="requestLoading" -->
                    <!--         @click="handleRequest" -->
                    <!--         class="bg-primary" -->
                    <!--         >Submit Request</a-button -->
                    <!--     > -->
                    <!-- </div> -->
                </div>
            </template>
        </a-popover>
        <div
            class="flex flex-wrap items-center gap-1 text-sm"
            :class="{ '-ml-1': !showAddBtn }"
        >
            <a-tooltip
                v-if="showAddBtn"
                placement="left"
                :title="
                    !editPermission
                        ? `You don't have permission to add owners to this asset`
                        : ''
                "
                :mouse-enter-delay="0.5"
            >
                <Shortcut
                    shortcut-key="o"
                    action="set owners"
                    placement="left"
                    :edit-permission="editPermission && showShortcut"
                >
                    <a-button
                        v-if="showAddBtn"
                        :disabled="!editPermission"
                        shape="circle"
                        size="small"
                        class="text-center shadow"
                        :class="{
                            editPermission:
                                'hover:bg-primary-light hover:border-primary',
                        }"
                        @click="() => (isEdit = true)"
                    >
                        <span
                            ><AtlanIcon
                                icon="Add"
                                class="h-3"
                            ></AtlanIcon></span
                    ></a-button>
                </Shortcut>
            </a-tooltip>

            <template
                v-for="username in localValue?.ownerUsers"
                :key="username"
            >
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

            <template v-for="name in localValue?.ownerGroups" :key="name">
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
                    !showAddBtn &&
                    localValue?.ownerGroups?.length < 1 &&
                    localValue?.ownerUsers?.length < 1
                "
                class="text-gray-600"
                >No owners assigned</span
            >
        </div>
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
        defineAsyncComponent,
    } from 'vue'

    // Utils
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
    } from '@vueuse/core'
    import { message } from 'ant-design-vue'

    // Components
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import PopOverGroup from '@/common/popover/user/groups.vue'
    import Shortcut from '@/common/popover/shortcut.vue'

    // Composables
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useCreateRequests } from '~/composables/requests/useCreateRequests'
    import whoami from '~/composables/user/whoami.ts'

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
            Shortcut,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
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
            showShortcut: {
                type: Boolean,
                required: false,
                default: false,
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
            showAddBtn: {
                type: Boolean,
                required: false,
                default: true,
            },
            showPopover: {
                type: Boolean,
                required: false,
                default: true,
            },
            align: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { selectedAsset, inProfile, editPermission } = toRefs(props)

            const localValue = ref(modelValue.value)

            const { ownerGroups, ownerUsers } = useAssetInfo()
            const requestLoading = ref()
            const { role } = whoami()
            const existingOwnerUsers = ref(ownerUsers(selectedAsset.value))
            const existingOwnerGroups = ref(ownerGroups(selectedAsset.value))
            const newOwners = ref()
            const isEdit = ref(false)

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({
                    allowed: ['about', 'assets', 'groups', 'Integrations'],
                })
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
                /*
                    Uncomment for request creation
                if (!props.editPermission) {
                    handleRequest()
                } else emit('change')
                */
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
                    if (props.editPermission) handleChange()
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
                if (!visible && props.editPermission) {
                    handleChange()
                }
            }

            watch(selectedAsset, () => {
                localValue.value.ownerUsers = ownerUsers(selectedAsset.value)
                localValue.value.ownerGroups = ownerGroups(selectedAsset.value)
            })

            const handleRequest = () => {
                newOwners.value.ownerUsers =
                    newOwners.value?.ownerUsers?.filter((el) => {
                        if (!existingOwnerUsers.value?.find((i) => i === el)) {
                            return el
                        }
                    })

                newOwners.value.ownerGroups =
                    newOwners.value?.ownerGroups?.filter((el) => {
                        if (!existingOwnerGroups.value?.find((i) => i === el)) {
                            return el
                        }
                    })
                if (
                    !newOwners.value?.ownerUsers?.length &&
                    !newOwners?.value?.ownerGroups?.length
                ) {
                    newOwners.value.ownerUsers = ownerUsers(selectedAsset.value)
                    newOwners.value.ownerGroups = ownerGroups(
                        selectedAsset.value
                    )

                    return
                }
                const {
                    error: requestError,
                    isLoading: isRequestLoading,
                    isReady: requestReady,
                } = useCreateRequests({
                    assetGuid: selectedAsset.value?.guid,
                    assetQf: selectedAsset.value?.attributes?.qualifiedName,
                    assetType: selectedAsset.value?.typeName,
                    requestType: 'ownerUsers',
                    ownerUsers: newOwners?.value?.ownerUsers,
                    ownerGroups: newOwners?.value?.ownerGroups,
                })
                whenever(requestError, () => {
                    if (requestError.value) {
                        message.error(`Request failed`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                whenever(requestReady, () => {
                    if (requestReady.value) {
                        message.success(`Request raised`)
                        isEdit.value = false
                        newOwners.value.ownerUsers = ownerUsers(
                            selectedAsset.value
                        )
                        newOwners.value.ownerGroups = ownerGroups(
                            selectedAsset.value
                        )
                        requestLoading.value = isRequestLoading.value
                    }
                })
            }
            const handleCancelRequest = () => {
                isEdit.value = false
            }

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
                setLocalValue,
                role,
                requestLoading,
                handleRequest,
                handleCancelRequest,
                newOwners,
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
