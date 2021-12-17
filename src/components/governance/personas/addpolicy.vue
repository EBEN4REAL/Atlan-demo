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
                    <div v-if="isEdit ? canEdit : true">
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
                    <div v-else>{{ policy.name }}</div>
                    <div
                        v-if="rules.policyName.show"
                        class="absolute text-xs text-red-500 -bottom-5"
                        data-test-id="policy-validation-name"
                    >
                        {{ rules.policyName.text }}
                    </div>
                </div>
                <div class="relative mt-7">
                    <div class="mb-2 text-sm text-gray-500 required">
                        Connection <span class="text-red-500">*</span>
                    </div>
                    <Connector
                        :ref="
                            (el) => {
                                connectorComponentRef = el
                            }
                        "
                        v-model:data="connectorData"
                        :footer-node-content="'You can only view the connections in which you’re added as the owner.'"
                        :whitelisted-connections="
                            isEdit ? null : whitelistedConnectionIds
                        "
                        :show-empty-parents="isEdit ? true : false"
                        class="mb-6"
                        :class="isEdit ? 'edit-connector' : ''"
                        :disabled="isEdit"
                        @change="handleConnectorChange"
                        @blur="
                            () => {
                                if (!connectorData.attributeValue)
                                    rules.connection.show = true
                                else rules.connection.show = false
                            }
                        "
                    />
                    <div
                        v-if="rules.connection.show"
                        class="absolute text-xs text-red-500 -bottom-5"
                        data-test-id="policy-validation-connector"
                    >
                        {{ rules.connection.text }}
                    </div>
                </div>
                <div class="mt-5">
                    <div class="flex items-center justify-between">
                        <div class="text-gray-500">
                            Asset <span class="text-red-500">*</span>
                        </div>
                        <div
                            v-if="!isAddAll && isEdit ? canEdit : true"
                            class="flex"
                        >
                            <AtlanBtn
                                v-if="!isAddAll"
                                class="flex-none"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                @click="handleAddAsset"
                            >
                                <span class="text-primary"> Custom select</span>
                                <AtlanIcon
                                    icon="Add"
                                    class="ml-1 text-primary"
                                />
                            </AtlanBtn>
                            <span
                                v-if="policy.assets.length === 0"
                                class="pt-2 pl-1 pr-1 text-xs text-gray-500 bg-gray-100"
                                >OR</span
                            >
                            <AtlanBtn
                                v-if="policy.assets.length === 0"
                                class="flex-none"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                @click="addConnectionAsset"
                            >
                                <span class="text-primary"> Add All </span>
                                <AtlanIcon
                                    icon="Add"
                                    class="ml-1 text-primary"
                                />
                            </AtlanBtn>
                        </div>
                    </div>
                    <div
                        v-if="policy.assets?.length === 0"
                        class="flex items-center p-2 mt-1 border border-dashed rounded border-bottom border-slate-300"
                    >
                        <span class="p-2 text-xs text-gray-500">
                            Select the assets your policy should apply to, or
                            <strong>Add All</strong> to apply the policy to all
                            assets
                        </span>
                    </div>
                    <div
                        v-else
                        class="h-auto p-2 mt-1 overflow-auto border border-solid rounded border-bottom border-slate-300 max-h-32"
                    >
                        <div
                            v-for="asset in policy.assets"
                            :key="asset"
                            class="flex items-center justify-between p-1 wrapper-asset"
                            :class="
                                isEdit
                                    ? canEdit
                                    : true
                                    ? 'hover:bg-primary-light cursor-pointer'
                                    : ''
                            "
                        >
                            <span class="asset-name">
                                {{ splitName(asset) }}
                            </span>
                            <AtlanBtn
                                v-if="isEdit ? canEdit : true"
                                class="flex-none btn-delete-asset"
                                size="sm"
                                color="minimal"
                                padding="compact"
                                @click="handleDeleteAsset(asset)"
                            >
                                <AtlanIcon
                                    icon="Add"
                                    class="ml-1 text-primary"
                                />
                            </AtlanBtn>
                        </div>
                    </div>
                    <div
                        v-if="rules.assets.show"
                        class="mt-2 text-xs text-red-500"
                        data-test-id="policy-validation-connector"
                    >
                        {{ rules.assets.text }}
                    </div>
                </div>
                <div v-if="policyType === 'meta'" class="mt-5">
                    <div class="flex justify-between">
                        <div class="text-gray-500">
                            Permissions <span class="text-red-500">*</span>
                        </div>
                        <AtlanBtn
                            v-if="isEdit ? canEdit : true"
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
                        v-model:maskType="policy.maskType"
                        class="mb-6 w-80"
                    />
                </div>

                <div v-if="isEdit ? canEdit : true" class="">
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
                <div
                    v-else-if="!policy.allow"
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
                </div>
                <AssetSelectorDrawer
                    v-if="connectorData.attributeValue"
                    v-model:visible="assetSelectorVisible"
                    v-model:assets="policy.assets"
                    :connection-qf-name="connectorData.attributeValue"
                    class="drawerAddAsset"
                    :get-container="'body'"
                    @update:assets="handleChangeAssets"
                />

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
        <div v-if="isEdit ? canEdit : true" class="flex button-container">
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
        <div v-else-if="isEdit && !canEdit">
            <div class="flex p-3 m-4 rounded bg-primary-light text-primary">
                <AtlanIcon icon="Overview" class="mt-1 mr-1"></AtlanIcon>
                <div>
                    You can only edit policies for connections in which you're
                    added as a owner.
                </div>
            </div>
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
        onMounted,
    } from 'vue'
    import { useMagicKeys } from '@vueuse/core'
    import AtlanBtn from '@/UI/button.vue'
    import Connector from './policies/connector.vue'
    import { selectedPersonaDirty } from './composables/useEditPersona'
    import { useConnectionStore } from '~/store/connection'
    import AssetSelectorDrawer from './assets/assetSelectorDrawer.vue'
    // import { MetadataPolicies } from '~/types/accessPolicies/purposes'
    import ManagePermission from './policies/managePermission.vue'
    import DataMaskingSelector from './policies/dataMaskingSelector.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import useScopeService from './composables/useScopeService'

    export default defineComponent({
        name: 'AddPolicy',
        components: {
            AtlanBtn,
            Connector,
            AssetSelectorDrawer,
            ManagePermission,
            DataMaskingSelector,
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
            const { scopeList } = useScopeService().listScopes('persona')
            const policyType = ref('')
            const assetSelectorVisible = ref(false)
            const isShow = ref(false)
            const policyNameRef = ref()
            const connectorComponentRef = ref()
            const { showDrawer, type, isEdit, selectedPolicy } = toRefs(props)
            const policy = ref({})
            const connectionStore = useConnectionStore()
            const isAddAll = ref(false)
            const rules = ref({
                policyName: {
                    text: 'Enter a policy name!',
                    show: false,
                },
                connection: {
                    text: 'Connection is required!',
                    show: false,
                },
                assets: { text: 'Select atleast 1 asset!', show: false },
                metadata: {
                    text: 'Select atleast 1 permissions!',
                    show: false,
                },
            })
            const connectorData = computed({
                get: () => {
                    const found = connectionStore.getList.find(
                        (conn) => conn.guid === policy.value.connectionId
                    )
                    return {
                        attributeName: found ? 'connectionQualifiedName' : '',
                        attributeValue: found?.attributes?.qualifiedName,
                    }
                },
                set: (val) => {
                    const found = connectionStore.getList.find(
                        (conn) =>
                            conn.attributes?.qualifiedName ===
                            val.attributeValue
                    )
                    policy.value.connectionId = found?.guid
                },
            })
            const assets = computed({
                get: () => {
                    if (policy.value.assets.length > 0)
                        rules.value.assets.show = false
                    else rules.value.assets.show = true
                    return policy.value.assets.map((name) => ({
                        label: name,
                    }))
                },
                set: (val) => {
                    policy.value.assets = val.map((ast) => ast.label)
                    if (val.length > 0) rules.value.assets.show = false
                    else rules.value.assets.show = true
                },
            })
            const handleConnectorChange = () => {
                policy.value.assets = []
                rules.value.connection.show = false
            }
            const initPolicy = () => {
                isAddAll.value = false
                rules.value = {
                    policyName: {
                        text: 'Enter a policy name!',
                        show: false,
                    },
                    connection: {
                        text: 'Connection is required!',
                        show: false,
                    },
                    assets: { text: 'Select atleast 1 asset!', show: false },
                    metadata: {
                        text: 'Select atleast 1 permissions!',
                        show: false,
                    },
                }
                if (isEdit.value) {
                    const newArray = []
                    selectedPolicy.value.assets.forEach((el) =>
                        newArray.push(el)
                    )
                    policy.value = { ...selectedPolicy.value, assets: newArray }
                    policyType.value = selectedPolicy.value.type
                } else {
                    policyType.value = type.value
                    if (type.value === 'meta') {
                        policy.value = {
                            actions: [],
                            assets: [],
                            connectionId: '',
                            allow: true,
                            name: '',
                            description: '',
                            isNew: true,
                        }
                    }
                    if (type.value === 'data') {
                        policy.value = {
                            actions: ['select'],
                            assets: [],
                            connectionName: '',
                            connectionId: '',
                            maskType: 'null',
                            allow: true,
                            name: '',
                            description: '',
                            isNew: true,
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
            const handleAddAsset = () => {
                if (connectorData.value?.attributeValue) {
                    assetSelectorVisible.value = !assetSelectorVisible.value
                    rules.value.connection.show = false
                } else {
                    rules.value.connection.show = true
                }
            }
            const handleToggleManage = () => {
                isShow.value = true
            }
            const handleSavePermission = (prop) => {
                policy.value.actions = prop
                rules.value.metadata.show = false
            }
            const addConnectionAsset = () => {
                if (connectorData.value.attributeValue) {
                    assets.value = [
                        { label: connectorData.value.attributeValue },
                    ]
                    policy.value.assets = [connectorData.value.attributeValue]
                    isAddAll.value = true
                } else {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                    rules.value.connection.show = true
                }
            }
            const handleDeleteAsset = (asset) => {
                policy.value.assets = policy.value.assets.filter(
                    (el) => el !== asset
                )
                isAddAll.value = false
            }
            const handleClose = () => {
                if (assetSelectorVisible.value || isShow.value) {
                    assetSelectorVisible.value = false
                    isShow.value = false
                    setTimeout(() => {
                        emit('close')
                    }, 150)
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
                } else if (!connectorData.value.attributeValue) {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                    rules.value.connection.show = true
                } else if (policy.value.assets.length < 1) {
                    rules.value.assets.show = true
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
            onMounted(() => {
                window.addEventListener('keydown', (keyDown) => {
                    if (keyDown.keyCode === 27) {
                        handleClose()
                    }
                })
            })
            return {
                selectedPersonaDirty,
                rules,
                policy,
                policyNameRef,
                connectorData,
                connectorComponentRef,
                handleConnectorChange,
                assetSelectorVisible,
                handleAddAsset,
                isShow,
                handleToggleManage,
                handleSavePermission,
                addConnectionAsset,
                handleDeleteAsset,
                isAddAll,
                handleClose,
                showDrawer,
                resetPolicy,
                handleSave,
                selectedPermition,
                policyType,
                splitName,
                handleChangeAssets,
                canEdit,
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
