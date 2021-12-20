<template>
    <div class="relative add-policy-container">
        <div>
            <div class="relative p-5 border-b border-bottom border-slate-300">
                <div
                    v-if="showDrawer"
                    class="close-btn-add-policy"
                    @click="handleClose"
                >
                    <AtlanIcon icon="Add" class="text-white" />
                </div>
                <div class="flex justify-between">
                    <div class="text-lg font-bold">
                        {{ isEdit ? selectedPolicy.name : 'New policy' }}
                    </div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon icon="Policies" class="mr-1" />
                    <span class="mr-1 text-neutral-600"
                        >{{
                            policyType === 'meta'
                                ? 'Metadata Policy'
                                : 'Data Policy'
                        }}
                    </span>
                    <div class="ml-1 mr-1 dot" />
                    <span class="text-neutral-600">
                        {{ persona?.displayName }}
                    </span>
                </div>
            </div>
            <div class="p-5">
                <div class="relative mt-4">
                    <div class="relative mb-2 text-sm text-gray-500 required">
                        Name <span class="text-red-500">*</span>
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
                            @change="() => (rules.policyName.show = false)"
                            @blur="
                                () => {
                                    if (!policy.name)
                                        rules.policyName.show = true
                                    else rules.policyName.show = false
                                }
                            "
                        />
                    </div>
                    <!-- <div v-else>{{ policy.name }}</div> -->
                    <div
                        v-if="rules.policyName.show"
                        class="absolute text-xs text-red-500 -bottom-5"
                        data-test-id="policy-validation-name"
                    >
                        {{ rules.policyName.text }}
                    </div>
                </div>
                <div class="relative mt-6">
                    <div class="mb-2 text-sm text-gray-500 required">
                        Users / Groups <span class="text-red-500">*</span>
                    </div>
                    <Owners
                        :ref="
                            (el) => {
                                refOwners = el
                            }
                        "
                        v-model:modelValue="selectedOwnersData"
                        :edit-permission="true"
                        class="mb-6"
                        :read-only="false"
                        :destroy-tooltip-on-hide="true"
                        @change="handleOwnersChange"
                    />
                    <div
                        v-if="rules.users.show"
                        class="absolute text-xs text-red-500 -bottom-5"
                        data-test-id="policy-validation-owners"
                    >
                        {{ rules.users.text }}
                    </div>
                </div>
                <div v-if="policyType === 'meta'" class="mt-6">
                    <div class="flex justify-between">
                        <div class="text-gray-500">
                            Permissions <span class="text-red-500">*</span>
                        </div>
                        <AtlanBtn
                            class="flex-none"
                            size="sm"
                            color="minimal"
                            padding="compact"
                            @click="handleToggleManage"
                        >
                            <span class="text-primary"> Manage </span>
                            <AtlanIcon
                                icon="ArrowRight"
                                class="ml-1 text-primary"
                            />
                        </AtlanBtn>
                    </div>
                    <div
                        class="flex items-center p-2 mt-1 border rounded border-bottom border-slate-300"
                        :class="
                            selectedPermition.length === 0
                                ? 'border-dashed'
                                : 'border-solid'
                        "
                    >
                        <span
                            v-if="selectedPermition.length === 0"
                            class="p-2 text-xs text-gray-500"
                        >
                            Select from set of permissions for your policy
                        </span>
                        <div v-else>
                            <div
                                v-for="el in selectedPermition"
                                :key="el"
                                class="h-auto overflow-auto tag-permission max-h-32"
                            >
                                <div class="title-tag">{{ el.title }}</div>
                                <div class="value-tag">{{ el.value }}</div>
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
                </div>
                <div v-else>
                    <div class="flex flex-col mt-7 gap-y-2">
                        <div class="flex gap-1">
                            <AtlanIcon class="text-gray-500" icon="Lock" />
                            <span class="text-sm text-gray-500"
                                >Query permissions</span
                            >
                            <span class="text-red-500">*</span>
                        </div>
                        <div class="flex gap-1">
                            <AtlanIcon
                                class="h-3 mt-1 text-gray-500"
                                icon="RunSuccess"
                            />
                            <span class="text-sm text-gray-500"
                                >Query access allowed by default</span
                            >
                        </div>
                    </div>
                    <div class="flex items-center mb-2 gap-x-1 mt-7">
                        <span class="text-sm text-gray-500">Masking</span>
                    </div>

                    <DataMaskingSelector
                        v-model:maskType="policy.mask"
                        class="mb-6 w-80"
                    />
                </div>

                <div class="">
                    <div class="flex justify-between mt-4">
                        <div>
                            <span>Deny Permissions</span>
                            <a-tooltip placement="top" color="white">
                                <AtlanIcon icon="Overview" class="mx-2" />
                                <template #title>
                                    <p class="m-3 text-gray">
                                        This will deny the permissions you have
                                        selected above, for all the users in the
                                        persona, even if they had access to
                                        those permissions via some other persona
                                        or purpose.
                                    </p>
                                </template>
                            </a-tooltip>
                        </div>
                        <a-switch
                            :class="policy.allow ? `` : 'bg-red-600'"
                            data-test-id="toggle-switch"
                            class="ml-3"
                            :checked="!policy.allow"
                            style="width: 40px !important"
                            @update:checked="policy.allow = !$event"
                        />
                    </div>
                </div>
                <!-- <div
                    v-if="!policy.allow"
                    class="flex items-center justify-between"
                >
                    <div class="mt-4">
                        <span class="text-error">Denied Permissions</span>
                        <a-tooltip placement="top" color="white">
                            <AtlanIcon icon="Overview" class="mx-2" />
                            <template #title>
                                <p class="m-3 text-gray">
                                    The above permissions have been overidden
                                    for all the users in the persona, even if
                                    they have access to those permissions via
                                    some other persona or purpose
                                </p>
                            </template>
                        </a-tooltip>
                    </div>
                </div> -->

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
        <div class="flex button-container">
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
        <!-- <div v-else-if="isEdit && !canEdit">
            <div class="flex p-3 m-4 rounded bg-primary-light text-primary">
                <AtlanIcon icon="Overview" class="mt-1 mr-1"></AtlanIcon>
                <div>
                    You can only edit policies for connections in which you're
                    added as a owner.
                </div>
            </div>
        </div> -->
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
    import AtlanBtn from '@/UI/button.vue'
    import { selectedPersonaDirty } from './composables/useEditPurpose'
    import Owners from '~/components/common/input/owner/index.vue'
    import ManagePermission from './policies/managePermission.vue'
    import DataMaskingSelector from '~/components/governance/personas/policies/dataMaskingSelector.vue'
    import useScopeService from '../personas/composables/useScopeService'
    // import DataMaskingSelector from './policies/dataMaskingSelector.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    // import useScopeService from './composables/useScopeService'

    export default defineComponent({
        name: 'AddPolicy',
        components: {
            AtlanBtn,
            ManagePermission,
            DataMaskingSelector,
            Owners,
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
            const refOwners = ref()
            const isShow = ref(false)
            const policyNameRef = ref()
            const { showDrawer, type, isEdit, selectedPolicy } = toRefs(props)
            const policy = ref({})
            const isAddAll = ref(false)
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
            const initPolicy = () => {
                isAddAll.value = false
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
                        ownerUsers: selectedPolicy.value?.users,
                        ownerGroups: selectedPolicy.value?.groups,
                    }
                    selectedOwnersData.value = objOwner
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
                            actions: [],
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
                    policy.value.groups.length === 0
                ) {
                    rules.value.users.show = true
                } else if (
                    policy.value.actions.length === 0 &&
                    policyType.value === 'meta'
                ) {
                    rules.value.metadata.show = true
                } else {
                    emit('save', policyType.value, policy.value)
                }
            }
            const selectedPermition = computed(() => {
                const result = []
                const assetsPermission = []
                const govermence = []
                const assetsList = scopeList[0]
                const govermanceList = scopeList[1]
                policy.value.actions.forEach((el) => {
                    const findedAsset = assetsList.scopes.find(
                        (elc) => elc.value === el
                    )
                    const findedGovrmance = govermanceList.scopes.find(
                        (elc) => elc.value === el
                    )
                    if (findedAsset) {
                        assetsPermission.push(findedAsset.label)
                    }
                    if (findedGovrmance) {
                        govermence.push(findedGovrmance.label)
                    }
                })
                if (assetsPermission.length > 0) {
                    result.push({
                        title: `Assets :`,
                        value: assetsPermission.join(', '),
                    })
                }
                if (govermence.length > 0) {
                    result.push({
                        title: `Governance :`,
                        value: govermence.join(', '),
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
                    1
                ) {
                    rules.value.users.show = true
                } else {
                    rules.value.users.show = false
                }
            }
            return {
                selectedPersonaDirty,
                rules,
                policy,
                policyNameRef,
                isShow,
                handleToggleManage,
                handleSavePermission,
                isAddAll,
                handleClose,
                resetPolicy,
                handleSave,
                selectedPermition,
                policyType,
                splitName,
                handleChangeAssets,
                canEdit,
                selectedOwnersData,
                handleOwnersChange,
                refOwners,
            }
        },
    })
</script>

<style lang="less">
    .add-policy-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .button-container {
        justify-content: flex-end;
        border-top: solid 1px #e6e6eb;
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
    .close-btn-add-policy {
        // padding: 10px;
        height: 32px;
        width: 32px;
        background: #3e4359cc;
        position: fixed;
        border-radius: 50%;
        display: grid;
        place-items: center;
        transform: rotate(45deg);
        left: -40px;
        top: 20px;
        cursor: pointer;
    }
    .tag-permission {
        padding: 4px 8px;
        padding-top: 0px;
        display: flex;
        text-transform: capitalize;
        margin-top: 4px;
        .title-tag {
            min-width: 100px;
        }
        .value-tag {
            border-radius: 4px;
            padding: 4px 8px;
            background-color: #f3f3f3;
            @apply font-mono;
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
