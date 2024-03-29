<template>
    <div v-if="showDrawer" class="close-btn-sidebar" @click="handleClose">
        <AtlanIcon icon="Add" class="text-gray-700" />
    </div>
    <div class="bg-gray-100 add-policy-container">
        <div class="relative p-4 bg-white border-b border-gray-300">
            <div class="flex items-center">
                <div
                    class="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary-light -mt-0.5"
                >
                    <AtlanIcon
                        v-if="policyType === 'meta'"
                        icon="Policies"
                        class="icon-blue"
                    />
                    <AtlanIcon
                        v-if="policyType === 'data'"
                        icon="QueryGrey"
                        class="icon-blue-stroke"
                    />
                </div>
                <span class="ml-1 text-base font-bold"
                    >{{
                        policyType === 'meta'
                            ? 'Metadata Policy'
                            : 'Data Policy'
                    }}
                </span>
            </div>
        </div>
        <div class="flex-grow overflow-auto">
            <div
                v-if="policy.updatedBy || policy.createdBy"
                class="flex items-center px-6 py-4 text-sm text-gray-700 bg-gray-200"
            >
                <AtlanIcon icon="DateTime" class="mr-1 text-gray-700" />
                {{ policy.updatedBy ? 'Last updated by' : 'Created by' }}
                <AtlanIcon
                    v-if="
                        (policy.updatedBy || policy.createdBy)?.startsWith(
                            'service-account-apikey-'
                        )
                    "
                    class="h-3 mx-1"
                    icon="Key"
                />
                <Avatar
                    v-else
                    :image-url="imageUrl(policy.updatedBy || policy.createdBy)"
                    :allow-upload="false"
                    :avatar-name="policy.updatedBy || policy.createdBy"
                    :avatar-size="16"
                    :avatar-shape="'circle'"
                    class="mx-1 bg-primary-light"
                />

                {{
                    (policy.updatedBy || policy.createdBy)?.startsWith(
                        'service-account-apikey-'
                    )
                        ? 'API token'
                        : policy.updatedBy || policy.createdBy
                }}
                <div class="ml-1">
                    {{ useTimeAgo(policy.updatedAt || policy.createdAt).value }}
                </div>
            </div>
            <div class="my-4">
                <div class="px-4">
                    <div class="relative mt-2 bg-white shadow-section">
                        <div
                            class="p-3 text-sm font-bold text-gray-700 border-b"
                        >
                            Overview
                        </div>
                        <div class="relative p-3">
                            <div
                                class="relative mb-2 text-sm text-gray-500 required"
                            >
                                Name<span class="ml-1 text-red-500">*</span>
                            </div>
                            <div>
                                <a-input
                                    :ref="
                                        (el) => {
                                            policyNameRef = el
                                        }
                                    "
                                    v-model:value="policy.name"
                                    data-test-id="policy-edit-name"
                                    placeholder="Policy Name"
                                    @change="
                                        () => (rules.policyName.show = false)
                                    "
                                    @blur="
                                        () => {
                                            if (!policy.name)
                                                rules.policyName.show = true
                                            else rules.policyName.show = false
                                        }
                                    "
                                />
                            </div>
                            <div
                                v-if="rules.policyName.show"
                                class="mt-1 text-xs text-red-500"
                                data-test-id="policy-validation-name"
                            >
                                {{ rules.policyName.text }}
                            </div>
                        </div>
                    </div>
                    <div class="relative mt-4 bg-white shadow-section">
                        <div class="flex justify-between p-3 border-b">
                            <div class="text-sm font-bold text-gray-700">
                                Users and Groups<span class="ml-1 text-red-500"
                                    >*</span
                                >
                            </div>
                            <div
                                v-if="!allUser"
                                class="cursor-pointer"
                                @click="addAllUser"
                            >
                                <span class="text-sm text-primary">
                                    Include all users
                                </span>
                                <AtlanIcon
                                    icon="Add"
                                    class="w-4 h-4 -mt-1 text-primary"
                                />
                            </div>
                        </div>
                        <div class="relative p-3 overflow-y-scroll max-h-52">
                            <Owners
                                :ref="
                                    (el) => {
                                        refOwners = el
                                    }
                                "
                                v-model:modelValue="selectedOwnersData"
                                :align="{ offset: [-10, 230] }"
                                :edit-permission="true"
                                :read-only="false"
                                :destroy-tooltip-on-hide="true"
                                :show-add-btn="!allUser"
                                :show-empty-owner="false"
                                :custom-add-button="true"
                                @change="handleOwnersChange"
                                @changeData="allUser = ''"
                            >
                                <template #addButton>
                                    <div class="ml-1 cursor-pointer">
                                        <span class="text-sm text-primary">
                                            Add</span
                                        >
                                        <AtlanIcon
                                            icon="Add"
                                            class="ml-1 -mt-1 text-primary"
                                        /></div
                                ></template>
                                <template #users>
                                    <div
                                        v-if="allUser"
                                        class="flex items-center justify-between w-24 px-2 py-1 border border-gray-200 rounded-full"
                                        :class="'hover:bg-primary-light cursor-pointer ml-2'"
                                    >
                                        <span class="asset-name">
                                            All users
                                        </span>

                                        <AtlanIcon
                                            icon="Cross"
                                            class="h-3 ml-3 text-red-500 rotate-45"
                                            @click="allUser = ''"
                                        />
                                    </div>
                                </template>
                            </Owners>
                            <div
                                v-if="rules.users.show"
                                class="mt-2 text-xs text-red-500"
                                data-test-id="policy-validation-owners"
                            >
                                {{ rules.users.text }}
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 bg-white shadow-section">
                        <!-- meta policy  -->
                        <template v-if="policyType === 'meta'">
                            <div
                                class="flex items-center justify-between p-3 pb-2"
                            >
                                <div class="text-sm font-bold text-gray-700">
                                    Configure permissions
                                    <span class="text-red-500">*</span>
                                </div>
                                <a-button
                                    v-if="selectedPermission.length > 0"
                                    size="small"
                                    class="border-none text-primary"
                                    @click="handleToggleManage"
                                >
                                    Edit
                                    <AtlanIcon
                                        icon="ArrowRight"
                                        class="text-primary"
                                    />
                                </a-button>
                            </div>

                            <div
                                class="flex items-center p-3 border border-gray-200 border-dashed rounded border-bottom"
                            >
                                <span v-if="selectedPermission.length === 0">
                                    <a-button
                                        size="small"
                                        class="text-primary"
                                        @click="handleToggleManage"
                                    >
                                        Edit
                                        <AtlanIcon
                                            icon="ArrowRight"
                                            class="ml-1 text-primary"
                                        />
                                    </a-button>
                                </span>
                                <div v-else>
                                    <div
                                        v-for="(el, i) in selectedPermission"
                                        :key="el"
                                        class="flex flex-col h-auto overflow-auto tag-permission max-h-32"
                                        :class="
                                            i !==
                                                selectedPermission.length - 1 &&
                                            'mb-6'
                                        "
                                    >
                                        <div class="text-gray-500 title-tag">
                                            <AtlanIcon
                                                :icon="el.icon"
                                                class="mr-1"
                                            />
                                            {{ el.title }}
                                        </div>
                                        <div
                                            class="font-mono tracking-wide text-gray-700 value-tag"
                                        >
                                            {{ el.value }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="rules.metadata.show"
                                class="mt-2 text-xs text-red-500"
                                data-test-id="policy-validation-connector"
                            >
                                {{ rules.metadata.text }}
                            </div>
                            <!-- /// deny permission -->
                            <div class="p-3 bg-gray-100 rounded">
                                <div class="flex">
                                    <div>
                                        <span>Deny Permissions</span>
                                        <a-tooltip
                                            placement="top"
                                            color="white"
                                        >
                                            <AtlanIcon
                                                icon="Overview"
                                                class="mx-2"
                                            />
                                            <template #title>
                                                <p class="m-3 text-gray">
                                                    This will deny the
                                                    permissions you have
                                                    selected above, for all the
                                                    users in the persona, even
                                                    if they had access to those
                                                    permissions via some other
                                                    persona or purpose.
                                                </p>
                                            </template>
                                        </a-tooltip>
                                    </div>
                                    <a-switch
                                        :class="
                                            policy.allow ? `` : 'bg-red-600'
                                        "
                                        data-test-id="toggle-switch"
                                        class="ml-3"
                                        :checked="!policy.allow"
                                        style="width: 40px !important"
                                        @update:checked="policy.allow = !$event"
                                    />
                                </div>
                            </div>
                        </template>

                        <!-- for data policy only -->
                        <div v-if="policyType === 'data'">
                            <div
                                class="p-3 text-sm font-bold text-gray-700 border-b"
                            >
                                Querying Permissions
                            </div>

                            <div class="p-4 space-y-2">
                                <ToggleOption
                                    :selected="policy.allow"
                                    heading="Allow Query"
                                    icon-name="QueryOutputSuccess"
                                    sub-heading="Allowed query for assets present in this Purpose."
                                    @click="policy.allow = true"
                                />
                                <ToggleOption
                                    :selected="!policy.allow"
                                    heading="Deny Query"
                                    icon-name="QueryOutputFail"
                                    sub-heading="Denied query for assets present in this Purpose."
                                    @click="policy.allow = false"
                                />
                            </div>

                            <div v-if="policy.allow" class="p-4 border-t">
                                <div class="flex items-center mb-2 gap-x-1">
                                    <span class="text-sm text-gray-500">
                                        Masking (Optional)
                                    </span>
                                </div>

                                <DataMaskingSelector
                                    v-model:maskType="policy.mask"
                                    :type="'purpose'"
                                    class="w-80"
                                />
                            </div>
                        </div>
                    </div>

                    <a-drawer
                        placement="right"
                        :closable="false"
                        :visible="isShow"
                        :width="480"
                        :mask="false"
                        :destroy-on-close="true"
                        @close="handleToggleManage"
                    >
                        <ManagePermission
                            v-model:actions="policy.actions"
                            :visible-drawer="isShow"
                            @close="() => (isShow = false)"
                            @save="handleSavePermission"
                        />
                    </a-drawer>
                </div>
            </div>
        </div>
        <div
            class="flex items-center justify-end w-full p-3 bg-white border-t border-gray-300 gap-x-2"
        >
            <AtlanBtn
                size="sm"
                padding="compact"
                color="minimal"
                class="btn-submit"
                @click="handleClose"
            >
                Cancel
            </AtlanBtn>
            <AtlanBtn
                size="sm"
                padding="compact"
                :disabled="isLoading"
                class="btn-submit"
                @click="handleSave"
            >
                {{ isLoading ? 'Saving' : isEdit ? 'Update' : 'Save' }}
            </AtlanBtn>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        watch,
        toRefs,
        computed,
    } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import AtlanBtn from '@/UI/button.vue'
    import { selectedPersonaDirty } from './composables/useEditPurpose'
    import Owners from '~/components/common/input/owner/index.vue'
    import ManagePermission from './policies/managePermission.vue'
    import DataMaskingSelector from '~/components/governance/personas/policies/dataMaskingSelector.vue'
    import useScopeService from '../personas/composables/useScopeService'
    import { IPersona } from '~/types/accessPolicies/personas'
    import Avatar from '~/components/common/avatar/index.vue'
    import ToggleOption from '@/governance/shared/customToggleOption.vue'

    export default defineComponent({
        name: 'AddPolicy',
        components: {
            AtlanBtn,
            ToggleOption,
            ManagePermission,
            DataMaskingSelector,
            Owners,
            Avatar,
        },
        props: {
            type: {
                type: String as PropType<'meta' | 'data'>,
                required: true,
            },
            showDrawer: {
                type: Boolean,
                required: true,
            },
            savePolicyUI: {
                type: Function,
                required: false,
                default: () => {},
            },
            deletePolicyUI: {
                type: Function,
                required: false,
                default: () => {},
            },
            discardPolicy: {
                type: Function,
                required: false,
                default: () => {},
            },
            isEdit: {
                type: Boolean,
                required: false,
            },
            isLoading: {
                type: Boolean,
                required: false,
            },
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
            selectedPolicy: {
                type: Object,
                required: false,
            },
            whitelistedConnectionIds: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['close'],
        setup(props, { emit }) {
            // const { scopeList } = useScopeService().listScopes('persona')
            const { scopeList } = useScopeService().listScopes('purpose')
            const policyType = ref('')
            const allUser = ref('all-users')
            const refOwners = ref()
            const isShow = ref(false)
            const policyNameRef = ref()
            const { showDrawer, type, isEdit, selectedPolicy } = toRefs(props)
            const policy = ref({})
            const selectedOwnersData = ref({
                ownerUsers: [],
                ownerGroups: [],
            })
            const rules = ref({
                policyName: {
                    text: 'Enter a policy name!',
                    show: false,
                },
                users: {
                    text: 'Atleast one user is required!',
                    show: false,
                },
                metadata: {
                    text: 'Select atleast 1 permissions!',
                    show: false,
                },
            })
            const addAllUser = () => {
                const objOwner = {
                    ownerUsers: [],
                    ownerGroups: [],
                }
                refOwners.value.setLocalValue(objOwner)
                allUser.value = 'all-users'
                selectedOwnersData.value = objOwner
                rules.value.users.show = false
                policy.value.users = []
                policy.value.groups = []
            }
            const initPolicy = () => {
                rules.value = {
                    policyName: {
                        text: 'Enter a policy name!',
                        show: false,
                    },
                    users: {
                        text: 'Atleast one user is required!',
                        show: false,
                    },
                    metadata: {
                        text: 'Select atleast 1 permissions!',
                        show: false,
                    },
                }

                if (isEdit.value) {
                    policy.value = { ...selectedPolicy.value }
                    policyType.value = selectedPolicy.value?.type
                    const objOwner = {
                        ownerUsers:
                            selectedPolicy?.value?.users?.length === 1 &&
                            selectedPolicy?.value?.users[0] === 'all-users'
                                ? []
                                : selectedPolicy.value?.users,
                        ownerGroups: selectedPolicy.value?.groups,
                    }
                    selectedOwnersData.value = objOwner
                    if (
                        (selectedPolicy?.value?.users?.length !== 1 ||
                            selectedPolicy?.value?.users[0] !== 'all-users') &&
                        !selectedPolicy?.value?.allUsers
                    ) {
                        allUser.value = ''
                    }
                    if (refOwners.value) {
                        refOwners.value.setLocalValue(objOwner)
                    }
                } else {
                    selectedOwnersData.value = {
                        ownerUsers: [],
                        ownerGroups: [],
                    }
                    policyType.value = type.value
                    if (type.value === 'meta') {
                        policy.value = {
                            actions: [
                                'entity-read',
                                'entity-update',
                                'entity-create',
                                'entity-delete',
                                'entity-update-business-metadata',
                                // 'entity-update-classification',
                                'entity-add-classification',
                                'entity-remove-classification',
                            ],
                            allow: true,
                            name: '',
                            description: '',
                            isNew: true,
                            users: [],
                            groups: [],
                        }
                    }
                    if (type.value === 'data') {
                        policy.value = {
                            actions: ['select'],
                            mask: 'null',
                            allow: true,
                            name: '',
                            description: '',
                            isNew: true,
                            users: [],
                            groups: [],
                        }
                    }
                }
            }
            initPolicy()
            watch(showDrawer, () => {
                if (showDrawer.value) {
                    initPolicy()
                }
            })
            watch(selectedPolicy, () => {
                initPolicy()
            })

            const handleToggleManage = () => {
                isShow.value = true
            }
            const handleSavePermission = (prop) => {
                isShow.value = false
                policy.value.actions = prop
                rules.value.metadata.show = false
            }
            const handleClose = () => {
                if (isShow.value) {
                    isShow.value = false
                    setTimeout(() => {
                        emit('close')
                    }, 180)
                } else {
                    emit('close')
                }
            }
            const resetPolicy = () => {
                initPolicy()
            }
            const handleSave = () => {
                if (!policy.value.name) {
                    policyNameRef.value?.focus()
                    rules.value.policyName.show = true
                } else if (
                    policy.value.users.length === 0 &&
                    !allUser.value &&
                    policy.value.groups.length === 0
                ) {
                    rules.value.users.show = true
                } else if (
                    policy.value.actions.length === 0 &&
                    policyType.value === 'meta'
                ) {
                    rules.value.metadata.show = true
                } else {
                    const newPayload = {
                        ...policy.value,
                        users: allUser.value ? [] : policy.value.users,
                        groups: allUser.value ? [] : policy.value.groups,
                        allUsers: !!allUser.value,
                    }
                    emit('save', policyType.value, newPayload, isEdit.value)
                }
            }
            const selectedPermission = computed(() => {
                const result = []
                const assetsPermission = []
                const governance = []
                const assetsList = scopeList[0]
                const governanceList = scopeList[1]
                policy.value.actions.forEach((el) => {
                    const assetPermission = assetsList.scopes.find(
                        (elc) => elc.value === el
                    )
                    const governancePermission = governanceList.scopes.find(
                        (elc) => elc.value === el
                    )
                    if (assetPermission) {
                        assetsPermission.push(assetPermission.label)
                    }
                    if (governancePermission) {
                        governance.push(governancePermission.label)
                    }
                })
                if (assetsPermission.length > 0) {
                    result.push({
                        title: `Assets`,
                        value: assetsPermission.join(', '),
                        icon: 'Compass',
                    })
                }
                if (governance.length > 0) {
                    result.push({
                        title: `Governance`,
                        value: governance.join(', '),
                        icon: 'GovernanceCenter',
                    })
                }
                return result
            })
            const handleChangeAssets = () => {
                rules.value.assets.show = false
            }
            const splitName = (name) => {
                const splited = name.split('/')
                const sliced = splited.slice(2, splited.length)
                return sliced.join('/')
            }
            const canEdit = computed(() =>
                props.whitelistedConnectionIds.includes(
                    policy?.value?.connectionId
                )
            )
            const handleOwnersChange = () => {
                if (selectedOwnersData.value?.ownerUsers?.length > 0) {
                    policy.value.users = [
                        ...selectedOwnersData.value?.ownerUsers,
                    ]
                } else {
                    policy.value.users = []
                }
                if (selectedOwnersData.value?.ownerGroups?.length > 0) {
                    policy.value.groups = [
                        ...selectedOwnersData.value?.ownerGroups,
                    ]
                } else {
                    policy.value.groups = []
                }
                if (
                    selectedOwnersData.value?.ownerUsers?.length +
                        selectedOwnersData.value?.ownerGroups?.length <
                        1 &&
                    !allUser.value
                ) {
                    rules.value.users.show = true
                } else {
                    rules.value.users.show = false
                }
            }
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            return {
                selectedPersonaDirty,
                rules,
                policy,
                policyNameRef,
                isShow,
                handleToggleManage,
                handleSavePermission,
                handleClose,
                resetPolicy,
                handleSave,
                selectedPermission,
                policyType,
                splitName,
                handleChangeAssets,
                canEdit,
                selectedOwnersData,
                handleOwnersChange,
                refOwners,
                imageUrl,
                useTimeAgo,
                allUser,
                addAllUser,
            }
        },
    })
</script>

<style lang="less">
    .icon-blue {
        path {
            fill: #5277d7 !important;
        }
    }
</style>
<style lang="less" scoped>
    .shadow-section {
        box-shadow: 0px 1px 4px 0px #0000001f;
        border-radius: 8px !important;
    }
    .add-policy-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        .icon-blue {
            path {
                fill: #5277d7 !important;
                stroke: #5277d7 !important;
            }
        }
        .icon-blue-stroke {
            path {
                stroke: #5277d7 !important;
            }
        }
    }
    .button-container {
        justify-content: flex-end;
        padding: 16px;
        .btn-submit {
            width: 100px;
        }
    }
    .wrapper-asset {
        .asset-name {
            max-width: 320px;
        }
        &:hover {
            .btn-delete-asset {
                opacity: 1;
            }
        }
    }
    .btn-delete-asset {
        transform: rotate(45deg);
        opacity: 0;
        transition: all ease 0.3s;
    }
    .tag-permission {
        // padding: 4px 8px;
        // padding-top: 0px;
        // display: flex;
        text-transform: capitalize;
        // margin-top: 4px;
        // .title-tag {
        //     min-width: 100px;
        // }
        .value-tag {
            font-size: 12px !important;
        }
    }
    .dot {
        height: 4px;
        width: 4px;
        background-color: #e6e6eb;
        border-radius: 50%;
    }
    .edit-connector {
        .ant-select-arrow {
            display: none !important;
        }
        .selected-connetor {
            color: #3e4359;
        }
        .ant-select-selector {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            padding-left: 0 !important;
            cursor: default;
        }
    }
</style>
