<template>
    <div>
        <AssetSelectorDrawer
            v-if="connectorData.attributeValue"
            v-model:visible="assetSelectorVisible"
            v-model:assets="policy.assets"
            :connection-qf-name="connectorData.attributeValue"
        />
        <div class="flex items-center justify-between mb-6">
            <span class="text-base font-bold leading-8 text-gray-500"
                >{{ policy.name }} details</span
            >

            <AtlanBtn
                v-if="isEditing"
                size="sm"
                color="secondary"
                padding="compact"
                @click="removePolicy"
                ><AtlanIcon icon="Delete" class="-mx-1 text-red-400"></AtlanIcon
            ></AtlanBtn>
        </div>

        <span class="mb-2 text-sm text-gray-500">Name</span>
        <div class="max-w-xs mb-4">
            <a-input
                v-if="isEditing"
                v-model:value="policy.name"
                placeholder="Policy Name"
            />
            <span v-else>{{ policy.name }}</span>
        </div>

        <span class="mb-2 text-sm text-gray-500">Description</span>
        <div class="max-w-xs mb-4">
            <a-textarea
                v-if="isEditing"
                v-model:value="policy.description"
                show-count
                placeholder="About the policy"
                :maxlength="140"
                :auto-size="{ minRows: 1, maxRows: 3 }"
            />
            <span v-else>{{ policy.description }}</span>
        </div>

        <span class="mb-2 text-sm text-gray-500">Connection</span>
        <Connector
            v-model:data="connectorData"
            class="max-w-xs mb-4"
            :disabled="!isEditing"
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
                :read-only="!isEditing"
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
                :disabled="!isEditing"
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
        </div>
        <a-divider />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import Connector from '../connector.vue'
    import MetadataScopes from './metadataScopes.vue'
    import AssetSelectorDrawer from '../assets/assetSelectorDrawer.vue'
    import { useConnectionsStore } from '~/store/connections'

    import { MetadataPolicies } from '~/types/accessPolicies/personas'
    import { isEditing } from '../composables/useEditPersona'

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
        emits: ['delete'],
        setup(props, { emit }) {
            const { policy } = toRefs(props)
            const assetSelectorVisible = ref(false)
            const connectionStore = useConnectionsStore()
            function removePolicy() {
                emit('delete')
            }

            function openAssetSelector() {
                assetSelectorVisible.value = true
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
                connectorData,
                assetSelectorVisible,
                isEditing,
                removePolicy,
                openAssetSelector,
                assets,
            }
        },
    })
</script>
