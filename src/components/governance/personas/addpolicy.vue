<template>
    <div class="relative add-policy-container">
        <div>
            <div class="relative px-4 pt-5 pb-5">
                <div
                    v-if="showDrawer"
                    class="close-btn-add-policy"
                    @click="handleClose"
                >
                    <AtlanIcon icon="Add" class="text-white" />
                </div>
                <div class="flex items-center">
                    <AtlanIcon v-if="type === 'meta'" icon="Settings" />
                    <AtlanIcon v-if="type === 'data'" icon="QueryGrey" />
                    <span class="ml-1 font-semibold"
                        >{{
                            policyType === 'meta'
                                ? 'Metadata Policy'
                                : 'Data Policy'
                        }}
                    </span>
                    <!-- <div class="ml-1 font-semibold">
                        {{ isEdit ? selectedPolicy.name : 'New policy' }}
                    </div> -->
                </div>
                <!-- <div class="flex items-center">
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
                </div> -->
            </div>
            <div class="px-4">
                <div class="relative">
                    <div class="relative mb-2 text-sm text-gray-500 required">
                        Name of the Policy<span class="text-red-500">*</span>
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
                <div class="relative mt-5">
                    <div class="mb-2 text-sm text-gray-500 required">
                        Select a connection <span class="text-red-500">*</span>
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
                        @changeConnector="handleConnectorChange"
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
                <div v-if="connectorData.attributeValue" class="mt-5">
                    <div class="flex items-center justify-between">
                        <div class="text-gray-500">
                            Select assets

                            <span v-if="policyType === 'data'" class=""
                                >to allow <b>Query</b>
                            </span>
                            <span class="text-red-500">*</span>
                        </div>
                        <div
                            v-if="isEdit ? canEdit : true"
                            class="flex gap-x-1"
                        >
                            <a-button
                                v-if="!isAddAll"
                                size="small"
                                :disabled="!connectorData.attributeValue"
                                @click="addConnectionAsset"
                            >
                                <span class="text-primary">
                                    Include all assets</span
                                >
                            </a-button>
                            <a-button
                                v-if="!isAddAll && policy.assets.length > 0"
                                size="small"
                                @click="handleAddAsset"
                            >
                                <span class="text-primary"> Add</span>
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="ml-1 text-primary"
                                />
                            </a-button>
                        </div>
                    </div>

                    <div
                        class="flex flex-wrap h-auto gap-1 p-2 mt-1 overflow-auto border border-dashed rounded border-bottom border-slate-300 max-h-32"
                    >
                        <div
                            v-for="asset in policy.assets"
                            :key="asset"
                            class="flex items-center justify-between px-2 py-1 border border-gray-200 rounded wrapper-asset"
                            :class="
                                disabledForm
                                    ? ''
                                    : 'hover:bg-primary-light cursor-pointer'
                            "
                        >
                            <span class="asset-name">
                                {{ splitName(asset) }}
                            </span>

                            <!-- <AtlanBtn
                                v-if="isEdit ? canEdit : true"
                                class="flex-none btn-delete-asset"
                                size="sm"
                                color="minimal"
                                padding="compact"
                               
                            > -->
                            <AtlanIcon
                                v-if="!disabledForm"
                                icon="Cross"
                                class="h-3 ml-3 text-red-500 rotate-45"
                                @click="handleDeleteAsset(asset)"
                            />
                        </div>
                        <div
                            v-if="
                                isEdit
                                    ? canEdit
                                    : true && policy.assets.length === 0
                            "
                            class="flex gap-x-1"
                        >
                            <a-button
                                v-if="!isAddAll && policy.assets.length === 0"
                                size="small"
                                @click="handleAddAsset"
                            >
                                <span class="text-primary"> Add</span>
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="ml-1 text-primary"
                                />
                            </a-button>
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
                <div
                    v-if="policyType === 'meta' && connectorData.attributeValue"
                    class="mt-5"
                >
                    <div class="flex justify-between">
                        <div class="text-gray-500">
                            Select permissions
                            <span class="text-red-500">*</span>
                        </div>
                        <a-button
                            v-if="
                                isEdit
                                    ? canEdit
                                    : true && selectedPermission.length > 0
                            "
                            size="small"
                            class="text-primary"
                            :disabled="!connectorData.attributeValue"
                            @click="handleToggleManage"
                        >
                            Edit
                            <AtlanIcon
                                icon="ArrowRight"
                                class="ml-1 text-primary"
                            />
                        </a-button>
                    </div>

                    <div
                        class="flex items-center p-3 mt-1 border border-gray-200 border-dashed rounded border-bottom"
                    >
                        <span v-if="selectedPermission.length === 0">
                            <a-button
                                v-if="isEdit ? canEdit : true"
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
                                v-for="el in selectedPermission"
                                :key="el"
                                class="flex flex-col h-auto mb-3 overflow-auto tag-permission max-h-32"
                            >
                                <div class="text-gray-500 title-tag">
                                    {{ el.title }}
                                </div>
                                <div class="font-mono tracking-wide value-tag">
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
                </div>
                <div
                    v-if="policyType === 'data' && connectorData.attributeValue"
                >
                    <!-- <div class="flex flex-col mt-7 gap-y-2">
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
                    </div> -->
                    <div class="flex items-center mt-3 mb-2 gap-x-1">
                        <span class="text-sm text-gray-500"
                            >Masking(Optional)</span
                        >
                    </div>

                    <DataMaskingSelector
                        v-model:maskType="policy.type"
                        class="mb-6 w-80"
                    />
                </div>

                <div
                    v-if="
                        isEdit ? canEdit : true && connectorData.attributeValue
                    "
                    class=""
                >
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
                Cancel {{ policy.type }}
            </AtlanBtn>
            <AtlanBtn
                size="sm"
                padding="compact"
                :disabled="
                    isLoading ||
                    !connectorData.attributeValue ||
                    !policy.name ||
                    !policy?.assets?.length ||
                    (policyType === 'meta' && !selectedPermission.length)
                "
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
                    added as an owner.
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

            const rules = ref({
                policyName: {
                    text: 'Enter a policy name to identify your policy',
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
                // policy.value.assets = []
                rules.value.connection.show = false

                addConnectionAsset()
            }

            const isAddAll = computed(() => {
                if (policy.value.assets.length === 1) {
                    if (
                        policy.value.assets[0] ===
                        connectorData.value.attributeValue
                    ) {
                        return true
                    }
                }
                return false
            })

            const initPolicy = () => {
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
                    policy.value = selectedPolicy.value
                    policyType.value = type.value
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
                            type: 'null',
                            allow: true,
                            name: '',
                            description: '',
                            isNew: true,
                        }
                    }
                }
            }
            initPolicy()
            watch([showDrawer, selectedPolicy], () => {
                if (showDrawer.value) {
                    initPolicy()
                } else {
                    handleClose()
                }
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
                    policy.value.actions = [
                        'entity-read',
                        'entity-update',
                        'entity-create',
                        'entity-delete',
                        'link-assets',
                        'entity-update-business-metadata',
                        'entity-update-classification',
                        'add-terms',
                        'remove-terms',
                    ]
                } else {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                    rules.value.connection.show = true
                }
            }
            const handleDeleteAsset = (asset) => {
                policy.value.assets = policy.value.assets.filter(
                    (el) => el !== asset
                )
            }
            const handleClose = () => {
                if (assetSelectorVisible.value || isShow.value) {
                    assetSelectorVisible.value = false
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
                    emit('save', policyType.value, policy.value, isEdit.value)
                }
            }
            const selectedPermission = computed(() => {
                const result = []
                const assetsPermission = []
                const governance = []
                const assetsList = scopeList[0]
                const governanceList = scopeList[1]
                policy.value.actions.forEach((el) => {
                    const findedAsset = assetsList.scopes.find(
                        (elc) => elc.value === el
                    )
                    const findedGovernance = governanceList.scopes.find(
                        (elc) => elc.value === el
                    )
                    if (findedAsset) {
                        assetsPermission.push(findedAsset.label)
                    }
                    if (findedGovernance) {
                        governance.push(findedGovernance.label)
                    }
                })
                if (assetsPermission.length > 0) {
                    result.push({
                        title: `Assets`,
                        value: assetsPermission.join(', '),
                    })
                }
                if (governance.length > 0) {
                    result.push({
                        title: `Governance`,
                        value: governance.join(', '),
                    })
                }
                return result
            })
            const handleChangeAssets = () => {
                rules.value.assets.show = false
            }
            const splitName = (name) => {
                const splited = name.split('/')
                if (splited && splited.length === 3) {
                    // connection is selected
                    const found = connectionStore.getList.find(
                        (conn) => conn?.attributes?.qualifiedName === name
                    )
                    return 'All assets'
                }
                const sliced = splited.slice(3, splited.length)
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
            const disabledForm = computed(
                () => !!(isEdit.value && !canEdit.value)
            )
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
                selectedPermission,
                policyType,
                splitName,
                handleChangeAssets,
                canEdit,
                disabledForm,
            }
        },
    })
</script>

<style lang="less">
    .drawerAddAsset {
        .container-schema-tree {
            max-height: max-content !important;
        }
        .wrapper-asset-tree {
            height: calc(100vh - 14rem) !important;
            padding-bottom: 30px !important;
        }
    }
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
        text-transform: capitalize;
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
            border: none !important;
            box-shadow: none !important;
            cursor: default;
        }
    }
</style>
