<template>
    <div class="py-6 border-b border-gray-300">
        <AssetSelectorDrawer
            v-if="connectorData.attributeValue"
            v-model:visible="assetSelectorVisible"
            v-model:assets="policy.assets"
            :connection-qf-name="connectorData.attributeValue"
        />
        <div class="flex justify-between mb-6">
            <div>
                <div class="relative mb-2 text-sm text-gray-500 required">
                    Policy name
                </div>
                <div class="max-w-xs">
                    <a-input
                        :ref="
                            (el) => {
                                policyNameRef = el
                            }
                        "
                        v-model:value="policy.name"
                        placeholder="Policy Name"
                    />
                </div>
            </div>
            <AtlanBtn
                size="sm"
                color="secondary"
                padding="compact"
                class="plus-btn"
                @click="removePolicy"
                ><AtlanIcon icon="Delete" class="-mx-1 text-red-400"></AtlanIcon
            ></AtlanBtn>
        </div>

        <span class="mb-2 text-sm text-gray-500 required">Connection</span>
        <Connector
            v-model:data="connectorData"
            class="max-w-xs mb-6"
            :disabled="!policy?.isNew"
            @change="handleConnectorChange"
            :ref="
                (el) => {
                    connectorComponentRef = el
                }
            "
        />

        <div class="flex items-center mb-2 gap-x-1">
            <AtlanIcon class="text-gray-500" icon="AssetsInactive" />
            <span class="text-sm text-gray-500">Assets</span>
        </div>
        <div
            class="flex flex-wrap items-center flex-grow gap-x-1 gap-y-1.5 mb-4"
        >
            <PillGroup
                v-model:data="assets"
                label-key="label"
                @add="openAssetSelector"
            />
        </div>
        <div class="flex items-center mb-2 gap-x-1">
            <AtlanIcon class="text-gray-500" icon="Lock" />
            <span class="text-sm text-gray-500">Metadata permissions</span>
        </div>
        <MetadataScopes v-model:actions="policy.actions" class="mb-6" />
        <div class="flex items-center gap-x-2">
            <a-switch
                :checked="!policy.allow"
                @update:checked="policy.allow = !$event"
            />
            <span>Deny Permissions</span>
            <a-tooltip placement="right" color="white">
                <AtlanIcon
                    icon="Overview"
                    class="opacity-50 hover:opacity-100"
                />
                <template #title>
                    <p class="m-3 text-gray">
                        This will deny the permissions you have selected above,
                        for all the users in the persona, even if they had
                        access to those permissions via some other persona or
                        purpose.
                    </p>
                </template>
            </a-tooltip>

            <AtlanBtn
                class="ml-auto"
                size="sm"
                color="secondary"
                padding="compact"
                @click="$emit('cancel')"
                >Cancel</AtlanBtn
            >
            <AtlanBtn
                size="sm"
                color="primary"
                padding="compact"
                @click="handleSave"
                >Save</AtlanBtn
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import Connector from './connector.vue'
    import MetadataScopes from './metadataScopes.vue'
    import AssetSelectorDrawer from '../assets/assetSelectorDrawer.vue'
    import { useConnectionsStore } from '~/store/connections'

    import { MetadataPolicies } from '~/types/accessPolicies/personas'
    import {} from '../composables/useEditPersona'

    export default defineComponent({
        name: 'MetadataPolicy',
        components: {
            AtlanBtn,
            Connector,
            MetadataScopes,
            PillGroup,
            AssetSelectorDrawer,
        },
        props: {
            policy: {
                type: Object as PropType<MetadataPolicies>,
                required: true,
            },
        },
        emits: ['delete', 'save', 'cancel'],
        setup(props, { emit }) {
            const { policy } = toRefs(props)
            const assetSelectorVisible = ref(false)
            const connectorComponentRef = ref()
            const policyNameRef = ref()
            const connectionStore = useConnectionsStore()
            function removePolicy() {
                emit('delete')
            }

            function openAssetSelector() {
                if (!connectorData.value.attributeValue) {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                } else {
                    assetSelectorVisible.value = true
                }
            }

            const assets = computed({
                get: () =>
                    policy.value.assets.map((name) => ({
                        label: name,
                    })),
                set: (val) => {
                    policy.value.assets = val.map((ast) => ast.label)
                },
            })
            const handleConnectorChange = () => {
                policy.value.assets = []
            }
            const handleSave = () => {
                if (!policy.value.name) {
                    policyNameRef.value?.focus()
                    return
                } else if (!connectorData.value.attributeValue) {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                } else {
                    emit('save')
                }
            }

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

            return {
                handleSave,
                policyNameRef,
                handleConnectorChange,
                connectorComponentRef,
                connectorData,
                assetSelectorVisible,
                removePolicy,
                openAssetSelector,
                assets,
            }
        },
    })
</script>
<style lang="less" scoped>
    .required:after {
        content: ' *';
        color: red;
    }
    .plus-btn:focus {
        border-color: #7b9ce3;
        border-right-width: 1 px !important;
        outline: 0;
        box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
    }
</style>
