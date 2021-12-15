<template>
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
                {{ selectedPersonaDirty?.name }} policy
            </div>
        </div>
        <div class="flex items-center">
            <AtlanIcon icon="Policies" class="mr-1" />
            <span class="text-neutral-600"
                >{{ policyType === 'meta' ? 'Metadata Policy' : 'Data Policy' }}
            </span>
        </div>
    </div>
    <div class="p-5">
        <div class="font-bold base text-neutral-500">Detailed Info</div>
        <div class="relative mt-8">
            <div class="relative mb-2 text-sm text-gray-500 required">
                Policy name <span class="text-red-500">*</span>
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
                    @blur="
                        () => {
                            if (!policy.name) rules.policyName.show = true
                            else rules.policyName.show = false
                        }
                    "
                />
            </div>
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
                class="mb-6"
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
        <div class="mt-7">
            <div class="flex justify-between">
                <div class="text-gray-500">
                    Asset <span class="text-red-500">*</span>
                </div>
                <div v-if="!isAddAll" class="flex">
                    <AtlanBtn
                        class="flex-none"
                        size="sm"
                        color="minimal"
                        padding="compact"
                        @click="addConnectionAsset"
                    >
                        <span class="text-primary"> Add All </span>
                        <AtlanIcon icon="Add" class="ml-1 text-primary" />
                    </AtlanBtn>
                    <span
                        class="pt-2 pl-1 pr-1 text-xs text-gray-500 bg-gray-100"
                        >OR</span
                    >
                    <AtlanBtn
                        class="flex-none"
                        size="sm"
                        color="minimal"
                        padding="compact"
                        @click="handleAddAsset"
                    >
                        <span class="text-primary"> Select</span>
                        <AtlanIcon icon="Add" class="ml-1 text-primary" />
                    </AtlanBtn>
                </div>
            </div>
            <div
                v-if="policy.assets?.length === 0"
                class="flex items-center p-2 mt-1 border border-dashed border-bottom border-slate-300"
            >
                <span class="p-2 text-xs text-gray-500">
                    Select the assets your policy should apply to, or
                    <strong>Add All</strong> to apply the policy to all assets
                </span>
            </div>
            <div
                v-else
                class="p-2 mt-1 border border-solid border-bottom border-slate-300"
            >
                <div
                    v-for="asset in policy.assets"
                    :key="asset"
                    class="flex items-center justify-between p-1 cursor-pointer hover:bg-primary-light wrapper-asset"
                >
                    <span class="asset-name">
                        {{ asset }}
                    </span>
                    <AtlanBtn
                        class="flex-none btn-delete-asset"
                        size="sm"
                        color="minimal"
                        padding="compact"
                        @click="handleDeleteAsset(asset)"
                    >
                        <AtlanIcon icon="Add" class="ml-1 text-primary" />
                    </AtlanBtn>
                </div>
            </div>
        </div>
        <div class="mt-7">
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
                    <AtlanIcon icon="ArrowRight" class="ml-1 text-primary" />
                </AtlanBtn>
            </div>
            <div
                class="flex items-center p-2 mt-1 border border-dashed border-bottom border-slate-300"
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
                        class="tag-permission"
                    >
                        {{ el }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between">
            <div class="mt-4">
                <span>Deny Permissions</span>
                <a-tooltip placement="right" color="white">
                    <AtlanIcon icon="Overview" class="mx-2" />
                    <template #title>
                        <p class="m-3 text-gray">
                            This will deny the permissions you have selected
                            above, for all the users in the persona, even if
                            they had access to those permissions via some other
                            persona or purpose.
                        </p>
                    </template>
                </a-tooltip>
                <a-switch
                    :class="policy.allow ? `` : 'checked'"
                    data-test-id="toggle-switch"
                    class="ml-3"
                    :checked="!policy.allow"
                    style="width: 40px !important"
                    @update:checked="policy.allow = !$event"
                />
            </div>
            <AtlanBtn
                class="mt-4 ml-2"
                size="sm"
                padding="compact"
                @click="handleSave"
            >
                Save
            </AtlanBtn>
        </div>
        <AssetSelectorDrawer
            v-if="connectorData.attributeValue"
            v-model:visible="assetSelectorVisible"
            v-model:assets="policy.assets"
            :connection-qf-name="connectorData.attributeValue"
            class="drawerAddAsset"
            :get-container="'body'"
        />

        <a-drawer
            placement="right"
            :closable="false"
            :visible="isShow"
            :width="450"
            :mask="false"
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
    import Connector from './policies/connector.vue'
    import { selectedPersonaDirty } from './composables/useEditPersona'
    import { useConnectionStore } from '~/store/connection'
    import AssetSelectorDrawer from './assets/assetSelectorDrawer.vue'
    import { MetadataPolicies } from '~/types/accessPolicies/purposes'
    import ManagePermission from './policies/managePermission.vue'

    export default defineComponent({
        name: 'AddPolicy',
        components: {
            AtlanBtn,
            Connector,
            AssetSelectorDrawer,
            ManagePermission,
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
            width: {
                type: Number,
                required: false,
            },
            isEdit: {
                type: Boolean,
                required: false,
            },
            selectedPolicy: {
                type: Object,
                required: false,
            },
        },
        emits: ['close'],
        setup(props, { emit }) {
            const policyType = ref('')
            const assetSelectorVisible = ref(false)
            const isShow = ref(false)
            const policyNameRef = ref()
            const connectorComponentRef = ref()
            const { showDrawer, type, width, isEdit, selectedPolicy } =
                toRefs(props)
            const policy = ref({})
            const connectionStore = useConnectionStore()
            const isAddAll = ref(false)
            watch(isShow, () => {
                if (isShow.value) {
                    emit('changeWidth', 200)
                } else {
                    emit('changeWidth', 450)
                }
            })
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
            }
            const initPolicy = () => {
                isAddAll.value = false
                if (isEdit.value) {
                    policy.value = selectedPolicy.value
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
                            actions: [],
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
                emit('close')
            }
            const resetPolicy = () => {
                initPolicy()
            }
            watch(isShow, () => {
                if (isShow.value) {
                    setTimeout(() => {
                        emit('changeWidth', 200)
                    }, 100)
                } else {
                    setTimeout(() => {
                        emit('changeWidth', 450)
                    }, 100)
                }
            })
            watch(assetSelectorVisible, () => {
                if (assetSelectorVisible.value) {
                    setTimeout(() => {
                        emit('changeWidth', 200)
                    }, 100)
                } else {
                    setTimeout(() => {
                        emit('changeWidth', 450)
                    }, 100)
                }
            })
            const handleSave = () => {
                if (!policy.value.name) {
                    policyNameRef.value?.focus()
                    rules.value.policyName.show = true
                } else if (!connectorData.value.attributeValue) {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                    rules.value.connection.show = true
                } else if (policy.value.assets.length < 1) {
                    rules.value.assets.show = true
                } else if (policy.value.actions.length === 0) {
                    rules.value.metadata.show = true
                } else {
                    console.log(
                        connectorComponentRef.value.treeData,
                        policy.value
                    )
                    emit('save', type.value, policy.value)
                }
            }
            const selectedPermition = computed(() => {
                const result = []
                const assetsPermission = []
                const govermence = []
                policy.value.actions.forEach((el) => {
                    const splited = el.split('-')
                    const dataToShow = splited[1]
                    if (splited.length === 2) {
                        assetsPermission.push(dataToShow)
                    } else {
                        govermence.push(dataToShow)
                    }
                })
                if (assetsPermission.length > 0) {
                    result.push(`Assets : ${assetsPermission.join(', ')}`)
                }
                if (govermence.length > 0) {
                    result.push(`Governance : ${govermence.join(', ')}`)
                }
                return result
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
            }
        },
    })
</script>

<style lang="less">
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
        background-color: #f3f3f3;
        text-transform: capitalize;
        margin-top: 4px;
    }
</style>
