<template>
    <div class="p-5 border-b border-bottom border-slate-300">
        <div class="flex justify-between">
            <div class="text-lg font-bold">
                {{ selectedPersonaDirty?.name }} policy
            </div>
            <div class="flex">
                <AtlanBtn
                    class="flex-none"
                    size="sm"
                    color="secondary"
                    padding="compact"
                >
                    <AtlanIcon icon="Delete" class="-mx-1 text-black" />
                </AtlanBtn>
                <AtlanBtn class="ml-2" size="sm" padding="compact">
                    Save
                </AtlanBtn>
            </div>
        </div>
        <div class="flex items-center">
            <AtlanIcon icon="Policies" class="mr-1" />
            <span class="text-neutral-600"
                >{{ type === 'meta' ? 'Metadata Policy' : 'Data Policy' }}
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
                :disabled="!policy?.isNew"
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
                <div class="flex">
                    <AtlanBtn
                        class="flex-none"
                        size="sm"
                        color="minimal"
                        padding="compact"
                        @click="handleAddAsset"
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
                        <span class="text-primary"> Select All</span>
                        <AtlanIcon icon="Add" class="ml-1 text-primary" />
                    </AtlanBtn>
                </div>
            </div>
            <div
                class="flex items-center p-2 mt-1 border border-dashed border-bottom border-slate-300"
            >
                <span class="p-2 text-xs text-gray-500">
                    Select the assets your policy should apply to, or
                    <strong>Add All</strong> to apply the policy to all assets
                </span>
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
                >
                    <span class="text-primary"> Manage </span>
                    <AtlanIcon icon="ArrowRight" class="ml-1 text-primary" />
                </AtlanBtn>
            </div>
            <div
                class="flex items-center p-2 mt-1 border border-dashed border-bottom border-slate-300"
            >
                <span class="p-2 text-xs text-gray-500">
                    Select from set of permissions for your policy
                </span>
            </div>
        </div>
        <AssetSelectorDrawer
            v-if="connectorData.attributeValue"
            v-model:visible="assetSelectorVisible"
            v-model:assets="policy.assets"
            :connection-qf-name="connectorData.attributeValue"
            class="drawerAddAsset"
            :get-container="'body'"
        />
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

    export default defineComponent({
        name: 'AddPolicy',
        components: {
            AtlanBtn,
            Connector,
            AssetSelectorDrawer,
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
        },
        emits: [],
        setup(props, { emit }) {
            const assetSelectorVisible = ref(false)
            const policyNameRef = ref()
            const connectorComponentRef = ref()
            const { showDrawer, type } = toRefs(props)
            const policy = ref({})
            const connectionStore = useConnectionStore()
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
            const handleConnectorChange = () => {
                policy.value.assets = []
            }
            const initPolicy = () => {
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
            initPolicy()
            watch(showDrawer, () => {
                if (showDrawer.value) {
                    initPolicy()
                }
            })
            const handleAddAsset = () => {
                assetSelectorVisible.value = true
            }
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
            }
        },
    })
</script>
