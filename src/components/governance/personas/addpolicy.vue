<template>
    <div v-if="showDrawer" class="close-btn-sidebar" @click="handleClose">
        <AtlanIcon icon="Add" class="text-gray-700" />
    </div>
    <div class="bg-gray-100 add-policy-container">
        <div>
            <div
                class="fixed top-0 z-10 w-full p-4 -mt-0.5 bg-white border-b border-gray-300"
            >
                <div class="flex items-center">
                    <div
                        v-if="type === 'meta'"
                        class="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary-light"
                    >
                        <AtlanIcon icon="Policies" class="icon-blue" />
                    </div>
                    <div
                        v-if="type === 'data'"
                        class="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary-light"
                    >
                        <AtlanIcon icon="QueryGrey" class="icon-blue-stroke" />
                    </div>
                    <span class="ml-1 text-base font-bold"
                        >{{
                            policyType === 'meta'
                                ? 'Metadata Policy'
                                : 'Data Policy'
                        }}
                    </span>
                    <!-- <div class="ml-1 font-semibold">
                        {{ isEdit ? selectedPolicy.name : 'New policy' }}
                    </div> -->
                    <!-- <div v-if="isEdit ? canEdit : true" class="flex ml-auto">
                        <AtlanBtn
                            size="md"
                            padding="compact"
                            class="px-6 py-0.5"
                            :disabled="
                                isLoading ||
                                !connectorData.attributeValue ||
                                !policy.name ||
                                !policy?.assets?.length ||
                                (policyType === 'meta' &&
                                    !selectedPermission.length)
                            "
                            @click="handleSave"
                        >
                            {{
                                isLoading ? 'Saving' : isEdit ? 'Update' : 'Add'
                            }}
                        </AtlanBtn>
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
            <div class="px-4 my-20 bg-gray-100">
                <div class="relative mt-2 bg-white shadow-section">
                    <div class="p-3 text-sm font-bold text-gray-700 border-b">
                        Overview
                    </div>
                    <div class="p-3">
                        <div class="relative">
                            <div
                                class="relative mb-2 text-sm text-gray-500 required"
                            >
                                Name<span class="text-red-500">*</span>
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
                            <div v-else>{{ policy.name }}</div>
                            <div
                                v-if="rules.policyName.show"
                                class="absolute text-xs text-red-500 -bottom-5"
                                data-test-id="policy-validation-name"
                            >
                                {{ rules.policyName.text }}
                            </div>
                        </div>
                        <div class="relative mt-4">
                            <div class="mb-2 text-sm text-gray-500 required">
                                Select a connection
                                <span class="text-red-500">*</span>
                            </div>
                            <Connector
                                :ref="
                                    (el) => {
                                        connectorComponentRef = el
                                    }
                                "
                                v-model:data="connectorData"
                                :footer-node-content="'You can only view the connections in which you’re added as an admin.'"
                                :whitelisted-connections="
                                    isEdit ? null : whitelistedConnectionIds
                                "
                                :filter-source-ids="
                                    policyType !== 'meta' ? BItypes : []
                                "
                                :show-empty-parents="isEdit ? true : false"
                                class="mb-2"
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
                    </div>
                </div>
                <div
                    v-if="connectorData.attributeValue"
                    class="mt-4 bg-white shadow-section"
                >
                    <div class="flex items-center justify-between p-3 border-b">
                        <div class="text-sm font-bold text-gray-700">
                            Asset selector

                            <span v-if="policyType === 'data'" class=""
                                >to allow <b>Query</b>
                            </span>
                            <span class="text-red-500">*</span>
                        </div>
                        <div
                            v-if="isEdit ? canEdit : true"
                            class="flex gap-x-1"
                        >
                            <div
                                v-if="!isAddAll"
                                :disabled="!connectorData.attributeValue"
                                class="cursor-pointer"
                                @click="addConnectionAsset"
                            >
                                <span class="text-sm text-primary">
                                    Include all
                                </span>
                                <AtlanIcon
                                    icon="Add"
                                    class="w-4 h-4 -mt-1 text-primary"
                                />
                            </div>
                            <div
                                v-if="!isAddAll && policy.assets.length > 0"
                                class="cursor-pointer"
                                @click="handleAddAsset"
                            >
                                <span
                                    class="h-5 mx-3 border-l border-gray-300 border-1"
                                />
                                <span class="text-sm text-primary"> Add</span>
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="ml-1 text-primary"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="p-2">
                        <div
                            class="flex flex-wrap h-auto gap-1 p-2 overflow-auto max-h-32"
                        >
                            <!-- <div
                                v-if="
                                    isEdit && !isAddAll
                                        ? canEdit
                                        : !isAddAll
                                        ? true
                                        : false
                                "
                                class="flex gap-x-1"
                            >
                                <a-button
                                    v-if="!disabledForm"
                                    size="small"
                                    class="w-8 h-8 border border-gray-200 rounded-full"
                                    @click="handleAddAsset"
                                >
                                    <AtlanIcon icon="Add" />
                                </a-button>
                            </div> -->
                            <div
                                v-for="asset in policy.assets"
                                :key="asset"
                                class="flex items-center justify-between px-2 py-1 border border-gray-200 wrapper-asset"
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
                            <!-- <div
                                v-if="
                                    isEdit && isAddAll
                                        ? canEdit
                                        : isAddAll
                                        ? true
                                        : false
                                "
                                class="flex gap-x-1"
                            >
                                <a-button
                                    v-if="!disabledForm"
                                    size="small"
                                    class="w-8 h-8 border border-gray-200 rounded-full"
                                    @click="handleAddAsset"
                                >
                                    <AtlanIcon icon="Pencil" />
                                </a-button>
                            </div> -->

                            <div
                                v-if="
                                    isEdit
                                        ? canEdit
                                        : true && policy.assets.length === 0
                                "
                                class="flex gap-x-1"
                            >
                                <div
                                    v-if="
                                        !isAddAll && policy.assets.length === 0
                                    "
                                    size="small"
                                    class="cursor-pointer"
                                    @click="handleAddAsset"
                                >
                                    <span class="text-primary"> Add</span>
                                    <AtlanIcon
                                        icon="ArrowRight"
                                        class="ml-1 text-primary"
                                    />
                                    <!-- <AtlanIcon icon="Add" /> -->
                                </div>
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
                </div>
                <div
                    v-if="policyType === 'meta' && connectorData.attributeValue"
                    class="mt-4 bg-white shadow-section"
                >
                    <div class="p-3 border-b">
                        <div class="flex justify-between">
                            <div class="text-sm font-bold text-gray-700">
                                Configure permissions
                                <span class="text-red-500">*</span>
                            </div>
                            <a-button
                                v-if="
                                    isEdit
                                        ? canEdit
                                        : true && selectedPermission.length > 0
                                "
                                size="small"
                                class="border-none text-primary"
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
                    </div>

                    <div class="flex items-center p-3 border-bottom">
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
                                v-for="(el, i) in selectedPermission"
                                :key="el"
                                class="flex flex-col h-auto mb-3 overflow-auto tag-permission max-h-32"
                                :class="
                                    i !== selectedPermission.length - 1 &&
                                    'mb-6'
                                "
                            >
                                <div
                                    class="mb-2 text-sm text-gray-500 title-tag"
                                >
                                    <AtlanIcon
                                        :icon="
                                            el.title.toLowerCase() === 'assets'
                                                ? 'AssetsInactiveLight'
                                                : 'GovernanceCenter'
                                        "
                                        class="h-4"
                                    />
                                    {{ el.title }}
                                </div>
                                <div
                                    class="font-mono text-xs tracking-wide value-tag"
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
                    <div class="p-3 pt-2 bg-gray-100 rounded-lg rounded-t-none">
                        <div
                            v-if="
                                isEdit
                                    ? canEdit
                                    : true && connectorData.attributeValue
                            "
                        >
                            <div class="flex mt-1">
                                <div>
                                    <span>Deny</span>
                                    <a-tooltip placement="top" color="white">
                                        <AtlanIcon
                                            icon="Overview"
                                            class="mx-2"
                                        />
                                        <template #title>
                                            <p class="m-3 text-gray">
                                                This will deny the permissions
                                                you have selected above, for all
                                                the users in the persona, even
                                                if they had access to those
                                                permissions via some other
                                                persona or purpose.
                                            </p>
                                        </template>
                                    </a-tooltip>
                                </div>
                                <a-switch
                                    :class="policy.allow ? `` : 'bg-red-600'"
                                    data-test-id="toggle-switch"
                                    class="ml-2"
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
                                <span class="text-error"
                                    >Denied Permissions</span
                                >
                                <a-tooltip placement="top" color="white">
                                    <AtlanIcon icon="Overview" class="mx-2" />
                                    <template #title>
                                        <p class="m-3 text-gray">
                                            The above permissions have been
                                            overidden for all the users in the
                                            persona, even if they have access to
                                            those permissions via some other
                                            persona or purpose
                                        </p>
                                    </template>
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="policyType === 'data' && connectorData.attributeValue"
                    class="mt-5 bg-white shadow-section"
                >
                    <div class="p-3 text-base font-bold text-gray-700 border-b">
                        Configure permissions
                    </div>
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
                    <div class="p-3">
                        <div class="flex items-center mb-2 gap-x-1">
                            <span class="text-sm text-gray-500"
                                >Masking(Optional)</span
                            >
                        </div>

                        <DataMaskingSelector
                            v-model:maskType="policy.type"
                            class="w-80"
                        />
                    </div>
                    <div class="p-3 bg-gray-100">
                        <div
                            v-if="
                                isEdit
                                    ? canEdit
                                    : true && connectorData.attributeValue
                            "
                        >
                            <div class="flex mt-4">
                                <div>
                                    <span>Deny Query</span>
                                    <a-tooltip placement="top" color="white">
                                        <AtlanIcon
                                            icon="Overview"
                                            class="mx-2"
                                        />
                                        <template #title>
                                            <p class="m-3 text-gray">
                                                This will deny the permissions
                                                you have selected above, for all
                                                the users in the persona, even
                                                if they had access to those
                                                permissions via some other
                                                persona or purpose.
                                            </p>
                                        </template>
                                    </a-tooltip>
                                </div>
                                <a-switch
                                    :class="policy.allow ? `` : 'bg-red-600'"
                                    data-test-id="toggle-switch"
                                    class="ml-2"
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
                                <span class="text-error"
                                    >Denied Permissions</span
                                >
                                <a-tooltip placement="top" color="white">
                                    <AtlanIcon icon="Overview" class="mx-2" />
                                    <template #title>
                                        <p class="m-3 text-gray">
                                            The above permissions have been
                                            overidden for all the users in the
                                            persona, even if they have access to
                                            those permissions via some other
                                            persona or purpose
                                        </p>
                                    </template>
                                </a-tooltip>
                            </div>
                        </div>
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
                    @close="assetSelectorVisible = false"
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
        <div
            v-if="isEdit ? canEdit : true"
            class="absolute bottom-0 flex items-center justify-end w-full p-3 bg-white border-t border-gray-300 gap-x-2"
        >
            <AtlanBtn
                size="sm"
                padding="compact"
                color="secondary"
                class="px-6 min-w-20"
                @click="handleClose"
            >
                Cancel
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
                class="px-6 min-w-20"
                @click="handleSave"
            >
                {{ isLoading ? 'Saving' : isEdit ? 'Update' : 'Save' }}
            </AtlanBtn>
        </div>
        <div v-else-if="isEdit && !canEdit">
            <div class="flex p-3 rounded bg-primary-light text-primary">
                <AtlanIcon icon="Overview" class="mt-1 mr-1"></AtlanIcon>
                <div>
                    You can only edit policies for connections in which you're
                    added as an admin.
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
    import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'

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
            const BItypes = getBISourceTypes()

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
                isShow.value = !isShow.value
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
                // remove default 'all asset'
                // if (!isAddAll.value) {
                //     handleDeleteAsset(connectorData.value.attributeValue)
                // }
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
                BItypes,
            }
        },
    })
</script>

<style lang="less">
    .shadow-section {
        box-shadow: 0px 1px 4px 0px #0000001f;
        border-radius: 8px !important;
    }
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
        .icon-blue {
            path {
                fill: #5277d7 !important;
            }
        }
        .icon-blue-stroke {
            path {
                stroke: #5277d7 !important;
            }
        }
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: scroll;
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
